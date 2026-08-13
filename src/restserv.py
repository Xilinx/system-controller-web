##
# Copyright (c) 2020 - 2022 Xilinx, Inc.  All rights reserved.
# Copyright (c) 2022 - 2026 Advanced Micro Devices, Inc.  All rights reserved.
#
# SPDX-License-Identifier: MIT
##
from flask import render_template
from flask_restful import Resource, request
from enum import Enum
from config_app import *
from term import *
from parse import *
from jnservice import *
import sys
import os
sys.path.insert(1, '/usr/share/raft/xclient/raft_services')
if os.path.isfile('/usr/share/raft/xclient/raft_services/pm_client.py'):
    from pm_client import *
##
# TODO :: Change parse data static to dynamic class for realtime data.
#parse = ParseDataStatic()
parse = ParseData()
deviname = ""
sc_app_path = app_config["sc_app_path"]
listtemp = Term.exec_cmd(sc_app_path + " -c listtemp\n")

def list_files_recursive(directory,bname): #add the files which is starts with board name.
    fileslist = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.startswith(bname.split('\n')[0]):
                fileslist.append(file)
    return list(set(fileslist))
class BootMode:
    active_bootmode = "-"
    @staticmethod
    def getActiveBootMode():
        return BootMode.active_bootmode
    @staticmethod
    def setBootMode(mode):
        BootMode.active_bootmode = mode
        if deviname.strip() == "VEK385":
            SysFactory.exec_cmd(sc_app_path +" -c setbootmode -t "+mode + "",SysFactory.TERMINAL) 
        else:
            SysFactory.exec_cmd(sc_app_path +" -c setbootmode -t "+mode + " -v alternate",SysFactory.TERMINAL)
        res = SysFactory.exec_cmd(sc_app_path +" -c reset",SysFactory.TERMINAL)           
        if res.startswith("ERROR") or "ERROR" in res:
            resp_json = {
                "status":"error"
                ,"data":res
            }
        else :
            resp_json = {
                "status":"success"
                ,"data":res
            } 
        return resp_json

class ReqFunctions:
    global sc_app_path
    @staticmethod
    def polls(params):
        gtemp_targ = ""
        if len(params) > 0:
            gtemp_targ = params[0]
        status_keys = request.args.getlist("status")
        try:
            result = {"temp":"-"}
            stat = "error"
            if checkJNK() == 0:
                stat = "success"
                response = Term.exec_cmd(sc_app_path+" -c gettemp -t "+gtemp_targ)
                result = parse.temperature(response)
            result["active_bootmode"] = BootMode.getActiveBootMode()
            if "usbstatus" in status_keys:
                usb_status_result = Term.exec_cmd(app_config["versalstatusscript"]).strip()
                result["usbstatus"] = usb_status_result
            resp_json = {
                "status":stat
                ,"data":result
            }
            return resp_json,200
        except Exception as e:
            resp_json = {
                "status":"error"
                ,"data":{"error":"%s"%e}
            }
            return resp_json,500
    def bootmode_set(mode):
        res = BootMode.setBootMode(mode)
        return res,200
    def jnlink():
        jnu = jnurl()
        return {"status":"success","data":jnu},200
class FuncReq(Resource):
    def get(self,):
        req = request.args.get('func')
        tar = request.args.get('params')
        params_req = request.args.get('params')
        params = params_req.split(",")
        
        if req.startswith('poll'):
            
            return ReqFunctions.polls(params)
        if req.startswith('jnlink'):
            return ReqFunctions.jnlink()
        if req.startswith('setbootmode'):
            if checkJNK() >= 1: 
                resp_json = { 
                    "status":"error"
                    ,"data": "Notebook kernel is running. Please stop running kernel."
                }                       
                return resp_json,200

            if len(params):
                return ReqFunctions.bootmode_set(params[0])
        resp_json = {
            "status":"error"
            ,"data":{"error":"Fail"}
        }
        return resp_json,500
class Poll(Resource):
    def get(self,):
        try:
            if checkJNK() >= 1: 
                resp_json = { 
                    "status":"error"
                    ,"data": "Notebook kernel is running. Please stop running kernel."
                }                       
                return resp_json,200
            response = Term.exec_cmd(sc_app_path+" -c gettemp -t MDIO")
            result = parse.temperature(response)
            result["active_bootmode"] = "jtag"
            resp_json = {
                "status":"success"
                ,"data":result
            }
            return resp_json,200
        except Exception as e:
            resp_json = {
                "status":"error"
                ,"data":{"error":"%s"%e}
            }
            return resp_json,500
class EEPROMDetails(Resource):
    def get(self,):
        try:
            response = ""
            if checkJNK() == 0: 
                response = Term.exec_cmd(sc_app_path+" -c eeprom")
            result = parse.dashboard_eeprom(response)
            resp_json = {
                "status":"success"
                ,"data":result
            }
            return resp_json,200
        except Exception as e:
            resp_json = {
                "status":"error"
                ,"data":{"error":"%s"%e}
            }
            return resp_json,500
class ClockFilesList(Resource):
    def get(self,):
        try:
            req = request.args.get('func')
            if req == "clock":
                # Get all default clock files filtered by device name
                default_clock_files = list_files_recursive(app_config["8A34001_clk_files_path"], deviname.replace(" ", ""))
                default_clock_files = list(set(default_clock_files))
                
                # Get all uploaded clock files
                uploaded_clock_files = []
                if os.path.exists(app_config["uploaded_files_path"]):
                    for c in os.listdir(app_config["uploaded_files_path"]):
                        if os.path.isfile(os.path.join(app_config["uploaded_files_path"], c)):
                            uploaded_clock_files.append(c)
                uploaded_clock_files = list(set(uploaded_clock_files))
                
                resp_json = {
                    "status": "success"
                    , "data": {
                        "default": {
                            "finallist": default_clock_files
                        }
                        , "user": {
                            "finaluploadlist": uploaded_clock_files
                        }
                    }
                }
                return resp_json, 200
            elif req == "pdi":
                pdifiles = os.listdir(app_config["PDIFilePath"]) if os.path.exists(app_config["PDIFilePath"]) else []
                resp_json = {
                    "status": "success"
                    , "data": {
                        "pdi": {
                            "pdi_files": pdifiles
                        }                        
                    }
                }
                return resp_json,200
            elif req == "rauc":
                raucfiles = os.listdir(app_config["raucFilepath"]) if os.path.exists(app_config["raucFilepath"]) else []
                resp_json = {
                    "status": "success"
                    , "data": {
                        "rauc": {
                            "rauc_files": raucfiles
                        }
                    }
                }
                return resp_json,200
            elif req == "ospi":
                ospifiles = os.listdir(app_config["ospiFilepath"]) if os.path.exists(app_config["ospiFilepath"]) else []
                resp_json = {
                    "status": "success"
                    , "data": {
                        "ospi": {
                            "ospi_files": ospifiles
                        }
                    }
                }
                return resp_json,200
            elif req == "ufs":
                ufsfiles = os.listdir(app_config["ufsFilepath"]) if os.path.exists(app_config["ufsFilepath"]) else []
                resp_json = {
                    "status": "success"
                    , "data": {
                        "ufs": {
                            "ufs_files": ufsfiles
                        }
                    }
                }
                return resp_json,200
            elif req == "versal":
                versalfiles = os.listdir(app_config["VersalUSBImagePath"]) if os.path.exists(app_config["VersalUSBImagePath"]) else []
                resp_json = {
                    "status": "success"
                    , "data": {
                        "versal": {
                            "versal_files": versalfiles
                        }
                    }
                }
                return resp_json,200
            else:
                resp_json = {
                    "status": "error",
                    "data": {"error": "Invalid function requested"}
                }
                return resp_json, 400
        except Exception as e:
            resp_json = {
                "status":"error"
                ,"data":{"error":"%s"%e}
            }
            print('e',e)
            return resp_json,500
class RemoveFile(Resource):
    def delete(self):
        try:
            func = request.args.get('func')
            filename = request.args.get('filename')
            
            if not func or not filename:
                return {
                    "status": "error",
                    "data": {"error": "Missing required parameters: func and filename"}
                }, 400
            
            # Determine the file path based on function type
            file_path = None
            
            if func == "ospi":
                file_path = os.path.join(app_config["ospiFilepath"], filename)
            elif func == "pdi":
                file_path = os.path.join(app_config["PDIFilePath"], filename)
            elif func == "rauc":
                file_path = os.path.join(app_config["raucFilepath"], filename)
            elif func == "ufs":
                file_path = os.path.join(app_config["ufsFilepath"], filename)
            elif func == "versal":
                file_path = os.path.join(app_config["VersalUSBImagePath"], filename)
            elif func == "clock":
                # For clock files, only allow deletion from uploaded files
                file_path = os.path.join(app_config["uploaded_files_path"], filename)
                # Check for different extensions
                extensions = ['.tcs', '.txt', '.bin']
                for ext in extensions:
                    if os.path.exists(file_path + ext):
                        file_path = file_path + ext
                        break
            else:
                return {
                    "status": "error",
                    "data": {"error": "Invalid function type"}
                }, 400
            
            # Check if file exists
            if not file_path or not os.path.exists(file_path):
                return {
                    "status": "error",
                    "data": {"error": f"File '{filename}' not found"}
                }, 404
            
            # Remove the file
            os.remove(file_path)
            
            return {
                "status": "success",
                "data": {"message": f"File '{filename}' removed successfully"}
            }, 200
            
        except Exception as e:
            return {
                "status": "error",
                "data": {"error": f"Server error: {str(e)}"}
            }, 500
class MultiCmdQuery(Resource):
    def get(self,):
        try:
            result = {}
            if checkJNK() >= 1:
                resp_json = {
                    "status":"error"
                    ,"data": "Notebook kernel is running. Please stop running kernel."
                }
                return resp_json,200

            reqa = request.args.get('sc_cmd')
            ereq = json.loads(reqa)
            tara = request.args.get('target')
            etar = json.loads(tara)
            params_req = request.args.get('params')
            eparams = json.loads(params_req)
            extraparams_req = request.args.get('extraparams')
            e_extraparams_req = []
            if extraparams_req:
                e_extraparams_req = json.loads(extraparams_req)
            isFail = False
            isSuccess = False
            for i,a in enumerate(ereq):

                req = ereq[i]
                tar = etar[i]
                params = eparams[i].split(",")
                paramStr = eparams[i].replace(","," ")

                try:
                    cmd_gen = sc_app_path+" -c " + req
                    if len(tar):
                        cmd_gen = cmd_gen + " -t '" + tar + "'"
                    if len(params) and len(params[0]):
                        cmd_gen = cmd_gen + " -v '" + paramStr + "'"
                    response = Term.exec_cmd(cmd_gen)
                except Exception as d:
                    print(d)
                if req == "getclock":
                    req_display = "<b>Configured Frequency</b>"
                elif req == "getmeasuredclock":
                    req_display = "<b>Measured Frequency</b>"
                else:
                    req_display = "<b>" + req.capitalize() + "</b>"
                if response.startswith("ERROR:") or "ERROR:" in response:
                    if "error" not in result.keys():
                        result["error"] = ""
                    result["error"] += req_display + " : " + response + "<br>"
                    isFail = True

                else :
                    if len(e_extraparams_req) > i:
                        result1 = parse.parse_cmd_resp(response, req, tar, params, e_extraparams_req[i])
                    else:
                        result1 = parse.parse_cmd_resp(response, req, tar, params)
                    result.update(result1)
                    isSuccess = True
                    if "error" not in result.keys():
                        result["error"] = ""
                    result["error"] += req_display + " : Success \n<br>"
            if isFail and isSuccess:
                resp_json = {
                    "status": "partial_success"
                    , "data": result
                }
                return resp_json,200
            elif isSuccess and not isFail:
                resp_json = {
                    "status": "success"
                    , "data": result
                }
                return resp_json,200
            else:
                resp_json = {
                    "status": "error"
                    , "data": {
                        "message": result["error"]
                    }
                }
                return resp_json, 200
        except Exception as e:
            resp_json = {
                "status":"error"
                , "data":{
                    "message": result["error"]
                }
            }
            return resp_json,500
class CmdQuery(Resource):
    def get(self,):
        try:
            if checkJNK() >= 1: 
                resp_json = { 
                    "status":"error"
                    ,"data": "Notebook kernel is running. Please stop running kernel."
                }                       
                return resp_json,200

            req = request.args.get('sc_cmd')

            tar = request.args.get('target')
            params_req = request.args.get('params')
            params = params_req.split(",")
            paramStr = params_req.replace(","," ")
            
            try:
                cmd_gen = sc_app_path+" -c " + req
                if len(tar):
                    cmd_gen = cmd_gen + " -t '" + tar + "'"
                if "PL UART Test" == tar:
                    response = SysFactory.exec_cmd(cmd_gen, cmdType=SysFactory.SOCKET)
                elif len(params) and len(params[0]):
                    cmd_gen = cmd_gen + " -v '" + paramStr + "'"
                    response = Term.exec_cmd(cmd_gen)
                else:
                    response = Term.exec_cmd(cmd_gen)
            except Exception as d:
                print(d)
            if response.startswith("ERROR:") or "ERROR:" in response:
                dresp = {"message":response}
                resp_json = {
                    "status":"error"
                    ,"data":dresp
                }
            else : 
                result = parse.parse_cmd_resp(response, req, tar, params)
                resp_json = {
                    "status":"success"
                    ,"data":result
                }
            if req.startswith("BIT") or "BIT" in req:
                bitlog_path = app_config["bitlogFilePath"]
                if not os.path.isfile(bitlog_path):
                    resp_json["data"]["bitlogs"] = ""
                else:
                    bitLog = SysFactory.exec_cmd("cat " + bitlog_path, SysFactory.TERMINAL)
                    resp_json["data"]["bitlogs"] = bitLog if "cat: can't open" not in bitLog else ""
            return resp_json,200
        except Exception as e:
            resp_json = {
                "status":"error"
                ,"data":{"error":"%s"%e}
            }
            return resp_json,500
class RaftQuery(Resource):
    def get(self,):
        try:
            req = request.args.get('sc_cmd')
            tar = request.args.get('target')
            params_req = request.args.get('params', '')
            params = [p for p in params_req.split(",") if len(p)]
            paramStr = ""
            if len(params) == 1:
                paramStr = "," + params[0]
            elif len(params) > 1:
                paramStr = ",[" + params_req + "]"
            try:
                raft_fun = eval(f"pm.{req}(\"{tar}\"{paramStr})")
            except Exception as d:
                print(d)
            if raft_fun["status"] == "failure" or raft_fun["status"].startswith("failure"):
                dresp = {"message": raft_fun["message"]}
                resp_json = {
                    "status":"error"
                    ,"data":dresp
                }
            else:
                resp_json = {
                    "status":"success"
                    ,"data":raft_fun["data"]
                }
            return resp_json
        except Exception as e:
            resp_json = {
                "status":"error"
                ,"data":{"error":"%s"%e}
            }
            return resp_json,500

class Notif:
    _notifs = []

    Priority = Enum('Priority',
                    ['PDI'
                     ,'STATUS'
                     ,'TEMP_RANGE_EXCEED'
                     ])

    MODE_REALTIME = 101            # WHEN NEED TO SHOW/HIDE AT REALTIME. eg: show hide pdi loaded state
    MODE_NETWORK = 102             # WHEN NEED TO SHOW A NETWORK NOTIFICATION. eg: a new board is availabe kind of notification from xilinx web site.
    MODE_INFO = 103                # WHEN NEED TO SHOW FOR A APT UPGRADE IS AVAILABLE. THIS WONT BE REALTIME AND WILL NOT BE DISMISSED ONCE THE CONDITION IS SATISFIED

    TYPE_CMD = 201                  # WHEN THE NOTIFICATION CHECK TYPE IS A LOCAL COMMAND EXECUTION.

    def __init__(self,notif_id="",title="",message="",priority=1000,noti_type=0,type_related_info="",command="",conditionsToCompare=None,req_time="", result = "",prev_req_time="",prev_result = "", mode = 0,show = True, components={}):
        self.notif_id = notif_id
        self.title = title
        self.message = message
        self.priority = priority
        self.mode= mode
        self.noti_type= noti_type
        self.type_related_info = type_related_info
        self.command = command
        self.conditionsToCompare = conditionsToCompare
        self.req_time = req_time
        self.result = result
        self.prev_req_time = prev_req_time
        self.prev_result = prev_result
        self.show = show
        self.components = components
        Notif._notifs.append(self)
    @staticmethod
    # One time loading list of

    def notification_load():
        Notif(notif_id="PDI_NOT_LOADED"
              , command=sc_app_path + " -c gettemp -t "+listtemp
              , mode=Notif.MODE_REALTIME
              , noti_type=Notif.TYPE_CMD
              , priority=Notif.Priority.PDI.value
              , conditionsToCompare=lambda x: x.startswith("ERROR: temperature is not available") or "256" in x
              , message='⚠ PDI is not programmed. Ensure to program Versal to view temperature values and control the fan. Click on the "Load PDI" button to load the default PDI. Note that clicking "Load PDI" will reset Versal, terminating any software currently running. '
              , components={
                           "components":["B0"]
                           ,"B0":"Load PDI"
                           ,"B0A":"/cmdquery?sc_cmd=loadPDI&target=default.pdi&params="
               }
              )

    @staticmethod
    def jsonObj(noti_ary):
        jsn_ary = []
        for noti in noti_ary:
            jsn_obj = {}
            jsn_obj["notif_id"] = noti.notif_id
            jsn_obj["message"] = noti.message
            jsn_obj["show"] = noti.show
            jsn_obj["components"] = noti.components
            jsn_ary.append(jsn_obj)
        return jsn_ary

    def notif_check_realTime(self):
        response = Term.exec_cmd(self.command)
        return response

    def validate_notif(self):
        if self.conditionsToCompare(self.result):
            self.show = True
        else:
            self.show = False
        return self.show

    def check_notif(self):
        if self.noti_type == Notif.TYPE_CMD:
            self.prev_result = self.result
            self.result = self.notif_check_realTime()
            return self.validate_notif()

    @staticmethod
    def getNotifs():
        Notif._notifs.sort(key=lambda x: x.priority)
        return Notif._notifs

    @staticmethod
    def identify_highPrior_notif():
        alerts = []
        all_notifs = Notif.getNotifs()
        for notif in all_notifs:
            result = notif.check_notif()
            if result:
                alerts.append(notif)
                # break
        return alerts

    @staticmethod
    def process_notif(open_notifs):
        alert = []
        # check for open_notifs else take the priority one. only one open notification is allowed.
        em_noti = [a_noti for o_noti in open_notifs for a_noti in Notif.getNotifs() if a_noti.notif_id == o_noti["notif_id"]]
        for noti in em_noti:
            if noti.mode == Notif.MODE_REALTIME:
                if noti.check_notif() == False:
                    alert.append(noti)
                break
        else:
            alert = Notif.identify_highPrior_notif()
            for k in em_noti:
                alert.remove(k)
        return alert

class Banner(Resource):
    def get(self, ):
        try:
            result = Notif.process_notif([])
            resp_json = {
                "status": "success"
                , "data": Notif.jsonObj(result)
            }
            return resp_json, 200
        except Exception as e:
            resp_json = {
                "status": "error"
                , "data": {"error": "%s" % e}
            }
            return resp_json, 500

class StatusRequest(Resource):
    def get(self, ):
        try:
            cmd = ""
            funq = request.args.get('cmd')
            if funq == 'ospiboot':
                # api should be
                # /status?cmd=ospiboot,file=<ospifile>
                cmd = app_config["ospirunstatusfile_getstatus"]
                result = SysFactory.exec_cmd(cmd,SysFactory.TERMINAL)
                if ("Operation programming SPI enabled" in result and 
                    "Operation verifying SPI enabled" in result):
                    result = parse.parse_program_verify_ospi_response(result)
                    resp_json = {
                        "status": "success"
                        , "data": {"message":result}
                    }
                    return resp_json
                elif "Operation verifying SPI enabled" in result:
                    result = parse.parse_verify_ospi_response(result)
                    resp_json = {
                        "status": "success"
                        , "data": {"message":result}
                    }
                    return resp_json
                elif  "Operation programming SPI enabled" in result:
                    result = parse.parse_program_ospi_response(result)
                    resp_json = {
                        "status": "success"
                        , "data": {"message":result}
                    }
                    return resp_json
                elif "Operation erasing SPI enabled" in result:
                    result = parse.parse_erase_ospi_response(result)
                    resp_json = {
                        "status": "success"
                        , "data": {"message":result}
                    }
                    return resp_json
            if funq == 'ufsboot':
                # api should be
                # /status?cmd=ufsboot,file=<ufsfile>
                cmd = app_config["ufsrunstatusfile_getstatus"]
                result = SysFactory.exec_cmd(cmd,SysFactory.TERMINAL)
                if "Operation programming UFS enabled" in result:
                    result = parse.parse_program_program_ufs_response(result)
                    resp_json = {
                        "status": "success"
                        , "data": {"message":result}
                    }
                    return resp_json
                elif "ERROR:" in result:
                    resp_json = {
                        "status": "success"
                        , "data": {"message": {"Error": result}}
                    }
                    return resp_json
                else:
                    resp_json = {
                        "status": "success"
                        , "data": {"message": {"Status": result}}
                    }
                    return resp_json
        except Exception as e:
            resp_json = {
                "status": "error"
                , "data": {"error": "%s" % e}
            }
            return resp_json, 500

class ScriptRunner(Resource):
    def get(self, ):
        try:
            cmd = ""
            funq = request.args.get('cmd')
            if funq == 'ospiboot':
                with open(app_config['ospirunstatusfile'], 'w'):
                    pass
                # api should be 
                # /scriptrunner?cmd=ospiboot,file=<ospifile>
                verify_flag = request.args.get('verify')
                program_flag = request.args.get('program')
                erase_flag = request.args.get('erase')
                file = request.args.get('file')
                script = app_config["ospirunscript"]

                cmd = script
                if verify_flag:
                    cmd += " -v"
                if program_flag:
                    cmd += " -p"
                if erase_flag:
                    cmd += " -e"
                if file:
                    cmd += file
                result = SysFactory.exec_cmd(cmd,SysFactory.SCRIPT,app_config["ospirunstatusfile"])
                if result.strip().split('\n')[-1].strip() == "Script completed":
                    resp_json = {
                        "status": "success"
                        , "data": result
                    }
                    return resp_json
                else:
                    if "Error:" in result:
                        split_result = result.split("Error:", 1)
                        if len(split_result) > 1 and split_result[1].strip():
                            error_message = "Error:" + split_result[1].strip()
                            if "Timed out" in result:
                                result = (
                                    "OSPI operation timed out."
                                    + "\n" + error_message
                                )
                            else:
                                result = error_message
                        else:
                            result = result.strip()
                    else:
                        result = result.strip()
                    resp_json = {
                        "status": "error"
                        , "data":{
                            "message": result
                        }
                    }
                    return resp_json
            elif funq == 'ufsboot':
                with open(app_config['ufsrunstatusfile'], 'w'):
                    pass
                # api should be 
                # /scriptrunner?cmd=ufsboot,file=<ufile>
                file = request.args.get('file')
                script = app_config["ufsrunscript"]

                cmd = script + " -U"
                if file:
                    cmd += file
                result = SysFactory.exec_cmd(cmd,SysFactory.SCRIPT,app_config["ufsrunstatusfile"])
                if result.strip().split('\n')[-1].strip() == "Script completed":
                    resp_json = {
                        "status": "success"
                        , "data": result
                    }
                    return resp_json
                elif "Detected board type vek385_reva" in result or "detected board type vek385_reva" in result.lower():
                    resp_json = {
                        "status": "error"
                        , "data": {
                            "message": "This feature is not supported on VEK385 revA boards."
                        }
                    }
                    return resp_json
                else:
                    if "Error:" in result:
                        split_result = result.split("Error:", 1)
                        if len(split_result) > 1 and split_result[1].strip():
                            error_message = "Error:" + split_result[1].strip()
                            if "Timed out" in result:
                                result = (
                                    "UFS operation timed out."
                                    + "\n" + error_message
                                )
                            else:
                                result = error_message
                        else:
                            result = result.strip()
                    elif "Timed out" in result:
                        result = "UFS operation timed out."
                    else:
                        result = result.strip()
                    resp_json = {
                        "status": "error"
                        , "data":{
                            "message": result
                        }
                    }
                    return resp_json
            elif funq == 'getlogs':
                 # api should be 
                # /scriptrunner?cmd=getlogs
                cmd = app_config["scriptfile"]
                result = Term.exec_cmd(cmd)
                resp_jon = {
                    "status":"success"
                    ,"data": result.strip().split("\n")[-1]
                }
                return resp_jon
            elif funq == 'getospilog':
                cmd = "cat /usr/share/scweb/ospi_flash_status.txt"
                result = Term.exec_cmd(cmd)
                if result is None or "No such file or directory" in result or "can't open" in result:
                    resp_json = {
                        "status": "error"
                        , "data": {
                            "message": "Unable to read /usr/share/scweb/ospi_flash_status.txt"
                        }
                    }
                    return resp_json
                resp_json = {
                    "status": "success"
                    , "data": {
                        "message": result.strip()
                    }
                }
                return resp_json
            elif funq == 'getufslog':
                cmd = "cat /usr/share/scweb/ufs_flash_status.txt"
                result = Term.exec_cmd(cmd)
                if result is None or "No such file or directory" in result or "can't open" in result:
                    resp_json = {
                        "status": "error"
                        , "data": {
                            "message": "Unable to read /usr/share/scweb/ufs_flash_status.txt"
                        }
                    }
                    return resp_json
                resp_json = {
                    "status": "success"
                    , "data": {
                        "message": result.strip()
                    }
                }
                return resp_json
            elif funq == "versalUSBconnect":
                file = request.args.get('file')
                cmd = app_config["versalconnectscript"]+file
                result = Term.exec_cmd(cmd)
                if "No usb device controllers" in result or "Must specify usb disk image file" in result or "Unable to open" in result:
                    resp_json = {
                        "status": "error"
                        , "data":{
                            "message": result
                        }
                    }
                    return resp_json
                else:   
                    resp_jon = {
                        "status":"success"
                        ,"data": result
                    }
                    return resp_jon
            elif funq == "versalUSBdisconnect":
                cmd = app_config["versaldisconnectscript"]
                result = Term.exec_cmd(cmd)
                if "No such file or directory" in result or "Must specify usb disk image file" in result or "Unable to open" in result:
                    resp_json = {
                        "status": "error"
                        , "data":{
                            "message": result
                        }
                    }
                    return resp_json
                else:   
                    resp_jon = {
                        "status":"success"
                        ,"data": result
                    }
                    return resp_jon
            elif funq == "fetcheepromdata":
                cmd = app_config["eeprom_fetch_cmd"]
                result = Term.exec_cmd(cmd)
                # Read the generated eeprom.yml file content
                eeprom_content = ""
                try:
                    if os.path.exists("eeprom.yml"):
                        with open("eeprom.yml", "r") as f:
                            eeprom_content = f.read()
                        # Parse the EEPROM data using the parse module
                        parsed_data = parse.parse_eeprom_yaml(eeprom_content)
                        resp_json = {
                            "status": "success",
                            "data": parsed_data
                        }
                        return resp_json
                except Exception as e:
                    resp_json = {
                        "status": "error",
                        "data": {"error": f"Error processing eeprom.yml: {str(e)}"}
                    }
                    return resp_json
                resp_json = {
                    "status": "error",
                    "data": {"error": "eeprom.yml file not found"}
                }
                return resp_json
            elif funq == "writeeepromdata":
                versal_macs = []
                versal_macs_array = request.args.getlist('versalMacs[]')
                if versal_macs_array:
                    versal_macs = [mac.strip() for mac in versal_macs_array if mac.strip()]
                else:
                    i = 0
                    while True:
                        mac = request.args.get(f'versalMacs[{i}]')
                        if mac and mac.strip():
                            versal_macs.append(mac.strip())
                            i += 1
                        else:
                            break
                if not versal_macs:
                    resp_json = {
                        "status": "error",
                        "data": {"error": "At least one Versal MAC address must be provided"}
                    }
                    return resp_json                
                try:
                    if not os.path.exists("eeprom.yml"):
                        cmd = app_config["eeprom_fetch_cmd"]
                        result = Term.exec_cmd(cmd)
                        if not os.path.exists("eeprom.yml"):
                            resp_json = {
                                "status": "error",
                                "data": {"error": "Failed to fetch EEPROM data"}
                            }
                            return resp_json
                    with open("eeprom.yml", "r") as f:
                        eeprom_content = f.read()
                    updated_content = parse.update_eeprom_yaml_content(eeprom_content, versal_macs)
                    with open("eeprom.yml", "w") as f:
                        f.write(updated_content)
                    cmd_convert = app_config["yml_to_bin_cmd"]
                    result_convert = Term.exec_cmd(cmd_convert)
                    if "error" in result_convert.lower() or "failed" in result_convert.lower():
                        resp_json = {
                            "status": "error",
                            "data": {"error": f"Failed to convert YAML to binary: {result_convert}"}
                        }
                        return resp_json
                    cmd_flash = app_config["flash_eeprom_cmd"]
                    result_flash = Term.exec_cmd(cmd_flash)                    
                    if "error" in result_flash.lower() or "permission denied" in result_flash.lower():
                        resp_json = {
                            "status": "error",
                            "data": {"error": f"Failed to flash EEPROM: {result_flash}"}
                        }
                        return resp_json                    
                    resp_json = {
                        "status": "success",
                        "data": {
                            "message": f"EEPROM updated successfully with {len(versal_macs)} Versal MAC(s)"
                        }
                    }
                    return resp_json                    
                except Exception as e:
                    resp_json = {
                        "status": "error",
                        "data": {"error": f"Error updating EEPROM: {str(e)}"}
                    }
                    return resp_json
        except Exception as e:
            resp_json = {
                "status":"error"
                ,"data":{"message":"%s"%e}
            }
            return resp_json,500
class InstallBoard(Resource):
    def get(self, ):
        try:
            result = Term.exec_cmd(app_config["boardsetupfile"])
            resp_jon = {
                "status":"success"
                ,"data": result.strip().split("\n")[-1]
            }
            return resp_jon
        except Exception as e:
            resp_json = {
                "status":"error"
                ,"data":{"error":"%s"%e}
            }
            return resp_json,500
class exportCSV(Resource):
    def get(self, ):
        try:
            duration = request.args.get('file_duration', 5)
            output_dir = "./static/tmp/"
            if not os.path.exists(output_dir):
                os.makedirs(output_dir)
            cmd = f"{app_config['csvFIlePath']} {duration} 1"
            result = SysFactory.exec_cmd(f"python3 {cmd}", SysFactory.SCRIPT)
            resp_json = {
                "status":"success"
                ,"data": result.strip().split(" - ")[-1]
            }
            return resp_json
        except Exception as e:
            resp_json = {
                "status":"error"
                ,"data":{"error":"%s"%e}
            }
            return resp_json,500
class RaucUpdate(Resource):
    def get(self, ):
        try:
            req = request.args.get('func')
            tar = request.args.get('target')
            if req == "reboot":
                cmd_gen = req
            else:
                cmd_gen = "rauc " + req
            if len(tar):
                cmd_gen = cmd_gen + " -t '" + tar + "'"
            result = Term.exec_cmd(cmd_gen)
            if "ERROR:" in result or "failed" in result or "No such file" in result:
                resp_json = {
                    "status": "error"
                    , "data": result
                }
                return resp_json
            else:
                resp_json = {
                    "status": "success"
                    , "data": result
                }
                return resp_json
        except Exception as e:
            resp_json = {
                "status": "error"
                , "data": {"error": "%s" % e}
            }
            return resp_json, 500

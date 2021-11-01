##
# Copyright (c) 2020 - 2021 Xilinx, Inc. and Contributors. All rights reserved.
#
# SPDX-License-Identifier: MIT
##
from flask import render_template
from flask_restful import Resource, request

from config_app import *
from term import *
from parse import *
from jnservice import *
##
# TODO :: Change parse data static to dynamic class for realtime data.
#parse = ParseDataStatic()
parse = ParseData()

sc_app_path = app_config["sc_app_path"]
class BootMode:
    active_bootmode = "-"
    @staticmethod
    def getActiveBootMode():
        return BootMode.active_bootmode
    @staticmethod
    def setBootMode(mode):
        BootMode.active_bootmode = mode
        SysFactory.exec_cmd(sc_app_path +" -c setbootmode -t "+mode,SysFactory.TERMINAL)            
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
        try:
            result = {"temp":"-"}
            stat = "error"
            if checkJNK() == 0:
                stat = "success"
                response = Term.exec_cmd(sc_app_path+" -c gettemp -t "+gtemp_targ)
                result = parse.temperature(response)
            result["active_bootmode"] = BootMode.getActiveBootMode()
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
        res = BootMode.setBootMode(mode);
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
                if len(params) and len(params[0]):
                    cmd_gen = cmd_gen + " -v '" + paramStr + "'"
                response = Term.exec_cmd(cmd_gen)
            except Exception as d:
                print(d)
            if response.startswith("ERROR") or "ERROR" in response:
                resp_json = {
                    "status":"error"
                    ,"data":response
                }
            else : 
                result = parse.parse_cmd_resp(response, req, tar, params);
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

###############################################################################
#
# Copyright (C) 2020 Xilinx, Inc.  All rights reserved.
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# Use of the Software is limited solely to applications:
# (a) running on a Xilinx device, or
# (b) that interact with a Xilinx device through a bus or interconnect.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# XILINX  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
# WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF
# OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
#
# Except as contained in this notice, the name of the Xilinx shall not be used
# in advertising or otherwise to promote the sale, use or other dealings in
# this Software without prior written authorization from Xilinx.
#
###############################################################################
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
        SysFactory.exec_cmd(sc_app_path +" -c reset",SysFactory.TERMINAL)            
class ReqFunctions:
    global sc_app_path
    @staticmethod
    def polls():
        try:
            result = ""
            if checkJNK() == 0:
                response = Term.exec_cmd(sc_app_path+" -c temperature")
                result = parse.temperature(response)
            result["active_bootmode"] = BootMode.getActiveBootMode()
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
    def bootmode_set(mode):
        BootMode.setBootMode(mode);
        return {"status":"success","data":""},200
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
            return ReqFunctions.polls()
        if req.startswith('jnlink'):
            return ReqFunctions.jnlink()
        if req.startswith('setbootmode'):
            if checkJNK() >= 1: 
                resp_json = { 
                    "status":"error"
                    ,"data": {"error":"Notebook kernel is running. Please stop running kernel."}
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
                    ,"data": {"error":"Notebook kernel is running. Please stop running kernel."}
                }                       
                return resp_json,200
            response = Term.exec_cmd(sc_app_path+" -c temperature")
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
            try:
                cmd_gen = sc_app_path+" -c " + req
                if len(tar):
                    cmd_gen = cmd_gen + " -t '" + tar + "'"
                if len(params) and len(params[0]):
                    cmd_gen = cmd_gen + " -v " + params[0]
                response = Term.exec_cmd(cmd_gen)
            except Exception as d:
                print(d)
            result = parse.parse_cmd_resp(response, req);
            if response.startswith("ERROR") or "ERROR" in response:
                resp_json = {
                    "status":"error"
                    ,"data":response
                }
            else : 
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

##
# Copyright (c) 2020 - 2021 Xilinx, Inc. and Contributors. All rights reserved.
#
# SPDX-License-Identifier: MIT
##

##  @systemcontroller.py
#   This file contains main. Initiates and starts server.
#

# imports
from flask import Flask, render_template, request 
from flask import Response  ,jsonify
from flask_restful import Resource, Api , reqparse
import shutil

from logg import *
from restserv import *
from parse import *
from config_app import *
from jnservice import *
##  Main that calls other functions and launches the server.
#
#
app = Flask(__name__)
api = Api(app)

@app.route('/')
def index():
    # returning template.
    return render_template("index.html")

## Resources
api.add_resource(Poll,"/poll")
api.add_resource(FuncReq,"/funcreq")
api.add_resource(CmdQuery,"/cmdquery")
api.add_resource(EEPROMDetails,"/eeprom_details")


## Resources
import threading
req_lock = threading.Lock()

@app.before_request
def lock_next_requests():
    #if  "cmdquery" in request.path or "eeprom_details" in request.path or "funcreq" in request.path:
    #    if checkJNK() >= 1:
    #        return {"key":"A jupyter notebook kernel is running"},204
    if  "cmdquery" in request.path or "eeprom_details" in request.path or "funcreq" in request.path:
        global req_lock
        req_lock.acquire()
        Logg.log("************* Request locked",Logg.DEBUG)
@app.after_request
def unlock_for_next_req(response):
    global req_lock
    if req_lock.locked():
        req_lock.release()
        Logg.log("************* Released lock",Logg.DEBUG)
    return response

def crstring():
    return '''/*
* Copyright (c) 2020 - 2021 Xilinx, Inc. and Contributors. All rights reserved.
*
* SPDX-License-Identifier: MIT
*/
'''
if __name__ == '__main__':
    if not len(sc_app_path) or not len(SysFactory.exec_cmd("which "+sc_app_path,SysFactory.TERMINAL)):
        Logg.log("Please check sc_app Path",Logg.RELEASE)
        exit(0)
    #if not len(sensors_app) or not len(SysFactory.exec_cmd("which "+sensors_app,SysFactory.TERMINAL)):
    #    Logg.log("Please check sensors app Path",Logg.RELEASE)
    #    exit(0)
    ##  creating a config file which contains list of each tab type.
    #   sc tab components
    f = open("./static/js/gen_sc.js", "w")
    p = ParseData()
    f.write(crstring()) 
    f.write("var listsjson_sc = {\n")
    lisj = app_config["config_sc_list_cmds"]
    for ind,ke in enumerate(lisj):
        if ind > 0:
            f.write(",\n")
        response = Term.exec_cmd(sc_app_path+" -c "+ke+"\n")
        resp = p.parse_cmd_resp(response, ke)
        finStr = ""
        for k in resp:
            if len(finStr):
                finStr = finStr + ","
            finStr = finStr +'"'+k+'"'
        f.write('"'+ke+'":['+finStr+"]");

    vers1 = "" + app_config["major_version"]+"."+app_config["minor_version"]
    vers2 = "" + p.parse_cmd_resp(Term.exec_cmd(sc_app_path+" -c version"),"version")["version"] 
    f.write(',\n"version":"'+vers1+'/'+vers2+'"')    
    tcsfiles = ""
    txtfiles = ''
    for c in os.listdir(app_config["8A34001_clk_files_path"]):
        if c.endswith(".tcs"):
            if len(tcsfiles):
                tcsfiles = tcsfiles + ","
            tcsfiles = tcsfiles + '"' + c + '"'
        if c.endswith(".txt"):
            if len(txtfiles):
                txtfiles = txtfiles + ","
            txtfiles = txtfiles + '"' + c + '"'


    f.write(',\n"8A34001_clk_tcs_files":['+tcsfiles+']')
    f.write(',\n"8A34001_clk_txt_files":['+txtfiles+']')
    f.write("\n}")
    f.close()
    # check device
    deviname = p.dashboard_eeprom(Term.exec_cmd(sc_app_path+" -c eeprom\n"))["device"].upper()
    if ("VCK" in deviname):
        shutil.copyfile("./static/js/vck190_strings.js","./static/js/beam_strings.js")
    elif ("VMK" in deviname):
        shutil.copyfile("./static/js/vmk180_strings.js","./static/js/beam_strings.js")
    else:
        shutil.copyfile("./static/js/vck190_strings.js","./static/js/beam_strings.js")
    


    #   bit tab components
    f = open("./static/js/gen_bit.js", "w")
    p = ParseData()
    f.write(crstring()) 
    f.write("var listsjson_bit = {\n")
    lisj = app_config["config_bit_list_cmds"]
    for ind,ke in enumerate(lisj):
        if ind > 0:
            f.write(",\n")
        response = Term.exec_cmd(sc_app_path+" -c "+ke+"\n")
        resp = p.parse_cmd_resp(response, ke)
        finStr = ""
        for k in resp:
            if len(finStr):
                finStr = finStr + ","
            finStr = finStr +'"'+k+'"'
        f.write('"'+ke+'":['+finStr+"]");

    f.write("\n}")
    f.close()
    #   boot mode list
    f = open("./static/js/gen_bm.js", "w")
    f.write(crstring()) 
    f.write("var listsjson_bm = {\n")
    lisj = app_config["config_bm_list_cmds"]
    for ind,ke in enumerate(lisj):
        if ind > 0:
            f.write(",\n")
        response = Term.exec_cmd(sc_app_path+" -c "+ke+"\n")
        resp = p.parse_cmd_resp(response, ke)
        finStr = ""
        for k in resp:
            if len(finStr):
                finStr = finStr + ","
            finStr = finStr +'"'+k+'"'
        f.write('"'+ke+'":['+finStr+"]");

    f.write("\n}")
    f.close()
    app.run(host="0.0.0.0", port=50002, debug=True)


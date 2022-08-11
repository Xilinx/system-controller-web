##
# Copyright (c) 2020 - 2021 Xilinx, Inc. and Contributors. All rights reserved.
#
# SPDX-License-Identifier: MIT
##
import os
import json
from config_app import *
from term import *
import psutil

def checkJNK():
    kercount = 0
    for proc in psutil.process_iter():
        if "python3" in proc.name() and "ipykernel_launcher" in proc.cmdline():
            kercount = kercount + 1
    return kercount

def checkJNS():
    kcount = 0
    for proc in psutil.process_iter():
        if "python3" in proc.name() and "/usr/bin/jupyter-notebook" in proc.cmdline():
            kcount = kcount + 1
    return kcount


def jnurl():
    
    jnlst = ""
    jnd = ""
    ur = ""
    deviname = Term.exec_cmd(app_config["sc_app_path"]+" -c board\n")    
    if "VCK" in deviname or "VMK" in deviname:
        jnlst = os.listdir(app_config["jnlocalrundirroot"])
        jnd=app_config["jnlocalrundirroot"]
    else:
        jnlst = os.listdir(app_config["jnlocalrundir"])
        jnd=app_config["jnlocalrundir"]

    nbfiles = [jnd+"/"+f for f in jnlst if "nbserver" in f and ".json" in f]
    
    latfile = ""
    try:
        latfile = max(nbfiles, key=os.path.getctime)
    except:
        latfile = ""

    if len(latfile) == 0 or checkJNS() == 0:
        return (0, "No Active Jupyter notebook session available")
    try:
        nbservfile = latfile
        f = open(nbservfile,"r")
        data = json.load(f)
        ur = ur + data["url"]+"?token="+data["token"]
        f.close()
    except:
        print("failed")
    return (1, ur)


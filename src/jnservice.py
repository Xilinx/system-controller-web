##
# Copyright (c) 2020, Xilinx Inc. and Contributors. All rights reserved.
#
# SPDX-License-Identifier: MIT
##
import os
import json
from config_app import *
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
    jnlst = os.listdir(app_config["jnlocalrundir"])
    ur = ""
    nbfiles = [app_config["jnlocalrundir"]+"/"+f for f in jnlst if "nbserver" in f and ".json" in f]
    latfile = max(nbfiles, key=os.path.getctime)

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


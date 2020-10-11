import os
import json
from config_app import *

def checkJNK():
    jnlst = os.listdir(app_config["jnlocalrundir"])
    kercount = 0
    for st in jnlst:
        if "kernel" in st and ".json" in st:
             kercount = kercount + 1
    return kercount

def jnurl():
    jnlst = os.listdir(app_config["jnlocalrundir"])
    ur = ""
    jncount = 0
    for st in jnlst:
        if "nbserver" in st and ".json" in st:
            jncount = jncount + 1
            try:
                nbservfile = app_config["jnlocalrundir"]+st
                f = open(nbservfile,"r")
                data = json.load(f)
                ur = ur + data["url"]+"?token="+data["token"]
                f.close()
            except:
                print("failed")
    if jncount == 0:
        return (0, "No Active Jupyter notebook session available")
    elif jncount == 1:
        return (1, ur)
    if jncount > 1:
        return (9, "More than one jupyter notebook configurations found. Please check and clear unused config files in "+app_config["jnlocalrundir"])



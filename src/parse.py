##
# Copyright (c) 2020 - 2021 Xilinx, Inc. and Contributors. All rights reserved.
#
# SPDX-License-Identifier: MIT
##
from config_app import *

class Parse:
    def parse_cmd_resp(self, data, component,targ="",params = ""):
        if(component == "getpower" or component == "getcalpower"):
            return self.parseGetPower(data)
        elif(component == "getINA226"):
            return self.parseGetINA226(data)
        elif(component.startswith("list")):
            return self.parseList(data)
        elif((component == "getvoltage" or component == "powerdomain") and ("all" not in params)):
            return self.parseGetVoltage(data)
        elif(component == "getclock"):
            return self.parseGetClock(data,targ)
        elif(component == "BIT"):
            return self.parseBit(data)
        elif(component == "getddr"):
            return self.parseDDR(data)
        elif(component == "version"):
            return self.parseversion(data)
        elif(component == "getgpio"):
            return self.parsegpio(data)
        elif(component == "geteeprom" and 'summary' in params):
            return self.dashboard_eeprom(data)
        elif(component == "getioexp" or component == "getpwmSFP" or component == "getSFP" or component == "getQSFP"
or component == "getpwmQSFP" or component == "getpwmoQSFP" or component == "getEBM" or component == "getFMC"
or component == "geteeprom" or component == "getvoltage"):
            return self.parseioexp(data)
        else:
            return ""
    def temperature(self,data):
        # Parse temperature data from data.
        pass

    def dashboard_eeprom(self,data):
        # Parse eeprom data for details
        pass

import json
class ParseData(Parse):
    def temperature(self,data):
        # Parse temperature data from data.
        obj = data.strip().split(":")
        if 'ERROR' in data:
            return {"temp":"-"}
        else:
            return {"temp":obj[1]}

    def parseGetINA226(self,data):
        # Parse eeprom data for details
        resar = data.rstrip().split("\n")
        res = {"Configuration":"-"
               ,"Shunt_Voltage":"-"
               ,"Bus_Voltage":"-"
               ,"Power":"-"
               ,"Current":"-"
               ,"Calibration":"-"
               ,"Mask_Enable":"-"
               ,"Alert_Limit": "-"
               ,"Die_ID":"-"
                }
        for re in resar:
            ary = re.split(":")
            print(ary)
            if ary[0].startswith('Configuration'):
                res['Configuration']=ary[1].strip()
            if ary[0].startswith('Shunt Voltage'):
                res["Shunt_Voltage"]=ary[1].strip()
            if ary[0].startswith('Bus Voltage'):
                res["Bus_Voltage"]=ary[1].strip()
            if ary[0].startswith('Power'):
                res["Power"]=ary[1].strip()
            if ary[0].startswith('Current'):
                res["Current"]=ary[1].strip()
            if ary[0].startswith('Calibration'):
                res["Calibration"]=ary[1].strip()
            if ary[0].startswith('Mask/Enable'):
                res["Mask_Enable"]=ary[1].strip()
            if ary[0].startswith('Alert Limit'):
                res["Alert_Limit"]=ary[1].strip()
            if ary[0].startswith('Die ID'):
                res["Die_ID"]=ary[1].strip()
        return res
    def dashboard_eeprom(self,data):
        # Parse eeprom data for details
        ver = "" + app_config["major_version"]+"."+app_config["minor_version"]
        if app_config["deployment"] == "DEBUG":
            ver = ver + "." + app_config["dev_for_major_ver"]+"."+app_config["dev_minor_ver"] 
        resar = data.rstrip().split("\n")
        res = {"device":"-"
               ,"sil_rev":"-"
               ,"board_pn":"-"
               ,"rev":"-"
               ,"serial_number":"-"
               ,"mac1":"-"
               ,"mac2":"-"
               ,"appversion": ver
                }
        for re in resar:
            ary = re.split(":")
            if ary[0].startswith('Product'):
                res['device']=ary[1].strip()
            #if ary[0].startswith(''):
            #    res["sil_rev"].ary[1].strip()
            if ary[0].startswith('Board Part Number'):
                res["board_pn"]=ary[1].strip()
            if ary[0].startswith('Board Revision'):
                res["rev"]=ary[1].strip()
            if ary[0].startswith('Silicon Revision'):
                res["sil_rev"]=ary[1].strip()
            if ary[0].startswith('Board Serial Number'):
                res["serial_number"]=ary[1].strip()
            if ary[0].startswith('MAC Address 0'):
                res["mac1"]=re[re.index(":")+1:]
            if ary[0].startswith('MAC Address 1'):
                res["mac2"]=re[re.index(":")+1:]
        return res
    def parseGetPower(self,data):
        resar = data.rstrip().split("\n")
        res = {}
        for re in resar:
            ary = re.split(":")
            if ary[0].startswith('Voltage'):
                res["voltage"]=ary[1].strip()
            if ary[0].startswith('Current'):
                res["current"]=ary[1].strip()
            if ary[0].startswith('Power'):
                res["power"]=ary[1].strip()
        return res
    def parseBit(self,data):
        resar = data.strip().split(":")
        res = {}
        if len(resar) > 1:
            res["state"] = resar[1]
        else:
            res["state"] = resar[0]
        res["message"] = data.strip()
        return res
    def parseDDR(self,data):
        resar = data.strip() #.split(":")
        res = {}
        if(len(data.splitlines()) > 1):
            resar = resar.replace("\n","</br>")
            res["info"] = resar
        else:
            res["temp"] = resar.split(":")[1]
        return res
    def parseversion(self,data):
        resar = data.strip().split('\n')[0].split(":")
        res = {}
        if data.startswith('Error'):
            res["version"] = '-'
        else:
            res["version"] = resar[1].strip()
        return res
    def parseGetVoltage(self,data):
        resar = data.strip().split(":")
        res = {}
        res["voltage"] = resar[1]
        return res
    def parseGetClock(self,data,targ):
        res = {}
        if targ.startswith('8A34001'):
            res["frequency"] = data.replace("\n","</br>")
        else:
            resar = data.strip().split(":")
            res["frequency"] = resar[1]
        return res
    def parsegpio(self,data):
        resar = data.strip().split(":")
        res = {}
        res["gpio"] = resar[1]
        return res
    def parseioexp(self,data):
        resar = data.strip().replace("\n","</br>")
        res = {}
        res["io"] = resar
        return res
    def parseList(self,data):
        res = data.rstrip().split("\n")
        return res

import random
class ParseDataStatic(Parse):
    def temperature(self,data):
        # Parse temperature data from data.
        temp = random.randrange(16,19)
        return {"temp":temp}

    def dashboard_eeprom(self,data):
        # Parse eeprom data for details
        ver = "" + app_config["major_version"]+"."+app_config["minor_version"]
        if app_config["deployment"] == "DEBUG":
            ver = ver + "." + app_config["dev_for_major_ver"]+"."+app_config["dev_minor_ver"] 

        res = {"device":"VCK190"
               ,"sil_rev":"1.0"
               ,"board_pn":"0"
               ,"rev":"-"
               ,"serial_number":"abcd1234"
               ,"mac1":"0123456789"
               ,"mac2":"1234567890"
               ,"appversion": ver
                }
        return res
    def parseGetPower(self,data):
        res = {
            "power":4
            ,"voltage":1.9
            ,"current":2.5
        }
        return res
    def parseList(self,data):
        res = ["a","b","c"]
        return res

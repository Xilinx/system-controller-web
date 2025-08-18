##
# Copyright (c) 2020 - 2022 Xilinx, Inc.  All rights reserved.
# Copyright (c) 2022 - 2024 Advanced Micro Devices, Inc.  All rights reserved.
#
# SPDX-License-Identifier: MIT
##
from config_app import *
import re

class Parse:
    def parse_cmd_resp(self, data, component,targ="",params = "",extraparams = ""):
        if(component == "getpower" or component == "getcalpower"):
            return self.parseGetPower(data)
        elif(component == "getINA226"):
            return self.parseGetINA226(data)
        elif(component.startswith("list")):
            return self.parseList(data)
        elif((component == "getvoltage" or component == "powerdomain") and ("all" not in params)):
            return self.parseGetVoltage(data)
        elif(extraparams == "Vendor Utility" and component == "getclock"):
            return self.parseVendorGetClock(data)
        elif(extraparams == "Vendor Utility" and component == "getmeasuredclock"):
            return self.parseVendorGetMeasuredClock(data)
        elif(component == "getclock"):
            return self.parseGetClock(data,targ)
        elif(component == "getmeasuredclock"):
            return self.parseGetMeasuredClock(data,targ)
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
    def parse_program_verify_ospi_response(self,data):
        dict = {
            "Initializing Update":"In progress"
            ,"Booting device over JTAG (step 1/4)":""
            ,"Booting Status":""
            ,"Downloading flash image to DDR (step 2/4)":""
            ,"Download status":""
            ,"SPI Erasing and programming...this could take up to 5 minutes (step 3/4)":""
            ,"Flashing":""
            ,"SPI written successfully.":""
            ,"Verifying (step 4/4)":""
        }
        inprog_key = ""
        for line in data.split('\n'):
            if "Booting device over JTAG (step 1/4)" in line:
                dict["Initializing Update"] = "Done"
                dict["Booting device over JTAG (step 1/4)"] = "In progress"
                inprog_key = "Booting Status"
                continue
            if "Downloading flash image to DDR (step 2/4)" in line:
                dict["Booting device over JTAG (step 1/4)"] = "Done"
                dict["Downloading flash image to DDR (step 2/4)"] = "In progress"
                dict["Booting Status"] = "Done"
                inprog_key = "Download status"
                continue
            if "SPI Erasing and programming...this could take up to 5 minutes (step 3/4)" in line:
                dict["Downloading flash image to DDR (step 2/4)"] = "Done"
                dict["SPI Erasing and programming...this could take up to 5 minutes (step 3/4)"] = "In progress"
                dict["Download status"] = "Done"
                inprog_key = "Flashing"
                continue
            if "SPI written successfully." in line:
                dict["SPI Erasing and programming...this could take up to 5 minutes (step 3/4)"] = "Done"
                dict["SPI written successfully."] = "Done"
                dict["Verifying (step 4/4)"] = "In progress"
                dict["Flashing"] = "Done"
                inprog_key = ""
                continue
            if "Verification successful" in line:
                dict["Verifying (step 4/4)"] = "Done"
                continue
            percentage_match = re.search(r'(\d{1,3})%', line)
            if percentage_match and len(inprog_key):
                dict[inprog_key] = percentage_match.group()

        # html_table = '<table>\n'
        # for key, value in dict.items():
        #     html_table += '  <tr><td>{}</td><td>{}</td></tr>\n'.format(key, value)
        # html_table += '</table>'
        return dict
    def parse_verify_ospi_response(self,data):
        dict = {
            "Initializing Update":"In progress"
            ,"Booting device over JTAG (step 1/3)":""
            ,"Booting Status":""
            ,"Downloading flash image to DDR (step 2/3)":""
            ,"Download status":""
            ,"content download to DDR finished":""
            ,"Verifying (step 3/3)":""
        }
        inprog_key = ""
        for line in data.split('\n'):
            if "Booting device over JTAG (step 1/3)" in line:
                dict["Initializing Update"] = "Done"
                dict["Booting device over JTAG (step 1/3)"] = "In progress"
                inprog_key = "Booting Status"
                continue
            if "Downloading flash image to DDR (step 2/3)" in line:
                dict["Booting device over JTAG (step 1/3)"] = "Done"
                dict["Downloading flash image to DDR (step 2/3)"] = "In progress"
                dict["Booting Status"] = "Done"
                inprog_key = "Download status"
                continue
            if "content download to DDR finished" in line:
                dict["Downloading flash image to DDR (step 2/3)"] = "Done"
                dict["content download to DDR finished"] = "Done"
                dict["Verifying (step 3/3)"] = "In progress"
                dict["Download status"] = "Done"
                inprog_key = ""
                continue
            if "Verification successful" in line:
                dict["Verifying (step 3/3)"] = "Done"
                continue
            percentage_match = re.search(r'(\d{1,3})%', line)
            if percentage_match and len(inprog_key):
                dict[inprog_key] = percentage_match.group()
        return dict
    def parse_program_ospi_response(self,data):
        dict = {
            "Initializing Update":"In progress"
            ,"Booting device over JTAG (step 1/3)":""
            ,"Booting Status":""
            ,"Downloading flash image to DDR (step 2/3)":""
            ,"Download status":""
            ,"SPI Erasing and programming...this could take up to 5 minutes (step 3/3)":""
            ,"Flashing":""
            ,"SPI written successfully.":""
        }
        inprog_key = ""
        for line in data.split('\n'):
            if "Booting device over JTAG (step 1/3)" in line:
                dict["Initializing Update"] = "Done"
                dict["Booting device over JTAG (step 1/3)"] = "In progress"
                inprog_key = "Booting Status"
                continue
            if "Downloading flash image to DDR (step 2/3)" in line:
                dict["Booting device over JTAG (step 1/3)"] = "Done"
                dict["Downloading flash image to DDR (step 2/3)"] = "In progress"
                dict["Booting Status"] = "Done"
                inprog_key = "Download status"
                continue
            if "SPI Erasing and programming...this could take up to 5 minutes (step 3/3)" in line:
                dict["Downloading flash image to DDR (step 2/3)"] = "Done"
                dict["SPI Erasing and programming...this could take up to 5 minutes (step 3/3)"] = "In progress"
                dict["Download status"] = "Done"
                inprog_key = "Flashing"
                continue
            if "SPI written successfully." in line:
                dict["SPI Erasing and programming...this could take up to 5 minutes (step 3/3)"] = "Done"
                dict["SPI written successfully."] = "Done"
                dict["Flashing"] = "Done"
                inprog_key = ""
                continue
            percentage_match = re.search(r'(\d{1,3})%', line)
            if percentage_match and len(inprog_key):
                dict[inprog_key] = percentage_match.group()
        return dict
    def parse_erase_ospi_response(self,data):
        dict = {
            "Initializing Update":"In progress"
            ,"Booting device over JTAG (step 1/2)":""
            ,"Booting Status":""
            ,"Erase Flash (step 2/2)":""
            ,"Erasing":""
        }
        inprog_key = ""
        for line in data.split('\n'):
            if "Booting device over JTAG (step 1/2)" in line:
                dict["Initializing Update"] = "Done"
                dict["Booting device over JTAG (step 1/2)"] = "In progress"
                inprog_key = "Booting Status"
                continue
            if "Erase Flash (step 2/2)" in line:
                dict["Booting device over JTAG (step 1/2)"] = "Done"
                dict["Erase Flash (step 2/2)"] = "In progress"
                dict["Booting Status"] = "Done"
                inprog_key = "Erasing"
                continue
            if "Erase successful" in line:
                dict["Erase Flash (step 2/2)"] = "Done"
                dict["Erasing"] = "Done"
                continue
            percentage_match = re.search(r'(\d{1,3})%', line)
            if percentage_match and len(inprog_key):
                dict[inprog_key] = percentage_match.group()
        return dict
    def parse_eeprom_yaml(self, yaml_data):
        """Parse EEPROM YAML data to extract MAC addresses"""
        data = {
            'scMac': '',
            'versalMac': '',
            'versalMacs': []
        }
        try:
            lines = yaml_data.split('\n')
            in_multirecord = False
            for i, line in enumerate(lines):
                line = line.strip()
                if line.startswith('MultirecordArea:'):
                    in_multirecord = True
                    continue
                if not in_multirecord:
                    continue
                # Handle SC MAC (System Controller)
                if 'type: sys_ctrl_xilinx_mac' in line:
                    for j in range(i + 1, min(i + 5, len(lines))):
                        if 'mac0:' in lines[j]:
                            mac_value = lines[j].split(':', 1)[1].strip().replace('-', ':')
                            data['scMac'] = mac_value
                            break                            
                # Handle Versal MAC (Device Under Test)
                elif 'type: dut_xilinx_mac' in line:
                    for j in range(i + 1, len(lines)):
                        next_line = lines[j].strip()                        
                        # Stop if we hit another section
                        if next_line.startswith('- type:'):
                            break                            
                        # Extract MAC addresses
                        if 'mac' in next_line and ':' in next_line:
                            mac_match = re.match(r'mac\d*:\s*([0-9A-Fa-f\-:]+)', next_line)
                            if mac_match:
                                mac_address = mac_match.group(1).strip().replace('-', ':')
                                data['versalMacs'].append(mac_address)                                
                                # Set first MAC as primary for backward compatibility
                                if not data['versalMac']:
                                    data['versalMac'] = mac_address                                    
        except Exception as e:
            print(f'Error parsing EEPROM data: {e}')
        
        return data
    def update_eeprom_yaml_content(self, yaml_content, sc_mac, versal_macs):
        """Update MAC addresses in YAML content"""
        lines = yaml_content.split('\n')
        updated_lines = []
        in_multirecord = False
        in_sc_mac_section = False
        in_dut_mac_section = False
        versal_mac_index = 0
        for i, line in enumerate(lines):
            original_line = line
            line_stripped = line.strip()
            if line_stripped.startswith('MultirecordArea:'):
                in_multirecord = True
                in_sc_mac_section = False
                in_dut_mac_section = False
            elif line_stripped.startswith('- type:') and in_multirecord:
                in_sc_mac_section = False
                in_dut_mac_section = False
                if 'sys_ctrl_xilinx_mac' in line_stripped:
                    in_sc_mac_section = True
                elif 'dut_xilinx_mac' in line_stripped:
                    in_dut_mac_section = True
                    versal_mac_index = 0
            # Update SC MAC
            if in_sc_mac_section and 'mac0:' in line_stripped and sc_mac:
                # Preserve indentation
                indent = line[:len(line) - len(line.lstrip())]
                updated_lines.append(f"{indent}mac0: {sc_mac.replace(':', '-')}")
                continue
            # Update Versal MACs
            if in_dut_mac_section and 'mac' in line_stripped and ':' in line_stripped:
                mac_match = re.match(r'(\s*)(mac\d*):\s*([0-9A-Fa-f\-:]+)', line)
                if mac_match:
                    indent = mac_match.group(1)
                    mac_key = mac_match.group(2)
                    # If we have a replacement MAC for this position
                    if versal_mac_index < len(versal_macs):
                        new_mac = versal_macs[versal_mac_index].replace(':', '-')
                        updated_lines.append(f"{indent}{mac_key}: {new_mac}")
                        versal_mac_index += 1
                        continue
                    # If no replacement MAC available, keep original line
                    else:
                        updated_lines.append(original_line)
                        continue
            updated_lines.append(original_line)
        return '\n'.join(updated_lines)

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
        res = {}
        for re in resar:
            ary = re.split(":",1)
            if ary[0].startswith('Language') or ary[0].startswith('Manufacturing Date'):
                continue
            res[ary[0]] = ary[1].strip()
            print(res[ary[0]])
        f_res = {}
        f_res["summary"] = res
        f_res["appversion"] = ver
        return f_res  
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
        if len(data.split("\n")) > 2  :
            res["frequency"] = data.replace("\n","</br>")
        else:
            resar = data.strip().split(":")
            res["frequency"] = resar[1]
        return res
    def parseGetMeasuredClock(self,data,targ):
        res = {}
        if len(data.split("\n")) > 2  :
            res["measuredfrequency"] = data.replace("\n","</br>")
        else:
            resar = data.strip().split(":")
            if len(resar) > 1:
                res["measuredfrequency"] = resar[1]
            else:
                res["measuredfrequency"] = "-"
        return res
    def parseVendorGetClock(self,data):
        res = {}
        res["frequency"] = data.replace("\n","</br>")
        return res
    def parseVendorGetMeasuredClock(self,data):
        res = {}
        res["measuredfrequency"] = data.replace("\n","</br>")
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

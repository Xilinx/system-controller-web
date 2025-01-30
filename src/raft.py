##
# Copyright (c) 2025 Advanced Micro Devices, Inc.  All rights reserved.
#
# SPDX-License-Identifier: MIT
##


class PM_Client(object):
    PM = None


    def listfeature(self):
        return {
            "status": "success",
            "data": {
                "temp",
                "power",
                "powerdomain",
                "voltage",
                },
                "message": "Operation completed successfully."
            }
    def listpower(self):
        return {
                "status": "success",
                "data": [
                    "VCCINT",
                    "VCC_SOC",
                    "VCC_PMC",
                    "VCC_RAM_VCCINT_GT",
                    "VCC_PSLP_CPM5",
                    "VCC_PSFP",
                    "VCCO_HBM",
                    "VCC_HBM",
                    "VCCAUX_HBM",
                    "VCCAUX",
                    "VCCAUX_PMC",
                    "MGTAVCC",
                    "VCC1V5",
                    "VCCO_MIO",
                    "MGTAVTT",
                    "VCCO_502",
                    "MGTVCCAUX",
                    "VCC1V2_RDIMM",
                    "VADJ_FMC",
                    "LPDMGTYAVCC",
                    "LPDMGTYAVTT",
                    "LPDMGTYVCCAUX"
                ],
                "message": "Operation completed successfully."
                }

    def listtemp(self):
        return  {
            "status": "success",
            "data": {
                    "Versal"
                },
            "message": "Operation completed successfully."
        }
    def listvoltage(self):
       return {
                "status": "success",
                "data":[
                    {
                        "VCCINT": {
                        "typical_volt": 0.8
                        }
                    },
                    {
                        "VCC_SOC": {
                        "typical_volt": 0.9
                        }
                    },
                    {
                        "VCCINT_RAM": {
                        "typical_volt": 0.7
                        }
                    },
                    {
                        "VCCINT_PSLP": {
                        "typical_volt": 0.6
                        }
                    },
                    {
                        "VCCAUX": {
                        "typical_volt": 0.8
                        }
                    },
            ]
        }
    def getboardinfo(self):
       return {
                "status": "success",
                "data": {
                    "Language": 0,
                    "Silicon Revision": "PROD",
                    "Manufacturing Date": "Mon Aug 22 22:16:00 2022",
                    "Manufacturer": "XILINX",
                    "Product Name": "VHK158",
                    "Board Serial Number": "511201A01019",
                    "Board Part Number": "430511201",
                    "Board Revision": "A01"
                },
                "message": "Operation completed successfully."
        }
    def getpower(self):
        return {
                "status": "success",
                "data": {
                        "Voltage": 0.807,
                        "Current": 7.11,
                        "Power": 5.729
                    },
                "message": "Operation completed successfully."
        }
    def getvoltage(self):
        return {
                "status": "success",
                "data": {
                        "Voltage": 0.801
                    },
                "message": "Operation completed successfully."
        }

    def getcalpower(self):
        return {
                "status": "success",
                "data": {
                        "Voltage": 1.807,
                        "Current": 9.11,
                        "Power": 6.729
                    },
                "message": "Operation completed successfully."
        }
    def getpowerconf(self):
        return {
                "status": "success",
                "data": {
                    "Configuration": "0x4327",
                    "Shunt_Voltage": "0x00f0",
                    "Bus_Voltage": "0x0287",
                    "Power": "0x0028",
                    "Current": "0x04c9",
                    "Calibration": "0x28d8",
                    "Mask_Enable": "0x0008",
                    "Alert_Limit": "0x0000"
                },
                "message": "Operation completed successfully."
        }

    
pm = PM_Client()
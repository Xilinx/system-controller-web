##
# Copyright (c) 2020 - 2022 Xilinx, Inc.  All rights reserved.
# Copyright (c) 2022 - 2023 Advanced Micro Devices, Inc.  All rights reserved.
#
# SPDX-License-Identifier: MIT
##
##  @logg.py
#   This class contains print methods for different levels of log
#
from config_app import *

class Logg:
    ##  @Enum for log type
    #
    DEBUG = 0
    ERROR = 1
    RELEASE = 2

    ##  @def printlog(logtype, log)
    #   Private function prints the log with extended log type name to standard out.
    #   @param logtype     log type enums. eg: DEBUG, ERROR, RELEASE
    #   @param log         log message to print
    #
    @staticmethod
    def __printlog(logtype,log):
        pref = logtype
        if len(logtype):
            pref = pref + " : "
        print(pref+str(log))

    ##  @def degug(logstr, loglevel)
    #   This method prints logs based on indexing levels.
    #   @param logsrt          log message to print
    #   @param loglevel        log levels enum properties, DEBUG, ERROR, RELEASE
    #
    @staticmethod
    def log(logstr, loglevel = RELEASE):
        if loglevel == Logg.DEBUG and app_config["deployment"] == "DEBUG":
            Logg.__printlog("DEBUG",logstr)
        if loglevel == Logg.ERROR:
            Logg.__printlog("ERROR", logstr)
        if loglevel == Logg.RELEASE:
            Logg.__printlog("", logstr)

##
# Copyright (c) 2020 - 2022 Xilinx, Inc.  All rights reserved.
# Copyright (c) 2022 - 2023 Advanced Micro Devices, Inc.  All rights reserved.
#
# SPDX-License-Identifier: MIT
##

##  @term.py
#   This class contains methods that interact with terminals and returns results.
#
import subprocess
import threading

from logg import *

term_mutex = threading.Lock()
class Term:
    ##  @def exec_cmd(cmd)
    #   function to execute cmd on terminal and returns the reuslt.
    #   @param cmd          command to execute on terminal.
    #   @return             result of cmd on sucess
    #                       None on failure
    #
    @staticmethod
    def exec_cmd(cmd):
        global term_mutex
        term_mutex.acquire()
        Logg.log("------ cmd locked",Logg.DEBUG)
        try:
            
            proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,shell=True)
            outs, errs = proc.communicate()
            if errs is None:
                Logg.log(cmd,Logg.DEBUG)
                Logg.log(outs,Logg.DEBUG)
                Logg.log("====== cmd lock released",Logg.DEBUG)
                term_mutex.release()
                #return outs.decode('utf-8')
                try:
                    return outs.decode('utf-8')
                except :
                    return outs.decode('iso-8859-1')
            else:
                Logg.log("error",Logg.DEBUG)
                term_mutex.release()
                return None
        except FileNotFoundError:
            Logg.log("error 2",Logg.DEBUG)
            term_mutex.release()
            return None
class ScriptTerm:
    ##  @def exec_cmd(cmd)
    #   function to execute cmd on terminal and writes the intermediate results to a file to read as a log
    #   @param cmd          command to execute on terminal.
    #   @param file         optional file name to save the intermediate log.
    #   @return             result of cmd on sucess
    #                       None on failure
    #
    @staticmethod
    def exec_cmd(cmd):
        try:
            proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,shell=True)
            out = ""

            while proc.poll() is None:
                output = proc.stdout.readline()
                if output:
                    open(app_config['ospirunstatusfile'], 'a').writelines(output.decode('utf-8'))
                    out  += output.decode('utf-8')

            # Read any remaining output
            for output in proc.stdout.readlines():
                open(app_config['ospirunstatusfile'], 'a').writelines(output.decode('utf-8'))
                out  += output.decode('utf-8')
            return out
        except FileNotFoundError:
            Logg.log("error 2",Logg.DEBUG)
            return None
class Xsdb:
    ##  @def exec_cmd(cmd)
    #   function to execute cmd on Xsdb and returns the reuslt.
    #   @param cmd          command to execute on terminal.
    #   @return             result of cmd on sucess
    #                       None on failure
    #
    @staticmethod
    def exec_cmd(cmd):
        try:
            proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            outs, errs = proc.communicate()
            if errs is None:
                return outs.decode()
            else:
                return None
        except FileNotFoundError:
            return None

class Other:
    @staticmethod
    def exec_cmd(cmd):
        return cmd

##  Factory class that initializes/calls the system calls related classes
#
class SysFactory:
    ## Enums to specify class type
    #
    TERMINAL = "Term"
    XSDB = "Xsdb"
    SCRIPT = "Scripts"

    ##  @def exec_cmd(cmd,cmdtype)
    #   function to execute cmd based on type and returns the reuslt.
    #   @param cmd          command to execute.
    #   @param cmdtype      platform type on which cmd has to be executed
    #   @return             result of cmd on sucess
    #                       None on failure
    #
    @staticmethod
    def exec_cmd(command,  cmdType=None,filename=None):
        if cmdType == SysFactory.TERMINAL:
            return Term.exec_cmd(command)
        if cmdType == SysFactory.SCRIPT:
            return ScriptTerm.exec_cmd(command)
        elif cmdType == SysFactory.XSDB:
            return Xsdb.exec_cmd(command)
        else:
            return Other.exec_cmd(command)

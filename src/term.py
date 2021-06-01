##
# Copyright (c) 2020 - 2021 Xilinx, Inc. and Contributors. All rights reserved.
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

    ##  @def exec_cmd(cmd,cmdtype)
    #   function to execute cmd based on type and returns the reuslt.
    #   @param cmd          command to execute.
    #   @param cmdtype      platform type on which cmd has to be executed
    #   @return             result of cmd on sucess
    #                       None on failure
    #
    @staticmethod
    def exec_cmd(command, cmdType=None):
        if cmdType == SysFactory.TERMINAL:
            return Term.exec_cmd(command)
        elif cmdType == SysFactory.XSDB:
            return Xsdb.exec_cmd(command)
        else:
            return Other.exec_cmd(command)

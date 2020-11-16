###############################################################################
#
# Copyright (C) 2020 Xilinx, Inc.  All rights reserved.
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# Use of the Software is limited solely to applications:
# (a) running on a Xilinx device, or
# (b) that interact with a Xilinx device through a bus or interconnect.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# XILINX  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
# WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF
# OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
#
# Except as contained in this notice, the name of the Xilinx shall not be used
# in advertising or otherwise to promote the sale, use or other dealings in
# this Software without prior written authorization from Xilinx.
#
###############################################################################
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

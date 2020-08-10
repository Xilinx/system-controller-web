##  @term.py
#   This class contains methods that interact with terminals and returns results.
#
import subprocess

class Term:
    ##  @def exec_cmd(cmd)
    #   function to execute cmd on terminal and returns the reuslt.
    #   @param cmd          command to execute on terminal.
    #   @return             result of cmd on sucess
    #                       None on failure
    #
    @staticmethod
    def exec_cmd(cmd):
        try:

            proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,shell=True)
            outs, errs = proc.communicate()
            if errs is None:
                print(outs)
                return outs.decode()
            else:
                print("error")
                return None
        except FileNotFoundError:
            print("error 2")
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


sc_app_path = './sc_app'
class BootMode:
    active_bootmode = "-"
    @staticmethod
    def getActiveBootMode():
        return BootMode.active_bootmode
    @staticmethod
    def setBootMode(mode):
        BootMode.active_bootmode = mode
        SysFactory.exec_cmd(sc_app_path +" -c setbootmode -t "+mode,SysFactory.TERMINAL)
        SysFactory.exec_cmd(sc_app_path +" -c reset",SysFactory.TERMINAL)
class ReqFunctions:
    global sc_app_path
    global sensors_app
    @staticmethod
    def bootmode_set(mode):
        BootMode.setBootMode(mode);
        return {"status":"success","data":""},200

ReqFunctions.bootmode_set("jtag")

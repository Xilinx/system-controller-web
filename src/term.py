##
# Copyright (c) 2020 - 2022 Xilinx, Inc.  All rights reserved.
# Copyright (c) 2022 - 2026 Advanced Micro Devices, Inc.  All rights reserved.
#
# SPDX-License-Identifier: MIT
##

##  @term.py
#   This class contains methods that interact with terminals and returns results.
#
import subprocess
import threading
import socket
import time

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

class SocketTerm:
    ##  Class to execute a terminal command and read its output from a socket.
    #   Combines Term execution with socket reading for commands that output to sockets.
    #   Similar to websocket_server.UartConnect but for synchronous command execution.
    #
    ##  @def exec_cmd_with_socket(command, port, host, timeout, search_string)
    #   Execute a terminal command and read output from a socket connection.
    #   @param command      terminal command to execute.
    #   @param port         port number to connect to for reading output.
    #   @param host         hostname or IP address (default: "127.0.0.1").
    #   @param timeout      duration in seconds to read socket data (default: 10).
    #   @param search_string string to search in the output data (optional).
    #   @return             accumulated data read from socket on success
    #                       "pass" if search_string is found in output
    #                       "fail" if search_string is not found in output
    #                       None on failure
    #
    @staticmethod
    def exec_cmd_with_socket(command, port, host="127.0.0.1", timeout=10, search_string=None):
        sock = None
        data_buffer = []

        try:
            # Connect to socket (similar to UartConnect.establishProcessconnection)
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.connect((host, port))
            sock.setblocking(False)  # Non-blocking mode like websocket_server

            Logg.log(f"Connected to {host}:{port}", Logg.DEBUG)

            # Execute the terminal command using Term class
            Logg.log(f"Executing command: {command}", Logg.DEBUG)
            Term.exec_cmd(command)

            # Give command a moment to start
            time.sleep(0.5)

            start_time = time.time()

            # Read data from socket for the specified duration
            while (time.time() - start_time) < timeout:
                try:
                    data = sock.recv(4096)  # Same buffer size as websocket_server
                    if data:
                        try:
                            decoded_data = data.decode('utf-8')
                        except UnicodeDecodeError:
                            decoded_data = data.decode('iso-8859-1')

                        data_buffer.append(decoded_data)
                        Logg.log(f"Received {len(data)} bytes", Logg.DEBUG)

                        # If search_string is provided, check if found and break early
                        if search_string is not None and data_buffer:
                            current_result = ''.join(data_buffer)
                            if current_result and search_string in current_result:
                                Logg.log(f"Search string '{search_string}' found, breaking early", Logg.DEBUG)
                                break
                    else:
                        # Connection closed by remote end
                        Logg.log("Connection closed by remote end", Logg.DEBUG)
                        break
                except BlockingIOError:
                    # No data available in non-blocking mode
                    time.sleep(0.1)  # Small delay like websocket_server
                    continue
                except Exception as e:
                    Logg.log(f"Error reading from socket: {e}", Logg.DEBUG)
                    break

            Logg.log(f"Finished reading after {time.time() - start_time:.2f} seconds", Logg.DEBUG)
            result = ''.join(data_buffer)

            # If search_string is provided, check if it exists in the result
            if search_string is not None:
                Logg.log(f"Result data: {result}", Logg.DEBUG)
                Logg.log(f"Searching for: {search_string}", Logg.DEBUG)
                if search_string in result:
                    return "PASS"
                else:
                    return "FAIL"

            return result

        except socket.error as e:
            Logg.log(f"Socket error: {e}", Logg.DEBUG)
            if search_string is not None:
                return "FAIL"
            return None
        except Exception as e:
            Logg.log(f"Unexpected error: {e}", Logg.DEBUG)
            if search_string is not None:
                return "FAIL"
            return None
        finally:
            if sock:
                try:
                    sock.close()
                    Logg.log("Socket closed", Logg.DEBUG)
                except:
                    pass

##  Factory class that initializes/calls the system calls related classes
#
class SysFactory:
    ## Enums to specify class type
    #
    TERMINAL = "Term"
    XSDB = "Xsdb"
    SCRIPT = "Scripts"
    SOCKET = "Socket"

    ##  @def exec_cmd(cmd,cmdtype)
    #   function to execute cmd based on type and returns the reuslt.
    #   @param cmd          command to execute.
    #   @param cmdtype      platform type on which cmd has to be executed
    #   @param search_string string to search in the output data (for SOCKET type)
    #   @return             result of cmd on sucess
    #                       None on failure
    #
    @staticmethod
    def exec_cmd(command,  cmdType=None,filename=None,search_string=None):
        if cmdType == SysFactory.TERMINAL:
            return Term.exec_cmd(command)
        if cmdType == SysFactory.SCRIPT:
            return ScriptTerm.exec_cmd(command)
        elif cmdType == SysFactory.XSDB:
            return Xsdb.exec_cmd(command)
        elif cmdType == SysFactory.SOCKET:
            # command should be a tuple (term_command, port) or (term_command, port, host, timeout)
            # Executes term_command and reads output from socket
            term_cmd = command
            port = 4002
            host = "127.0.0.1"
            timeout = 30
            search_string = "Hello world!"
            return SocketTerm.exec_cmd_with_socket(term_cmd, port, host, timeout, search_string)

        else:
            return Other.exec_cmd(command)

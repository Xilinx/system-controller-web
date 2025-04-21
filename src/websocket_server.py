##
# Copyright (c) 2025 Advanced Micro Devices, Inc.  All rights reserved.
#
# SPDX-License-Identifier: MIT
##

import asyncio
import websockets
import threading
import shutil
import socket
from urllib.parse import urlparse, parse_qs

class UartConnect:
    def __init__(self):
        self.sock = None
        self.sessions = set()

    def close(self):
        if self.sock is not None:
            self.sock.close()
    
    def establishProcessconnection(self,cmd):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.connect(("127.0.0.1", cmd))
        self.sock.setblocking(False)

    async def recv_task(self,websocket,path):
        while True:
            if self.sock == None:
                await asyncio.sleep(0.1)  
            message = await websocket.recv()
            self.sock.send(message.encode())

    async def send_task(self,websocket,path):
        while True:
            if self.sock == None:
                await asyncio.sleep(0.1)  

            try:
                output = self.sock.recv(4096).decode()
                if output:
                    for ws in self.sessions:
                        await ws.send(f"{output}")
            except:
                pass
            await asyncio.sleep(0.1)

class WebsocketSession:
    def __init__(self):
        self.sessions = {}
        self.ws_thread = threading.Thread(target=self.run_websockets_server, daemon=True)
        self.ws_thread.start()

    async def handler(self, websocket, path):
        ts = None
        uri = urlparse(path)
        params = parse_qs(uri.query)
        key_value = params.get('session', [None])[0]
        if uri.path == "/connect" and key_value is not None:
            try:
                if key_value not in self.sessions.keys() :
                    self.sessions[key_value] = UartConnect()
                    self.sessions[key_value].establishProcessconnection(int(key_value))
                ts = self.sessions[key_value]
                ts.sessions.add(websocket)
                recv_task_future = asyncio.create_task(ts.recv_task(websocket,key_value))
                send_task_future = asyncio.create_task(ts.send_task(websocket,key_value))
                await asyncio.gather(recv_task_future, send_task_future)

            except websockets.exceptions.ConnectionClosed as e:
                pass
            except Exception as e:
                pass
            finally:
                await websocket.close(code=1000, reason="Connection closed by the server")
                if ts is not None:
                    ts.sessions.remove(websocket)
                    if len(ts.sessions) == 0 :
                        ts.close()
                        ts = None
                        self.sessions[key_value] = None
                        del self.sessions[key_value]
    async def start_websockets_server(self):
        async with websockets.serve(self.handler, "0.0.0.0", 8765):
            await asyncio.Future()

    def run_websockets_server(self):
        asyncio.run(self.start_websockets_server())


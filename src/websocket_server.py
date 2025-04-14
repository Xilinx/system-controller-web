import asyncio
import websockets
import threading
import subprocess
import os
import shutil
from urllib.parse import urlparse, parse_qs

class UartConnect:
    def __init__(self):
        self.sessions = set()
        self.master = None
        self.slave = None
        self.process = None
    def close(self):
        self.process.kill()
        self.process.wait()
        self.process = None
        if self.master is not None:
            os.close(self.master)
            self.master = None
        if self.slave is not None:
            os.close(self.slave)
            self.slave = None
    
    def establishProcessconnection(self,cmd):
        if self.process:
            self.process.terminate()
            self.process.wait()
        self.master, self.slave = os.openpty()
        os.set_blocking(self.master, False)  # Make the master file descriptor non-blocking
        cmd_sp = cmd.split(' ')
        self.process = subprocess.Popen(
                    cmd_sp,
		    stdin=self.slave,
		    stdout=self.slave,
		    stderr=self.slave,
		    close_fds=True,
		    start_new_session=True
		)
    async def recv_task(self,websocket,path):
        while True:
            if self.master == None:
                await asyncio.sleep(0.1)  # You can adjust the sleep time as needed
            message = await websocket.recv()
            os.write(self.master, (message).encode())

    async def send_task(self,websocket,path):
        while True:
            if self.master == None:
                await asyncio.sleep(0.1)  # You can adjust the sleep time as needed
            try:
                output = os.read(self.master, 4096).decode()
                if output:
                    for ws in self.sessions:
                        await ws.send(f"{output}")
            except BlockingIOError:
                pass
            await asyncio.sleep(0.1)  # You can adjust the sleep time as needed

class WebsocketSession:
    def __init__(self):
        self.sessions = {}
        self.ws_thread = threading.Thread(target=self.run_websockets_server, daemon=True)
        self.ws_thread.start()

    async def handler(self, websocket, path):
        uri = urlparse(path)
        params = parse_qs(uri.query)
        key_value = params.get('session', [None])[0]
        if uri.path == "/connect" and key_value is not None:
            try:
                if key_value not in self.sessions.keys() :
                    self.sessions[key_value] = UartConnect()
                    self.sessions[key_value].establishProcessconnection(key_value)
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
                if ts:
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


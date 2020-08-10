##  @uterm.py tests the test cases for eample class
#
import unittest

from src.term import *


class TestTerm(unittest.TestCase):
    # def setUp(self):

    def test_exec_cmd(self):
        resp = SysFactory.exec_cmd("ls",SysFactory.TERMINAL)
        self.assertIsNotNone(resp)
        resp = SysFactory.exec_cmd("s",SysFactory.TERMINAL)
        self.assertIsNone(resp)
        resp = SysFactory.exec_cmd('date',SysFactory.TERMINAL)
        self.assertIsNotNone(resp)

        resp = SysFactory.exec_cmd("ls",SysFactory.XSDB)
        self.assertIsNotNone(resp)
        resp = SysFactory.exec_cmd("s",SysFactory.XSDB)
        self.assertIsNone(resp)
        resp = SysFactory.exec_cmd('date',SysFactory.XSDB)
        self.assertIsNotNone(resp)

        resp = SysFactory.exec_cmd("ls")
        self.assertIsNotNone(resp)
        resp = SysFactory.exec_cmd("s")
        self.assertIsNotNone(resp)
        resp = SysFactory.exec_cmd('date')
        self.assertIsNotNone(resp)

        # def tearDown(self):

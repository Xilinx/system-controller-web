##  @ulogg.py tests the test cases for logg class
#
import unittest

from src.logg import *


class TestLogg(unittest.TestCase):
    def test_log(self):
        self.assertLogs()
        # self.assertLogs(logg.log("testings"))
        # self.assertLogs(logg.log("testings",logg.DEBUG))
        # self.assertLogs(logg.log("testings",logg.ERROR))
        # self.assertLogs(logg.log("testings", logg.RELEASE))
        # self.assertLogs(logg.log("testings", 5))


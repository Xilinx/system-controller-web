##  @uexample.py tests the test cases for eample class
#
import unittest

from src.example import *


class TestExample(unittest.TestCase):
    def setUp(self):
        self.example = Example()

    def test_plus(self):
        self.assertEqual(self.example.plus(1,2),3)
        self.assertNotEqual(self.example.plus(1, 2), 4)

    def test_substraction(self):
        self.assertEqual(self.example.minus(1, 2), -1)
        self.assertEqual(self.example.minus(2, 1), 1)
        self.assertEqual(self.example.minus(-2, 1), -3)
        self.assertEqual(self.example.minus(2, -1), 3)
        self.assertEqual(self.example.minus(10000, 10000), 0)
        self.assertNotEqual(self.example.minus(1, 2), 4)

        # def tearDown(self):


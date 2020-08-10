##  @usystemcontroller.py tests all the test cases in this application
#
import unittest
import sys


# use python3 -m unittest utest/utest.py -vcf to run the test cases
# python3 -m unittest discover -v -p u*.py -s ../
# python3 -m unittest discover -p u*.py -v                     from root directory
#   python3 -m unittest discover -p u*.py -v

# if sys.stdin.isatty():      #import when terminal is used for test running
#     from utest.ulogg import *
#     from utest.uexample import *
# else:                       #import when pycharm ide is used for test running
#     from ulogg import *
#     from uexample import *
#
#     if __name__ == '__main__':
#         unittest.main()
##  @example is an example file for reference
#
import re
class Example:
    def plus(self,a,b):
        return a+b
    def minus(self,a,b):
        return a-b

    def test(self):
        replacepat = re.compile(
            r'(<[^0-9](?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>])*>))*>))*>))*>))*>))*>))*>))*>))*>))*>))*>))*>))*>))*>))*>)|(?:([^\t]*)\r([0-9]*(?:\.[0-9]*)?)?\t(\b|\x08)?)')
        # replacepat = re.compile(r'(<[^0-9](?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>]+|(?:<(?:[^<>])*>))*>))*>))*>))*>))*>))*>))*>))*>))*>))*>))*>))*>))*>))*>)|(?:(.*?)(?:<|$)([0-9]*(?:\.[0-9]*)?)?(\b|\x08)?)')
        # find every occurance of anything needed to be written to the system controller
        print("SYSC Full Command: " + str(re.findall(replacepat, '<setmux:4:74:20><readsi570:4:5d><calcsi570:4:5d:156.25:<1>:00>{reset main mux}')) + "\r\n")
        replacevarpat = re.compile(r'<([0-9]*?)>')
        subspclvars = re.findall(replacepat, '<setmux:4:74:20><readsi570:4:5d><calcsi570:4:5d:156.25:<1>:00>{reset main mux}')
        print(subspclvars)
        for element in re.findall(replacevarpat, 'writestr'):
            print(element)
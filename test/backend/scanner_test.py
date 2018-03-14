# from daak.backend.facade import Scanner

# iscanner = Scanner()
#
# print iscanner.list_scanner_names()

from daak.backend.twain.twainLib import twainLib

myScan = twainLib()
scanners = myScan.getScanners()
myScan.setScanner(scanners[1])
imgs = myScan.multiScan()

print "ok"
# from daak.backend.facade import Scanner

# iscanner = Scanner()
#
# print iscanner.list_scanner_names()
import time

from daak.backend.twain.twainLib import twainLib

myScan = twainLib()
scanners = myScan.getScanners()
myScan.setScanner(scanners[1])
imgs = myScan.multiScan()

imgs[0].save("E:\d.jpg", "JPEG")

print len(imgs)

time.sleep(20)

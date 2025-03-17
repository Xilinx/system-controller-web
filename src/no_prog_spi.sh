#!/bin/sh
echo "Detected board type vek385"
sleep 1
echo "Size of bin file to program is 0x003db370"
sleep 1
echo "Boot bin path: BOOT_vek385.bin"
sleep 1
echo "Device type: versal"
sleep 1
echo "Booting device over JTAG (step 1/4)"
sleep 1
 echo "0%    0MB   0.0MB/s  ??:?? ETA"
sleep 1
 echo "13%    0MB   1.0MB/s  ??:?? ETA"
sleep 1
 echo "18%    0MB   0.6MB/s  ??:?? ETA"
sleep 1
 echo "25%    1MB   0.6MB/s  ??:?? ETA"
sleep 1
 echo "33%    1MB   0.6MB/s  ??:?? ETA"
sleep 1
echo "Downloading flash mage to DDR (step 2/4)"
sleep 1
echo "^M^[[44;38;5;25m█████████▌                                                                      ^[[0m 12.00%^M^[[44;38;5;25m███████████��"
sleep 1
echo "SPI Erasing and programming...this could take up to 5 minutes (step 3/4)"
sleep 1
echo "^M^[[44;38;5;25m█████▌                                                                          ^[[0m  7.00%^M^[[44;38;5;25m██████████████�"
sleep 1
echo "SPI written successfully."
sleep 1
echo "Verifying (step 4/4)"
sleep 1
echo "Verification successful"


#!/bin/sh
##
# Copyright (c) 2020 - 2022 Xilinx, Inc.  All rights reserved.
# Copyright (c) 2022 - 2023 Advanced Micro Devices, Inc.  All rights reserved.
#
# SPDX-License-Identifier: MIT
##
## Make sure sc_appd is up and running
COUNT=30
SC_APP_OUT=`/usr/bin/sc_app -c board 2>&1 | grep "ERROR: "`
while [ "$SC_APP_OUT" != "" -a $COUNT -ne 0 ]; do
    sleep 1
    COUNT=`expr $COUNT - 1`
    SC_APP_OUT=`/usr/bin/sc_app -c board 2>&1 | grep "ERROR: "`
done

if [ $COUNT -eq 0 ]; then
    echo "ERROR: sc_appd is not responding!" >/dev/ttyPS0
    exit -1
fi

## Run scweb server
cd /usr/share/scweb/
python3 systemcontroller.py &

if [ -d /usr/share/embpf-bootfw-update-tool/ospi ]; then
    mkdir -p /data/OSPI
    ln -sf /usr/share/embpf-bootfw-update-tool/ospi/* /data/OSPI/
fi

## print ip on console
COUNT=30
IP=`/usr/bin/ifconfig end0 | grep 'inet ' | awk '{print $2}' | awk -F ':' '{print $1}'`
while [ "$IP" == "" -a "$COUNT" != "0" ]; do
    sleep 1
    COUNT=`expr $COUNT - 1`
    IP=`/usr/bin/ifconfig end0 | grep 'inet ' | awk '{print $2}' | awk -F ':' '{print $1}'`
done

echo | tee -a /dev/console
if [ "$IP" != "" ]
then

  msge=$(cat <<- EOM                                                      
****************************************
*                                      *
*         BEAM Tool Web Address        *
*                                      *
*         http://$IP               
*                                      *
****************************************       
EOM
)
                                                                 
var=$(echo "$msge"  | sed -E '5s/(.{39})/&\*/')
                                                   
else

    var=$(cat <<- EOM
****************************************
*                                      *
*         BEAM Tool Web Address        *
*                                      *
*       No IP address is assigned      *
*                                      *
****************************************
EOM
)

fi

echo "$var" | tee -a /dev/console

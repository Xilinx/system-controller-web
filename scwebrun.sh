#!/bin/sh
##
# Copyright (c) 2020 - 2021 Xilinx, Inc. and Contributors. All rights reserved.
#
# SPDX-License-Identifier: MIT
##

## Run scweb server
cd /usr/share/scweb/
python3 systemcontroller.py >/dev/null 2>&1 &

## Run jupyter notebook with non root user
sudo su - petalinux -c "systemctl --user enable jupyter-setup.service"

## print ip on console
COUNT=25
IP=`/sbin/ifconfig eth0 | grep 'inet addr' | awk '{print $2}' | awk -F ':' '{print $2}'`
while [ "$IP" == "" -a "$COUNT" != "0" ]; do
    echo -n "." >/dev/ttyPS0
    sleep 1
    COUNT=`expr $COUNT - 1`
    IP=`/sbin/ifconfig eth0 | grep 'inet addr' | awk '{print $2}' | awk -F ':' '{print $2}'`
done

echo >/dev/ttyPS0
if [ "$IP" != "" ]; then

    cat >/dev/ttyPS0 <<- EOM
****************************************
*                                      *
*         BEAM Tool Web Address        *
*                                      *
*      http://$IP:50002      *
*                                      *
****************************************
EOM

else

    cat >/dev/ttyPS0 <<- EOM
****************************************
*                                      *
*         BEAM Tool Web Address        *
*                                      *
*       No IP address is assigned      *
*                                      *
****************************************
EOM

fi


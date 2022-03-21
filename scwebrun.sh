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
cd /usr/share/example-notebooks/
OWNER="petalinux"
GROUP="petalinux"
HOME=`(cd ~petalinux && pwd) || echo 'none'`
NBDIR="${HOME}/notebooks"

DAEMON_PATH="/sbin/start-jupyter.sh"
DAEMON_NAME=`basename $DAEMON_PATH`
PIDFILE="/var/run/${DAEMON_NAME}.pid"

PATH=/bin:/usr/bin:/sbin:/usr/sbin

. /etc/init.d/functions

export JUPYTER_CONFIG_DIR="${HOME}/.jupyter"
export JUPYTER_DATA_DIR="${HOME}/.local/share/jupyter"
export JUPYTER_RUNTIME_DIR="${HOME}/.local/share/jupyter/runtime"
export HOME="${HOME}"

# check owner and group are valid
id $OWNER > /dev/null 2>&1
if [ "$?" = "1" ]; then echo "'$OWNER': no such owner... ERROR" ; exit 1 ; fi
grep $GROUP /etc/group > /dev/null
if [ "$?" = "1" ]; then echo "'$GROUP': no such group... ERROR" ; exit 1 ; fi

# create nb dir if it doesn't exist
if [ ! -d "$NBDIR" ] ; then install -o $OWNER -g $GROUP -d $NBDIR ; fi

# start the daemon
start-stop-daemon -S -c $OWNER:$GROUP -m -p $PIDFILE -x $DAEMON_NAME &

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


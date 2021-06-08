#!/bin/sh

cd /usr/share/scweb/
python3 systemcontroller.py >/dev/null 2>&1 &

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


#!/bin/sh
##
# Copyright (c) 2020 - 2021 Xilinx, Inc. and Contributors. All rights reserved.
#
# SPDX-License-Identifier: MIT
##

## Run scweb server
cd /usr/share/scweb/
python3 systemcontroller.py >/dev/null 2>&1 &

## Run Jupyter notebook
dev_eeprom=$(find /sys/bus/i2c/devices/*54/ -name eeprom | head -1)
board=$(fru-print -b som -s $dev_eeprom -f product | tr '[:upper:]' '[:lower:]')
if [ $board == "vck190" ] || [ $board == "vmk180" ]
then
    HOME=`(cd ~root && pwd) || echo 'none'`
    rm ${HOME}/.local/share/jupyter/runtime/*
    systemctl enable jupyter-setup.service
    systemctl start jupyter-setup.service
else
    ## Run jupyter notebook with non root user
    HOME=`(cd ~petalinux && pwd) || echo 'none'`
    rm ${HOME}/.local/share/jupyter/runtime/*
    sudo su - petalinux -c "systemctl --user enable jupyter-setup.service"
fi

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

  msge=$(cat <<-EOM                                                            
****************************************                                        
*                                      *                                        
*         BEAM Tool Web Address        *                                        
*                                      *
*      http://$IP:50002                                        
*                                      *       
****************************************       
EOM                                            
)                                                                  
var=$(echo "$msge"  | sed -E '5s/(.{39})/&\*/')                                 
                                                   
    cat > /dev/ttyPS0 <<-EOM                   
$var                                           
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


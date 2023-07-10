##
# Copyright (c) 2020 - 2022 Xilinx, Inc.  All rights reserved.
# Copyright (c) 2022 - 2023 Advanced Micro Devices, Inc.  All rights reserved.
#
# SPDX-License-Identifier: MIT
##


app_config = {
    "deployment":"RELEASE"              # RELEASE, DEBUG
    ,"major_version":"1"
    ,"minor_version" : "0"
    ,"dev_for_major_ver" : "β_3"
    ,"dev_minor_ver" : "020"
    ,"sc_app_path":"sc_app"
    ,"config_sc_list_cmds":["listpower","listclock","listvoltage","listgpio","listSFP","listpowerdomain","listQSFP","listFMC"]
    ,"config_bit_list_cmds":["listBIT"]
    ,"config_bm_list_cmds":["listbootmode"]
    ,"jnlocalrundir":"/home/petalinux/.local/share/jupyter/runtime/"
    ,"jnlocalrundirroot":"/home/root/.local/share/jupyter/runtime/"
    ,"8A34001_clk_files_path":"/usr/share/system-controller-app/BIT/clock_files/"
    ,"board_file_path":"/home/root/.sc_app/board"
    ,"uploaded_files_path":"/usr/share/system-controller-app/.sc_app/clock_files/"	
}


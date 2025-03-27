##
# Copyright (c) 2020 - 2022 Xilinx, Inc.  All rights reserved.
# Copyright (c) 2022 - 2025 Advanced Micro Devices, Inc.  All rights reserved.
#
# SPDX-License-Identifier: MIT
##


app_config = {
    "deployment":"RELEASE"              # RELEASE, DEBUG
    ,"major_version":"1"
    ,"minor_version" : "5"
    ,"dev_for_major_ver" : "1"
    ,"dev_minor_ver" : "4"
    ,"sc_app_path":"sc_app"
    ,"scriptfile":"/usr/bin/collect_logs.sh"
    ,"boardsetupfile":"/usr/bin/setup_board.sh"
    ,"versioninfo":"/usr/bin/version_info.sh" 
    ,"bitlogFilePath":"/usr/share/system-controller-app/.sc_app/BIT.log"
    ,"csvFIlePath":"/usr/share/raft/examples/python/pmtool/pm-cmd.py output-csv --path ./static/tmp/"
    ,"raucFilepath":"/data/"
    ,"ospiFilepath":"/data/OSPI/"
    ,"ospirunscript":"/usr/share/embpf-bootfw-update-tool/prog_spi.sh -V -s 4001 -d versal_eval -vp -i /data/OSPI/"
    ,'ospirunstatusfile': "./ospi_flash_status.txt"
    ,'ospirunstatusfile_getstatus':"[ -f ./ospi_flash_status.txt ] && cat ./ospi_flash_status.txt" #"[ -f ./ospi_flash_status.txt ] && tail -n 1 ./ospi_flash_status.txt"
    ,"config_sc_list_cmds":["listpower","listclock","listvoltage","listFMCvoltage","listgpio","listSFP","listpowerdomain","listQSFP","listFMC"]
    ,"config_bit_list_cmds":["listBIT"]
    ,"config_bm_list_cmds":["listbootmode"]
    ,"jnlocalrundir":"/home/petalinux/.local/share/jupyter/runtime/"
    ,"jnlocalrundirroot":"/home/root/.local/share/jupyter/runtime/"
    ,"8A34001_clk_files_path":"/usr/share/system-controller-app/BIT/clock_files/"
    ,"board_file_path":"/home/root/.sc_app/board"
    ,"uploaded_files_path":"/data/clock_files/"
    ,"PDIFilePath":"/data/PDIs/"
    ,"allowed_clock_files":['txt', 'tcs', 'bin']
}

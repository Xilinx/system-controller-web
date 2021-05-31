/*
* Copyright (c) 2020 - 2021 Xilinx, Inc. and Contributors. All rights reserved.
*
* SPDX-License-Identifier: MIT
*/
/**
*   Spec to create json for board interface tests
    each object in the below array is a row for the test case which contains lable, progress bar and button to run test.
    below are the mandatory components for each object.
        "name":"Sysctrl Boot Check"             // name of the test
        ,"url":"/bit"                           // url to run the test cases.
        ,"test":"sysctrl_boot_check"            // test case to run.

*/


var bitTab = [
    {
        "name":"Power test"
        ,"url":"/bit"
        ,"test":"sysctrl_boot_check"
    }
    ,{
        "name":"Sysctrl Boot Check"
        ,"url":"/bit"
        ,"test":"sysctrl_boot_check"
    }

];

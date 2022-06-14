/*
* Copyright (c) 2020 - 2021 Xilinx, Inc. and Contributors. All rights reserved.
*
* SPDX-License-Identifier: MIT
*/
var app_strings = {
	"tab_title":"Board Evaluation & Management Tool (BEAM)",
	"app_title":"Board Evaluation & Management Tool (BEAM)",
	"xilinx_icon":"../images/icon.png",
	"home_tab":{
		"title":"Welcome & Get Started with Versal Premium Series VEK280 Evaluation Kit",
		"left_pane":[
			{
				"image":"../static/images/VersalSilicon.png",
				"text":"",
				"button_title":"About Versal ACAP",
				"button_link":"https://www.xilinx.com/products/silicon-devices/acap/versal.html",
			},
			{
				"image":"../static/images/premium.png",
				"text":"",
				"button_title":"Product Table",
				"button_link":"https://www.xilinx.com/products/silicon-devices/acap/versal-premium.html#productTable",
			}
		],
		"center_pane":{
			"image":"../static/images/VEK280_home.png",
			"text":"",
			"button_title":"",
			"button_link":"",
		},
	},
	"test_board":{
		"title":"",
		"center_pane":{
			"image":"../static/images/vek280.jpg",
			"text":"For more information regarding Hardware, Documentation, Tools & IP and Training & Support",
			"button_title":"",
			"button_link":"",
		},

	},
	"linuxprompt":{
		"title":"Obtain Linux Prompt",
		"pane":[
			/*{
				"title":"Instructions to obtain Linux prompt from Versal",
				"image":"../static/images/xilinx_banner.png",
				"text":"",
				"button_title":"Download",
				"button_link":"",
				"learnmore_link":"https://xilinx.github.io/Embedded-Design-Tutorials/master/docs/index.html",
			},*/
		],

	},
	"run_demos":{
		"title":"Demos & Designs",
		"pane":[
			{
				"title":"Petalinux BSP Designs",
				"image":"../static/images/xilinx_banner.png",
				"text":"Refer to vek280 EA Lounge",
				"button_title":"",
				"button_link":"",
				"learnmore_link":"",
			},
			{
				"title":"Versal Power Tool",
				"image":"../static/images/xilinx_banner.png",
				"text":"",
				"button_title":"Run",
                                "button_link_type":1,
				"button_link": "jnurllink",
				"learnmore_link":"https://xilinx-wiki.atlassian.net/wiki/spaces/A/pages/1299251214/Versal+ACAP+Power+Tool+part+1+-+Introduction+to+the+Power+Tool",
			},
			{
				"title":"Target Reference Designs",
				"image":"../static/images/xilinx_banner.png",
				"text":"Refer to VEK280 EA Lounge",
				"button_title":"",
				"button_link":"",
				"learnmore_link":"",
			},
			{
                                "title":"ACAP Cockpit",
                                "image":"../static/images/xilinx_banner.png",
                                "text":"",
                                "button_title":"Run",
                                "button_link_type":1,
                                "button_link": "launchacap",
                                "learnmore_link":"https://xilinx-wiki.atlassian.net/wiki/spaces/A/pages/1544192059/ACAP+Cockpit",
                        },
			/*{
                                "title":"Power Management Dashboard",
                                "image":"../static/images/xilinx_banner.png",
                                "text":"",
                                "button_title":"Run",
                                "button_link_type":1,
                                "button_link": "launchpmtool",
                                "learnmore_link":"https://xilinx-wiki.atlassian.net/wiki/spaces/A/pages/1887862954/Power+Management+Dashboard",
                        },*/
		],

	},
	"develop_tools":{
		"title":"Develop using Tools",
		"left_pane":{
			"image":"../static/images/Develop_tools.png",
			"text":"Xilinx provides technical resources to help you understand the design flow, optimize software, and solve your development challenges.",
			"button_title":"",
			"button_link":"",
		},
		"right_pane":[
			{
				"image":"../static/images/ai_sc.png",
				"text":"",
				"button_title":"About Vitis/Vitis AI",
				"button_link":"https://www.xilinx.com/products/design-tools/vitis.html",
			},
			{
				"image":"../static/images/apd.png",
				"text":"",
				"button_title":"Visit Developer site",
				"button_link":"https://developer.xilinx.com/",
			},
			{
				"image":"../static/images/ed.png",
				"text":"",
				"button_title":"Download Libraries",
				"button_link":"https://github.com/Xilinx/Vitis_Libraries",
			},
			{
				"image":"../static/images/hd.png",
				"text":"",
				"button_title":"About Vivado Design Suite",
				"button_link":"https://www.xilinx.com/products/design-tools/vivado.html",
			},
			{
				"image":"../static/images/hd.png",
				"text":"",
				"button_title":"Download Vivado",
				"button_link":"https://www.xilinx.com/support/download.html",
			}
		],

	},
        "help_content":{
                "title":"Help",
                "content":[
                        {
                                "heading":"",
                                "content_type":0,	// 0: paragraph, 1: bullet points
                                "content":["The Board Evaluation & Management Tool (BEAM) is currently in Beta version ("+listsjson_sc.version+")"]
                        },
                        {
                                "heading":"known issues and bugs",
                                "content_type":1,
                                "content":["Some webpage links may be broken or non-functional. This may happen because the webpage may not exist or is moved to a different location/address. These links will be fixed in subsequent release of the Board Evaluation & Management Tool (BEAM).","The Board Evaluation & Management Tool (BEAM) can execute one particular action/task only at a time. For example, you cannot run the Board Settings and Board Interface Test at the same time. Please wait till a particular task is complete and then proceed."]
                        },
                        {
                                "heading":"Jupyter Notebook",
                                "content_type":1,
                                "content":["Logout from jupyter notebook before exiting. Failing doing so may show login screen for next notebook launch.",
					"Run jupyter notebook command in linux prompt to use from Board Evaluation & Management Tool if \"no jupyter notebook is running\" error message is shown.",
					"Jupyter notebook and BITs/SCUI tabs cannot be run at a time. Shut down any jupyter notebook kernels to use BIT or SCUI tabs components.",
					"Run jupyter notebook command in system controller prompt to start jupyter notebook server if system controller is set with static ip and notebook web page is not launching from BEAM Tool.",
				]
                        },
                ],

        },
        "about_content":{
                "title":"About",
                "content":[
                        {
                                "heading":"",
                                "content_type":0,       // 0: paragraph, 1: bullet points
                                "content":["The Board Evaluation & Management Tool (BEAM) is the main menu of the System Controller. It primarily serves as a launcher for demos and designs, running the board interface test and to set/change/read board parameters.",
                                           "The purpose of the Board Evaluation & Management Tool is to provide Versal users a much easier and far more intuitive experience with Xilinx Evaluation Board products. The goal is to help users get started faster and have all the available resources at one place for easy access.",
                                           "The Board Evaluation & Management Tool (BEAM) offers multiple navigation options for users. Depending on the persona type (Hardware, Software or Embedded developer) users can choose to start with either testing the board, use the Versal power tool, download Versal reference designs or learn more above the latest tools and libraries. ",
                                           "More features will be added in the next releases and existing features will be enhanced for a better out-of-box experience to users."]
                        },
                ],

        },

};

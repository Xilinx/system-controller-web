/******************************************************************************
 *
 * Copyright (C) 2020 Xilinx, Inc.  All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * Use of the Software is limited solely to applications:
 * (a) running on a Xilinx device, or
 * (b) that interact with a Xilinx device through a bus or interconnect.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * XILINX  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF
 * OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Except as contained in this notice, the name of the Xilinx shall not be used
 * in advertising or otherwise to promote the sale, use or other dealings in
 * this Software without prior written authorization from Xilinx.
 *
 ******************************************************************************/
var app_strings = {
	"tab_title":"VCK190 Evaluation Kit",
	"app_title":"System Controller Landing Page",
	"xilinx_icon":"../images/icon.png",
	"home_tab":{
		"title":"Welcome & Get Started with Versal AI Core Series VCK190 Evaluation Kit",
		"left_pane":[
			{
				"image":"../static/images/VersalSilicon.png",
				"text":"",
				"button_title":"About Versal ACAP",
				"button_link":"https://www.xilinx.com/products/silicon-devices/acap/versal.html",
			},
			{
				"image":"../static/images/AICore.png",
				"text":"",
				"button_title":"Product Table",
				"button_link":"https://www.xilinx.com/products/silicon-devices/acap/versal-ai-core.html#productTable",
			}
		],
		"center_pane":{
			"image":"../static/images/VCK190_home.png",
			"text":"",
			"button_title":"Visit Product Page",
			"button_link":"https://www.xilinx.com/products/boards-and-kits/vck190.html",
		},
	},
	"test_board":{
		"title":"",
		"center_pane":{
			"image":"../static/images/vck190.jpg",
			"text":"For more information regarding Hardware, Documentation, Tools & IP and Training & Support",
			"button_title":"Visit Product Page",
			"button_link":"https://www.xilinx.com/products/boards-and-kits/vck190.html",
		},
		
	},
	"linuxprompt":{
		"title":"Obtain Linux Prompts",
		"pane":[
			{
				"title":"Instructions to obtain Linux prompts from Versal",
				"image":"../static/images/xilinx_banner.png",
				"text":"",
				"button_title":"Download",
				"button_link":"",
				"learnmore_link":"https://xilinx-wiki.atlassian.net/wiki/spaces/XWUC/pages/748617729/Versal+AI+Core+Series+VCK190+Evaluation+Kit",
			},
		],

	},
	"run_demos":{
		"title":"Demos & Designs",
		"pane":[
			{
				"title":"Petalinux BSP Designs",
				"image":"../static/images/xilinx_banner.png",
				"text":"",
				"button_title":"Product Page",
				"button_link":"https://www.xilinx.com/products/boards-and-kits/vck190.html",
				"learnmore_link":"https://xilinx-wiki.atlassian.net/wiki/spaces/XWUC/pages/748617729/Versal+AI+Core+Series+VCK190+Evaluation+Kit",
			},
			{
				"title":"Power Advantage Demo",
				"image":"../static/images/xilinx_banner.png",
				"text":"",
				"button_title":"Run",
                                "button_link_type":1,
				"button_link": "jnurllink",
				"learnmore_link":"https://xilinx-wiki.atlassian.net/wiki/spaces/XWUC/pages/748617729/Versal+AI+Core+Series+VCK190+Evaluation+Kit",
			},
			{
				"title":"Target Reference Designs",
				"image":"../static/images/xilinx_banner.png",
				"text":"",
				"button_title":"Product Page",
				"button_link":"https://www.xilinx.com/products/boards-and-kits/vck190.html",
				"learnmore_link":"https://xilinx-wiki.atlassian.net/wiki/spaces/XWUC/pages/748617729/Versal+AI+Core+Series+VCK190+Evaluation+Kit",
			},
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
                                "content":["The System Controller Landing Page is currently in Beta version ("+listsjson_sc.version+")"]
                        },
                        {
                                "heading":"known issues and bugs",
                                "content_type":1,	
                                "content":["Some webpage links may be broken or non-functional. This may happen because the webpage may not exist or is moved to a different location/address. These links will be fixed in subsequent release of the Landing Page.","The System Controller Landing Page can execute one particular action/task only at a time. For example, you cannot run the Board Settings and Board Interface Test at the same time. Please wait till a particular task is complete and then proceed."]
                        },
                        {
                                "heading":"Jupyter Notebook",
                                "content_type":1,
                                "content":["Logout from jupyter notebook before exiting. Failing doing so may show login screen for next notebook launch.",
					"Run jupyter notebook command in linux prompt to use from landing page if \"no jupyter notebook is running\" error message is shown.",
					"Terminating notebook server using kill command may not able to launch notebook in new tab for next notebook launch.",
					"Delete all *.json, *.html files from mentioned directory in order to relaunch jupyter notebook if \"Please delete multiple files from directory <jupyter nbrunning dir>.\" error message is shown.",
					"Jupyter notebook and BITs/SCUI tabs cannot be run at a time. Shut down any jupyter notebook kernels to use BIT or SCUI tabs components.",
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
                                "content":["The System Controller Landing Page is the main menu of the System Controller. It primarily serves as a launcher for demos and designs, running the board interface test and to set/change/read board parameters.",
                                           "The purpose of the landing page is to provide Versal users a much easier and far more intuitive experience with Xilinx Evaluation Board products. The goal is to help users get started faster and have all the available resources at one place for easy access.",
                                           "The Landing Page offers multiple navigation options for users. Depending on the persona type (Hardware, Software or Embedded developer) users can choose to start with either testing the board, use the power advantage demo, download Versal reference designs or learn more above the latest tools and libraries. ",
                                           "More features will be added in the next releases and existing features will be enhanced for a better out-of-box experience to users."]
                        },
                ],

        },

};

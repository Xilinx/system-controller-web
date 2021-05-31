/*
* Copyright (c) 2020, Xilinx Inc. and Contributors. All rights reserved.
*
* SPDX-License-Identifier: MIT
*/
var myVar;
var pollresp = false;
/*
* loading screen for till loading the html pages
*/
function showloading() {
  myVar = setTimeout(showPage, 500);
}
function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("root").style.display = "block";
}
/*
* API calls and rendering data to html pages.
*/
function loadRefreshData(){
    $.ajax({
            url: "/funcreq",
            type: 'GET',
            data:{"func":"poll","params":""},
            dataType: 'json',
            success: function (res){
                var el = document.getElementById("home_board_temp_id");
                var tval = 0;
		tval = res.data.temp > 100 ? 100 : res.data.temp;
		tval = tval < 0 ? 0 : tval;
		el.style.setProperty("--temps", tval);
                if(res.data.temp < 70) el.style.setProperty("--showc","green");
                else if(res.data.temp < 90) el.style.setProperty("--showc","orange");
                else el.style.setProperty("--showc","red");
                document.getElementById("home_board_temp_id").innerHTML = res.data.temp +" °C";
                document.getElementById("active_bootmode").innerHTML = "Active:<b>"+res.data.active_bootmode+"</b>"
 		pollresp = true;
            },
            error: function(){
                console.log("mthod call")
 		pollresp = true;
            }
    });
}
function filleepromdetails(){
    $.ajax({
            url: "/eeprom_details",
            type: 'GET',
            dataType: 'json',
            success: function (res){
                document.getElementById("db_details_Device").innerHTML = "Device : " + "<b>"+res.data.device+ "</b>"
                document.getElementById("db_details_silrev").innerHTML = "Silicon Rev : " + "<b>"+res.data.sil_rev+ "</b>"
                document.getElementById("db_details_boardpn").innerHTML = "Board P/N : " + "<b>"+res.data.board_pn+ "</b>"
                document.getElementById("db_details_rev").innerHTML = "Rev : " + "<b>"+res.data.rev+ "</b>"
                document.getElementById("db_details_serno").innerHTML = "Serial Number : " + "<b>"+res.data.serial_number+ "</b>"
                document.getElementById("db_details_mac1").innerHTML = "MAC Address 1 : " + "<b>"+res.data.mac1+ "</b>"
                document.getElementById("db_details_mac2").innerHTML = "MAC Address 2 : " + "<b>"+res.data.mac2 + "</b>"
                document.getElementById("versionLabel").innerHTML = "V "+res.data.appversion
            },
            error: function(){
                console.log("mthod call")
            }
    });
}
function getquery(methods){
    $.ajax({
            url: "/cmdquery",
            type: 'GET',
            dataType: 'json',
            data:{"request":"test","params":"a"+","+"b"},
            success: function (res){
            },
            error: function(){
                console.log("mthod call")
            }
    });
}
function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}
function jnurllink(){
    $.ajax({
            url: "/funcreq",
            type: 'GET',
            data:{"func":"jnlink","params":""},
            dataType: 'json',
            success: function (res){
                if(res.data[0] == 1){
                    openInNewTab(res.data[1]);
                }else{
                    window.alert("Not able to launch Junpyter notebook. Please check if Jupyter notebook is running.");
                }
            },
            error: function(){
                    window.alert("Not able to launch Junpyter notebook. Please check if Jupyter notebook is running.");
            }
    });
}
function launchacap(){
    
    openInNewTab(getlocallink());

}
function launchpmtool(){
    
    openInNewTab(getlocallinkwithport("50004"));

}
function hideAllPages(){
    $("#home_screen_com, #home_screen_db, #help_screen, #about_screen, #dnd_screen, #boardseettings_screen, #tools_screen, #testandebug_screen, #linuxprompt_screen, #ttbbackid").addClass('hide');
}

function renderComponentDiv(name, comps,heads){
    var bodycomp = document.createElement("div");
//    bodycomp.classList.add("hide");
    bodycomp.id = name;

//    bodycomp.id = "clock_set_div";


    var tablecomp = document.createElement("table");
//    tablecomp.id = "boardsettings"
    tablecomp.classList.add("boardsettings_table");

var theadcomp = document.createElement("thead");
    var theadrowcomp = document.createElement("tr");
        jQuery.each(heads.headcomponents[0].split(","),function(l,elem){
             var tdcomp = document.createElement("th");

            switch(elem.split("")[0]){
                    case "C":
                       var em = document.createElement("input");
                       em.setAttribute("type", "checkbox");
                       em.setAttribute("checked", true);
                       em.classList.add("headcheckbox");
                       tdcomp.appendChild(em)
                    break;
                    case "L":
                        var em = document.createTextNode(heads[elem]);
                        tdcomp.appendChild(em);
                    break;

                    case "B":
                       var em = document.createElement("input");
                       em.classList.add("buttons");
                       em.setAttribute("value", heads[elem]);
                       em.setAttribute("type", "button");

                       tdcomp.appendChild(em)
                    break;

                    default:
                        console.log("Not Defined  ========= "+ elem);

                    break;
            }
            theadrowcomp.appendChild(tdcomp);

    });
    var tdcomp = document.createElement("th");
        var es = document.createTextNode("Status");
        tdcomp.appendChild(es);
        theadrowcomp.appendChild(tdcomp);


    theadcomp.appendChild(theadrowcomp);
    tablecomp.appendChild(theadcomp);

    var tbodycomp = document.createElement("tbody");
//    tbodycomp.id = "clocksSet"
    tbodycomp.classList.add("table_body");

    jQuery.each(comps, function(j, c){
        var trcomp = document.createElement("tr");

        jQuery.each(c.components, function(k, d){
            jQuery.each(d.split(","),function(l,elem){
                var tdcomp = document.createElement("td");

                switch(elem.split("")[0]){
                    case "C":
                       var em = document.createElement("input");
                       em.setAttribute("type", "checkbox");
                       em.setAttribute("checked", true);
                       tdcomp.appendChild(em)
                    break;
                    case "L":
                        var em = document.createTextNode(c[elem]);
                        tdcomp.appendChild(em);
                    break;
                    case "V":

                        var em = document.createElement("label");
                        em.setAttribute("respKey", c[elem+"V"]);
                        em.setAttribute("notation", c[elem+"N"]);
                        tdcomp.appendChild(em)
                        var es = document.createTextNode(c[elem]);
                        em.appendChild(es);
                    break;
                    case "B":
                       var em = document.createElement("input");
                       em.classList.add("buttons");
                       em.setAttribute("value", c[elem]);
                       em.setAttribute("type", "button");
                       em.setAttribute("components",c.components[0]);
                       em.setAttribute("request",c[elem+"A"]);
                       em.setAttribute("sc_cmd",c[elem+"sc_cmd"]);
                       em.setAttribute("target",c[elem+"target"]);
                       em.setAttribute("params",c[elem+"params"]);
                       tdcomp.appendChild(em)
                    break;
                    case "E":
                       var em = document.createElement("input");
//                       em.classList.add("buttons");
                       em.setAttribute("type", "text"   );
                       em.setAttribute("reqkey", c[elem]);
//                       em.setAttribute("reqkey",c[elem+"K"]);
                       tdcomp.appendChild(em)
                    break;
                    case "F":
                       jQuery.each(c[elem+"V"],function(l, m){
                       var em = document.createElement("select");
                       em.setAttribute("reqkey", c[elem]);
                  
                        jQuery.each(m, function(j, n){  
				var g = document.createElement("option");
	                        g.setAttribute('value',n);
        	                g.innerHTML = ""+n+" "+c[elem+"N"];
				em.appendChild(g);
                        });
			
                       tdcomp.appendChild(em)
                        });
                    break;
                    case "D":
                       var em = document.createElement("select");
//                       em.classList.add("buttons");
                       //em.setAttribute("type", "text");
                       em.setAttribute("reqkey", c[elem]);
//                       em.setAttribute("reqkey",c[elem+"K"]);
                        jQuery.each(c[elem+"V"], function(j, n){  
				var g = document.createElement("option");
	                        g.setAttribute('value',n);
        	                g.innerHTML = ""+n+" "+c[elem+"N"];
				em.appendChild(g);
                        });
			
                       tdcomp.appendChild(em)
                    break;
                    default:
                        console.log("Not Defined  ========= "+ elem);

                    break;
                }
                trcomp.appendChild(tdcomp);
            });
        });
        var tdcomp = document.createElement("td");
        var em = document.createElement("div");
	var ar = document.createElement("a");
        ar.classList.add("tooltiptext");
        em.appendChild(ar);
        tdcomp.appendChild(em)
        trcomp.appendChild(tdcomp);

        tbodycomp.appendChild(trcomp);
    });

    tablecomp.appendChild(tbodycomp);
    bodycomp.appendChild(tablecomp);
    return bodycomp;
}
function rendertabComponentDiv(title, comp){

    var tabcomp = document.createElement("div");
    tabcomp.classList.add("content-body");
    tabcomp.id = title.split(' ').join('_').replace("+","")
    if(comp.subtype == 'tab'){
        var tabdiv = document.createElement("div");
        var navdiv = document.createElement("nav");
        var uldiv = document.createElement("ul");
        uldiv.classList.add("subtabitemlist");

        jQuery.each(comp.components, function(j, c){
                var lidiv = document.createElement("li");
                lidiv.classList.add("tab_subitem");
                if(j == 0){
                    lidiv.classList.add("active");
                }
                lidiv.setAttribute('specKey_id',title.split(' ').join('_') + c.name.split(' ').join('_').replace("+",""));
                var node = document.createTextNode(c.name);
                lidiv.appendChild(node);
                uldiv.appendChild(lidiv);
        });
        navdiv.appendChild(uldiv);
        tabdiv.appendChild(navdiv);
        tabcomp.appendChild(tabdiv);

        var contentDiv = document.createElement("div");

        jQuery.each(comp.components, function(j, c){
            if(c.subtype == 'tab'){
                var ti = title.split(' ').join('_')+c.name.split(' ').join('_').replace("+","");
                var b = rendertabComponentDiv(ti,c);
                if(j){
                    b.classList.add("hide");
                }
                contentDiv.appendChild(b);
            }
            else{
                var bodycomp = renderComponentDiv(title.split(' ').join('_') + c.name.split(' ').join('_').replace("+",""), c.components, c.headcomponents )
                if(j){
                    bodycomp.classList.add("hide");
                }
                contentDiv.appendChild(bodycomp);

            }
        });

    }else{
        jQuery.each(comp, function(j, c){

            var bodycomp = renderComponentDiv(title.split(' ').join('_') + c.name.split(' ').join('_').replace("+",""), c.components, c.headcomponents)
            if(j){
                bodycomp.classList.add("hide");
            }
            contentDiv.appendChild(bodycomp);
        });
    }
    tabcomp.appendChild(contentDiv);

    return tabcomp;
}

function generateBoardSettingsUI(){
    jQuery.each(boardsettingsTab, function(i, sidetab){
        $("#boardtestdiv").append('<li class="'+(i == 0 ? "active":"") +'"; specKey_id="'+sidetab.tab.split(' ').join('_').replace("+","")+'">'+sidetab.tab+'</li>')
        var compDiv = rendertabComponentDiv(sidetab.tab.split(' ').join('_').replace("+",""), sidetab);
        if(i){
            compDiv.classList.add("hide");
        }
        $("#bsettings_subtabs").append(compDiv)
    });

    $('#boardtestdiv li').click(function (e) {
        $(e.target).addClass('active').siblings().removeClass('active');
        $("#"+e.target.getAttribute("specKey_id")).removeClass('hide').siblings().addClass('hide');
    });

     $('.tab_subitem').click(function (e) {
        $(e.target).addClass('active').siblings().removeClass('active');
        $("#"+e.target.getAttribute("specKey_id")).removeClass('hide').siblings().addClass('hide');
    });
    $(".headcheckbox").click(function(e){
            var erow = $(e.target).parent().parent().parent().parent().find('tbody').find("tr");
            jQuery.each(erow, function(j,trs){
                jQuery.each(trs.childNodes, function(k,tds){
                    try{
                        jQuery.each(tds.childNodes, function(k,ele){
                            if(ele.nodeName.toLowerCase() == "input"){
                                if(ele.type == "checkbox"){
                                    ele.checked = e.target.checked;
                                }
                            }
                        });
                    }catch(err){};
                });
            });
    });
    $(".buttons").click(function(e){
      var eles = $(e.target).parent().siblings();
      var order = e.target.getAttribute("components");
      var tar = e.target.getAttribute("request");
        if(e.target.value.includes("All")){
            // trigger all othter calls in the current table.
            var erow = $(e.target).parent().parent().parent().parent().find('tbody').find("tr");
            jQuery.each(erow, function(j,trs){
                var checkSelected = false
                jQuery.each(trs.childNodes, function(k,tds){
                    try{
                        var lst = tds.childNodes[0].classList;
                        jQuery.each(tds.childNodes, function(k,ele){
                            if(ele.nodeName.toLowerCase() == "input"){
                                if(ele.type == "checkbox"){
                                    checkSelected = ele.checked
                                }
                                if (ele.type == "button"){
                                    if(checkSelected == true){
                                        ele.click();
                                    }
                                }
                            }

                        });

                    }catch(err){};

                });
            });
        }
        // Read value from html and create api and send to server.
      var setparams = "";
      jQuery.each(eles, function(i, tds){
        var cnd = this.childNodes;
        jQuery.each(cnd, function(k, cn){
        try{
            if(cn.getAttribute("reqKey")){
                if(cn.nodeName.toLowerCase() == "input"){
                    setparams += (setparams.length ? "," : "" )+cn.value
                }
                else if(cn.nodeName.toLowerCase() == "select"){
                    setparams += (setparams.length ? " " : "" )+cn.value;
                }
            }
            if(cn.nodeName.toLowerCase() == "div"){
                cn.className = '';
                cn.classList.add("ministatusloading");
		cn.childNodes[0].innerHTML = "";
      	    }
        }catch (err){
            //console.log("Error handled"+err);
        }
       });
      });
      // Ajax request
      // Adding prerequired parameters if any.
      setparams += (setparams.length ? " " : "" )+e.target.getAttribute("params")
      setparams = setparams.trim(); 
      if(setparams.indexOf(' ') >= 0){
          setparams = "'"+setparams.trim()+"'";
      }
    $.ajax({
            url: tar,
            type: 'GET',
            dataType: 'json',
            data:{"sc_cmd":e.target.getAttribute("sc_cmd"), "target":e.target.getAttribute("target"), "params":setparams},
            success: function (res){
                  // Set value from API response to html div here
                  jQuery.each(eles, function(i, tds){
                    var cn = this.childNodes[0];
                    try{
                        if(cn.getAttribute("respKey")){
                            if(cn.nodeName.toLowerCase() == "label"){
                                if (res.data[cn.getAttribute("respKey")] != undefined){
                                    cn.innerHTML = res.data[cn.getAttribute("respKey")] + " " + cn.getAttribute("notation");
                                }
                            }
                        }
			if(cn.nodeName.toLowerCase() == "div"){
			    if (res.status == "error"){
                                cn.childNodes[0].innerHTML = res.data+restime();
                                cn.className = '';
                                cn.classList.add("ministatusfail");
                                cn.classList.add("tooltip");
			    }
                            else{
                                cn.childNodes[0].innerHTML = "Success"+restime();
                                cn.className = '';
                                cn.classList.add("ministatussuccess");
                                cn.classList.add("tooltip");
			    }
                        }
                    }catch (err){
//                        console.log("Error handled"+err);
                    }
                  });

            },
            error: function(){
//                console.log("mthod call")
	           jQuery.each(eles, function(i, tds){
                    var cn = this.childNodes[0];
                    try{

                        if(cn.nodeName.toLowerCase() == "div"){
                            cn.childNodes[0].innerHTML = "Network Error"+restime();
                            //cn.getElementByClass("tooltip").innerHTML = "Network Error";
                            cn.className = '';
                            cn.classList.add("ministatusfail");
                            cn.classList.add("tooltip");
                        }
                    }catch (err){
                        console.log("Error handled"+err);
                    }
                  });
	    }
    });




    });
}
function restime(){
    return "";//"</br>"+(new Date()).toLocaleTimeString();
}
function generateBITUI(){
    var tablecomp = document.createElement("table");
    tablecomp.classList.add("testdebug_table");
    var tbodycomp = document.createElement("tbody");
    tbodycomp.classList.add("table_body");

    jQuery.each(listsjson_bit.listBIT, function(j, c){
        var trcomp = document.createElement("tr");

        var tdcomp = document.createElement("td");
        var em = document.createElement("input");
        em.setAttribute("type", "checkbox");
        em.setAttribute("checked", true);
        tdcomp.appendChild(em)
        trcomp.appendChild(tdcomp);
        tdcomp = document.createElement("td");
        em = document.createTextNode(c);
        tdcomp.appendChild(em);
        trcomp.appendChild(tdcomp);
        tdcomp = document.createElement("td");
        em = document.createElement("div");
        em.classList.add("progress_back_bar");
        em2 = document.createElement("div");
        em2.classList.add("progress_inprogress_bar");
        em.appendChild(em2);
        tdcomp.appendChild(em);

        trcomp.appendChild(tdcomp);
        tdcomp = document.createElement("td");
        em = document.createElement("input");
        em.classList.add("buttons_bit");
        em.setAttribute("type", "button");
        em.setAttribute("value", "Run");
        em.setAttribute("request",c["url"]);
        em.setAttribute("target_s",c);
        tdcomp.appendChild(em)
        trcomp.appendChild(tdcomp);


        var tdcomp = document.createElement("td");
        var em = document.createElement("div");
	var ar = document.createElement("a");
        ar.classList.add("tooltiptext");
        em.appendChild(ar);
        tdcomp.appendChild(em)
        trcomp.appendChild(tdcomp);

        tbodycomp.appendChild(trcomp);
    });

    tablecomp.appendChild(tbodycomp);
    $("#bit_tab_screen").append(tablecomp);


    $(".buttons_bit").click(function(e){
    
    console.log("button clicked"+e.target.getAttribute("target_s"));
/*        var erow = $(e.target).parent().parent().parent().parent().find('tbody').find("tr");
            jQuery.each(erow, function(j,trs){
                var checkSelected = false
                jQuery.each(trs.childNodes, function(k,tds){
                    try{
                        var lst = tds.childNodes[0].classList;
                        jQuery.each(tds.childNodes, function(k,ele){
                            if(ele.nodeName.toLowerCase() == "div"){
                                jQuery.each(ele.childNodes, function(l,inprg){
                                inprg.className="";
                                inprg.classList.add("progress_inprogress_bar");
                                inprg.classList.add("progress_inprogress_reset");
                                setTimeout(()=>{inprg.classList.add("inprogress_bar_state_inprogress"); },1);

                                });
                            }

                        });
                    }catch(err){};

                });
            });
*/

        var erow = $(e.target).parent().parent();
//        jQuery.each(erow[0].childNodes, function(j,tds){
                    try{
                        //var lst = tds.childNodes[0].classList;
                        //jQuery.each(tds.childNodes, function(k,ele){
			    var cn = erow[0].childNodes[4].childNodes[0];
			    var inprg = erow[0].childNodes[2].childNodes[0].childNodes[0];
                            //if(inprog.nodeName.toLowerCase() == "div"){
                                //jQuery.each(ele.childNodes, function(l,inprg){
                                if(inprg.classList.contains("inprogress_bar_state_inprogress")){
					return;
				}
                                
                                inprg.className="";
                                inprg.classList.add("progress_inprogress_bar");
                                inprg.classList.add("progress_inprogress_reset");
                                setTimeout(()=>{inprg.innerHTML="";inprg.classList.add("inprogress_bar_state_inprogress"); },10);
				cn.className = '';
				cn.classList.add("ministatusloading");
				cn.childNodes[0].innerHTML = "";

				     $.ajax({
					url: "/cmdquery",
					type: 'GET',
					dataType: 'json',
					data:{"sc_cmd":"BIT", "target": e.target.getAttribute("target_s"), "params":"" },
					success: function (res){
						inprg.className="";
						inprg.classList.add("progress_inprogress_bar");
						if(res.status === 'success' && res.data.state.indexOf("PASS") >= 0){
							cn.childNodes[0].innerHTML = res.data.message+restime();
							cn.className = '';
							cn.classList.add("ministatussuccess");
							cn.classList.add("tooltip");
							setTimeout(()=>{inprg.innerHTML = "Success";inprg.classList.add("inprogress_bar_state_success"); },10);
						}
						else{
                                                        if(res.data.hasOwnProperty('message')){
				    			    cn.childNodes[0].innerHTML = res.data.message.replace("\n","</br>")+restime();
                                                        }else{
				    			    cn.childNodes[0].innerHTML = res.data.replace("\n","</br>")+restime();
							}
							cn.className = '';
							cn.classList.add("ministatusfail");
							cn.classList.add("tooltip");
							setTimeout(()=>{inprg.innerHTML = "Fail";inprg.classList.add("inprogress_bar_state_fail"); },10);
						}
					},
					error: function(){
						cn.childNodes[0].innerHTML = 'Network Issue'+restime();
						cn.className = '';
						cn.classList.add("ministatusfail");
						cn.classList.add("tooltip");
						inprg.className="";
						inprg.classList.add("progress_inprogress_bar");
						setTimeout(()=>{inprg.innerHTML = "Fail";inprg.classList.add("inprogress_bar_state_fail"); },10);
					}
				    });


                               // });
                            //}

                        //});
                    }catch(err){};
                
		
//	});
/*
        var erow = $(e.target).parent().parent().parent().parent().find('tbody').find("tr");
            jQuery.each(erow, function(j,trs){
                var checkSelected = false
                jQuery.each(trs.childNodes, function(k,tds){
                    try{
                        var lst = tds.childNodes[0].classList;
                        jQuery.each(tds.childNodes, function(k,ele){
                            if(ele.nodeName.toLowerCase() == "div"){
                                jQuery.each(ele.childNodes, function(l,inprg){
                                if(inprg.classList.contains("inprogress_bar_state_inprogress")){
					return;
				}
                                inprg.className="";
                                inprg.classList.add("progress_inprogress_bar");
                                inprg.classList.add("progress_inprogress_reset");
                                setTimeout(()=>{inprg.classList.add("inprogress_bar_state_inprogress"); },10);

				     $.ajax({
					url: "/cmdquery",
					type: 'GET',
					dataType: 'json',
					data:{"sc_cmd":"BIT", "target": "Check Clocks", "params":"" },
					success: function (res){
                                inprg.className="";
                                inprg.classList.add("progress_inprogress_bar");
 					if(res.data.state.indexOf("PASS") >= 0)
                                		setTimeout(()=>{inprg.classList.add("inprogress_bar_state_success"); },10);
                                	else
						setTimeout(()=>{inprg.classList.add("inprogress_bar_state_fail"); },10);
					},
					error: function(){
                                inprg.className="";
                                inprg.classList.add("progress_inprogress_bar");
                                setTimeout(()=>{inprg.classList.add("inprogress_bar_state_fail"); },10);
					}
				    });


                                });
                            }

                        });
                    }catch(err){};

                });
            });*/
    });

}
function generateBootModeblock(){
    var block = $("#detectBootModeID");
    var em1 = document.createElement("p");
        em1.classList.add("details_info");
        em1.id = "active_bootmode";
        block.append(em1)
        var es1 = document.createTextNode("Active:");
        em1.appendChild(es1);
    var em = document.createElement("div");
        em.classList.add("details_info");
        block.append(em)
        var es = document.createTextNode("Change:");
        em.appendChild(es);
    var m = document.createElement("select");
    m.id = "bootmodeselctOption";
    jQuery.each(listsjson_bm.listbootmode, function(i,bm){
        var op = document.createElement("option");
        op.setAttribute("value",bm);
        var opes = document.createTextNode(bm.split("\t")[0]);
        op.appendChild(opes);
        m.append(op);
    });
    m.classList.add("dash_bm");
    em.appendChild(m);


    var button = document.createElement("input");
    button.classList.add("buttons");
    button.classList.add("dash_bm");
    button.id="setbootmodebuttonid";
    button.setAttribute("value", "Set");
    button.setAttribute("type", "button");
    em.appendChild(button);
    
    var smload = document.createElement("div");
    smload.id="setbootloaddivid";
    smload.style.display = 'inline-block';
    smload.style.marginLeft = '15px';

    em.appendChild(smload);


    var em4 = document.createElement("p");
        em4.classList.add("details_info");
        em4.id = "reset_bootmode";
        block.append(em4)
        var es4 = document.createTextNode("Reset:");
        em4.appendChild(es4);
    var button4 = document.createElement("input");
    button4.classList.add("buttons");
    button4.classList.add("dash_bm");
    button4.id="resetbootmodebuttonid";
    button4.setAttribute("value", "Reset");
    button4.setAttribute("type", "button");
    em4.appendChild(button4);
    
    var smload4 = document.createElement("div");
    smload4.id="resetbootloaddivid";
    smload4.style.display = 'inline-block';
    smload4.style.marginLeft = '15px';

    em4.appendChild(smload4);

    $('#bootmodeselctOption').change(function (e) {
		document.getElementById("setbootloaddivid").className = "";

    });
    $('#setbootmodebuttonid').click(function (e) {
    document.getElementById("setbootloaddivid").className = "";
    document.getElementById("setbootloaddivid").classList.add("ministatusloading");

     $.ajax({
        url: "/funcreq",
        type: 'GET',
        dataType: 'json',
        data:{"func":"setbootmode", "params": $('#bootmodeselctOption').val().split("\t")[0]},
        success: function (res){

		document.getElementById("setbootloaddivid").className = "";
                if (res.status === 'error'){
		    document.getElementById("setbootloaddivid").classList.add("ministatusfail");
                }else{
		    document.getElementById("setbootloaddivid").classList.add("ministatussuccess");
                }
	},
        error: function(){
		document.getElementById("setbootloaddivid").className = "";
		document.getElementById("setbootloaddivid").classList.add("ministatusfail");
	}
    });
    });

    $('#resetbootmodebuttonid').click(function (e) {
    document.getElementById("resetbootloaddivid").className = "";
    document.getElementById("resetbootloaddivid").classList.add("ministatusloading");

     $.ajax({
            url: "/cmdquery",
            type: 'GET',
            dataType: 'json',
            data:{"sc_cmd":"reset", "target":"", "params":""},
        success: function (res){
		document.getElementById("resetbootloaddivid").className = "";
                if (res.status === 'error'){
		    document.getElementById("resetbootloaddivid").classList.add("ministatusfail");
                }else{
		    document.getElementById("resetbootloaddivid").classList.add("ministatussuccess");
                }
	},
        error: function(){
		document.getElementById("resetbootloaddivid").className = "";
		document.getElementById("resetbootloaddivid").classList.add("ministatusfail");
	}
    });
    });

//    block.append(m);
//    jQuery.each(listsjson_bm.listsbootmode, function(i,bm){
//        var em = document.createElement("p");
//        em.classList.add("details_info");
//        block.append(em)
//        var es = document.createTextNode(bm);
//        em.appendChild(es);
//        var es = document.createTextNode(" : ["+"0011"+"]");
//        em.appendChild(es);
//
//    });

//    $("#detectBootModeID p").click(function(e){
//        console.log(e.target.innerHTML);
//    });
}
function navClick(tid){
    console.log(tid);
    hideAllPages();
    if (tid === "testtheboard") {$("#home_screen_db").removeClass('hide');}
    if (tid === "boardsettings") {$("#boardseettings_screen").removeClass('hide'); $("#ttbbackid").removeClass('hide');}
    if (tid === "boardinterfacetest") {$("#testandebug_screen").removeClass('hide'); $("#ttbbackid").removeClass('hide');}
    if (tid === "demosdesigns") {$("#dnd_screen").removeClass('hide');}
    if (tid === "developusingtools") {$("#tools_screen").removeClass('hide');}
    if (tid === "linuxprompts") {$("#linuxprompt_screen").removeClass('hide');}


}
function layoutDesigns(){
    document.title = app_strings.tab_title;
/*  HOME SCREEN */
//  left pane
    $('#app-title-id').html(app_strings.app_title);
    $('#home_screen_com .app-title').html(app_strings.home_tab.title);

    for(var i = 0; i < app_strings.home_tab.left_pane.length; i++){
        var em1 = document.createElement("div");
        em1.classList.add("block_dashboard");
        var em2 = document.createElement("a");
        em2.classList.add("logo-align");
        em2.classList.add("align-center");
        em2.setAttribute("value", "Reset");
        var em3 = document.createElement("img");
        em3.setAttribute("src", app_strings.home_tab.left_pane[i].image);
        em3.setAttribute("alt", "logo");
        em3.setAttribute("width", "100%");
        em2.append(em3)
        em1.append(em2)
        var em4 = document.createElement("input");
        em4.classList.add("prod_page_btn");
        em4.setAttribute("type", "button");
        em4.setAttribute("linkv", app_strings.home_tab.left_pane[i].button_link);
        em4.setAttribute("value", app_strings.home_tab.left_pane[i].button_title);
        em4.onclick = function (e){ openInNewTab(e.target.attributes.linkv.value);};
        em1.append(em4)
        $("#railcolumn_com").append(em1);
   }
// center pane
   {
        var em1 = document.createElement("div");
        em1.classList.add("image_bg_div");
        var em2 = document.createElement("img");
        em2.classList.add("image_bg");
        em2.setAttribute("src", app_strings.home_tab.center_pane.image);
        em1.append(em2)
        $("#railcolumn_com2").append(em1);
        var em3 = document.createElement("div");
        em3.classList.add("link_dashboard_1");
        var em4 = document.createElement("input");
        em4.classList.add("prod_page_btn");
        em4.setAttribute("type", "button");
        em4.setAttribute("linkv", app_strings.home_tab.center_pane.button_link);
        em4.setAttribute("value", app_strings.home_tab.center_pane.button_title);
        em4.onclick = function (e){ openInNewTab(e.target.attributes.linkv.value);};
        em3.append(em4)
        $("#railcolumn_com2").append(em3);
   }
/*	Help Screen */
   {
        $('#help_screen .app-title').html(app_strings.help_content.title);
        var em3 = document.createElement("div");
        for(var i = 0; i < app_strings.help_content.content.length; i++){
        if (app_strings.help_content.content[i].heading.length){
	        var em5 = document.createElement("p");
        	em5.classList.add("subheadings");
	        em5.textContent = "\n"+app_strings.help_content.content[i].heading + "\n";
        	em3.append(em5)
        }
        if(app_strings.help_content.content[i].content_type == 1){
        var em4 = document.createElement("ul");
        for(var j = 0; j < app_strings.help_content.content[i].content.length; j++){
		var em7 = document.createElement("li");
		em7.classList.add("descontent_2");
		em7.textContent = app_strings.help_content.content[i].content[j];
		em4.append(em7)
                em3.append(em4);
        }}else{
        for(var j = 0; j < app_strings.help_content.content[i].content.length; j++){
		var em5 = document.createElement("p");
		em5.classList.add("descontent");
		em5.textContent = app_strings.help_content.content[i].content[j] + "\n";
		em3.append(em5)
        }
        }
        }
        $("#help_screen").append(em3);
   }
/*	About Screen */
   {
        $('#about_screen .app-title').html(app_strings.about_content.title);
        var em3 = document.createElement("div");
        for(var i = 0; i < app_strings.about_content.content.length; i++){
        if (app_strings.help_content.content[i].heading.length){
	        var em5 = document.createElement("p");
        	em5.classList.add("subheadings");
	        em5.textContent = "\n"+app_strings.help_content.content[i].heading + "\n";
        	em3.append(em5)
        }
        if(app_strings.about_content.content[i].content_type == 1){
        var em4 = document.createElement("ul");
        for(var j = 0; j < app_strings.about_content.content[i].content.length; j++){
		var em7 = document.createElement("li");
		em7.classList.add("descontent_2");
		em7.textContent = app_strings.about_content.content[i].content[j];
		em4.append(em7)
                em3.append(em4);
        }}else{
        for(var j = 0; j < app_strings.about_content.content[i].content.length; j++){
		var em5 = document.createElement("p");
		em5.classList.add("descontent");
		em5.textContent = app_strings.about_content.content[i].content[j] + "\n";
		em3.append(em5)
        }
        }
        }
        $("#about_screen").append(em3);
   }
/*	Test the board */
   {
        $('#home_screen_db .app-title').html(app_strings.test_board.title);
        var em1 = document.createElement("div");
        em1.classList.add("image_bg_div");
        var em2 = document.createElement("img");
        em2.classList.add("image_bg");
        em2.setAttribute("src", app_strings.test_board.center_pane.image);
        em1.append(em2)
        $("#testboard_home").append(em1);
        var em3 = document.createElement("div");
        em3.classList.add("link_dashboard");
        var em5 = document.createElement("p");
        em5.classList.add("link_key");
        em5.textContent = app_strings.test_board.center_pane.text;
        em3.append(em5)
        var em4 = document.createElement("input");
        em4.classList.add("prod_page_btn");
        em4.setAttribute("type", "button");
        em4.setAttribute("linkv", app_strings.test_board.center_pane.button_link);
        em4.setAttribute("value", app_strings.test_board.center_pane.button_title);
        em4.onclick = function (e){ openInNewTab(e.target.attributes.linkv.value);};
        em3.append(em4)
        $("#testboard_home").append(em3);
   }
/*      Obtain Linux Prompts  */
   {
       $('#linuxprompt_screen .app-title').html(app_strings.linuxprompt.title);
        var em7 = document.createElement("span");
        for(var i = 0; i < app_strings.linuxprompt.pane.length; i++){
        var em6 = document.createElement("span");
        //em6.classList.add("");
        var em1 = document.createElement("div");
        em1.classList.add("block_dashboard_lp");
        var em5 = document.createElement("p");
        em5.classList.add("link_key");
        em5.textContent = app_strings.linuxprompt.pane[i].title;
        em1.append(em5)
        var em2 = document.createElement("a");
        em2.classList.add("logo-align");
        em2.classList.add("align-center");
        em2.setAttribute("value", "Reset");
        var em3 = document.createElement("img");
        em3.setAttribute("src", app_strings.linuxprompt.pane[i].image);
        em3.setAttribute("alt", "logo");
        em3.setAttribute("width", "100%");
        em2.append(em3)
        em1.append(em2)

        var em11 = document.createElement("p");
        em11.classList.add("link_key");
        em11.textContent = app_strings.linuxprompt.pane[i].text;
        if (app_strings.linuxprompt.pane[i].text.length) em1.append(em11)

        var em9 = document.createElement("span");
        var em4 = document.createElement("input");
        em4.classList.add("prod_page_btn");
        em4.setAttribute("type", "button");
        em4.setAttribute("linkv", app_strings.linuxprompt.pane[i].button_link);
        em4.setAttribute("value", app_strings.linuxprompt.pane[i].button_title);
        if(app_strings.linuxprompt.pane[i].button_link_type){
            em4.onclick = function (e) {
              window[e.target.attributes.linkv.value]();
            };
        }else{
        em4.onclick = function (e){ openInNewTab(e.target.attributes.linkv.value);};
        }
        if (app_strings.linuxprompt.pane[i].button_link.length && app_strings.linuxprompt.pane[i].button_title.length ) em9.append(em4)
        var em8 = document.createElement("input");
        em8.classList.add("prod_page_btn");
        em8.setAttribute("type", "button");
        em8.setAttribute("linkv", app_strings.linuxprompt.pane[i].learnmore_link);
        em8.setAttribute("value", "Learn More");
        em8.onclick = function (e){ openInNewTab(e.target.attributes.linkv.value);};

        if (app_strings.linuxprompt.pane[i].learnmore_link.length) em9.append(em8);
        em1.append(em9)
        em6.append(em1)
        em7.append(em6)
        }
        $("#linuxprompt_screen").append(em7);

   }
/*	Run demos and designs */
   {
        $('#dnd_screen .app-title').html(app_strings.run_demos.title);
        var em7 = document.createElement("span");
        for(var i = 0; i < app_strings.run_demos.pane.length; i++){
        var em6 = document.createElement("span");
        em6.classList.add("homecolumn_4");
        var em1 = document.createElement("div");
        em1.classList.add("block_dashboard");
        var em5 = document.createElement("p");
        em5.classList.add("link_key");
        em5.textContent = app_strings.run_demos.pane[i].title;
        em1.append(em5)
        var em2 = document.createElement("a");
        em2.classList.add("logo-align");
        em2.classList.add("align-center");
        em2.setAttribute("value", "Reset");
        var em3 = document.createElement("img");
        em3.setAttribute("src", app_strings.run_demos.pane[i].image);
        em3.setAttribute("alt", "logo");
        em3.setAttribute("width", "100%");
        em2.append(em3)
        em1.append(em2)
        var em11 = document.createElement("p");
        em11.classList.add("link_key");
        em11.textContent = app_strings.run_demos.pane[i].text;
        if (app_strings.run_demos.pane[i].text.length) em1.append(em11)

        var em9 = document.createElement("span");
        var em4 = document.createElement("input");
        em4.classList.add("prod_page_btn");
        em4.setAttribute("type", "button");
        em4.setAttribute("linkv", app_strings.run_demos.pane[i].button_link);
        em4.setAttribute("value", app_strings.run_demos.pane[i].button_title);
        if(app_strings.run_demos.pane[i].button_link_type){
            em4.onclick = function (e) {
              window[e.target.attributes.linkv.value]();
            };
        }else{
        em4.onclick = function (e){ openInNewTab(e.target.attributes.linkv.value);};
        }
        if (app_strings.run_demos.pane[i].button_link.length && app_strings.run_demos.pane[i].button_title.length ) em9.append(em4)
        var em8 = document.createElement("input");
        em8.classList.add("prod_page_btn");
        em8.setAttribute("type", "button");
        em8.setAttribute("linkv", app_strings.run_demos.pane[i].learnmore_link);
        em8.setAttribute("value", "Learn More");
        em8.onclick = function (e){ openInNewTab(e.target.attributes.linkv.value);};
        
        if (app_strings.run_demos.pane[i].learnmore_link.length) em9.append(em8);
        em1.append(em9)
        em6.append(em1)
        em7.append(em6)
        }
        $("#dnd_screen").append(em7);
   }
/*	Develop using tools */
   {
        $('#tools_screen .app-title').html(app_strings.develop_tools.title);
        var em0 = document.createElement("span");
        em0.classList.add("toolscolumn1");
        var em1 = document.createElement("div");
        em1.classList.add("image_tools_bg_div");
        var em2 = document.createElement("img");
        em2.classList.add("image_bg");
        em2.setAttribute("src", app_strings.develop_tools.left_pane.image);
        em1.append(em2);
        var em5 = document.createElement("p");
        em5.classList.add("link_key");
        em5.textContent = app_strings.develop_tools.left_pane.text;
        em1.append(em5)
        em0.append(em1);
        $("#tools_screen").append(em0);
        var em7 = document.createElement("span");
        for(var i = 0; i < app_strings.develop_tools.right_pane.length; i++){
        var em6 = document.createElement("span");
        em6.classList.add("homecolumn");
        var em1 = document.createElement("div");
        em1.classList.add("block_dashboard");
        var em2 = document.createElement("a");
        em2.classList.add("logo-align");
        em2.classList.add("align-center");
        em2.setAttribute("value", "Reset");
        var em3 = document.createElement("img");
        em3.setAttribute("src", app_strings.develop_tools.right_pane[i].image);
        em3.setAttribute("alt", "logo");
        em3.setAttribute("width", "100%");
        em2.append(em3)
        em1.append(em2)
        var em4 = document.createElement("input");
        em4.classList.add("prod_page_btn");
        em4.setAttribute("type", "button");
        em4.setAttribute("linkv", app_strings.develop_tools.right_pane[i].button_link);
        em4.setAttribute("value", app_strings.develop_tools.right_pane[i].button_title);
        em4.onclick = function (e){ openInNewTab(e.target.attributes.linkv.value);};
        em1.append(em4)
        em6.append(em1)
        em7.append(em6)
        }
        $("#tools_screen").append(em7);


   } 

}
$(document).ready(function () {
    layoutDesigns();
    generateBoardSettingsTabJSON();
    generateBoardSettingsUI();
    generateBITUI();
    generateBootModeblock();
    $('.app-title:empty').hide();
      $('#top_menu li').click(function (e) {

        $(e.target).addClass('active').siblings().removeClass('active');
            hideAllPages();
            if (e.target.innerHTML == "Home") {$("#home_screen_com").removeClass('hide');} // "home_screen_com"  home_screen_db"
            else if (e.target.innerHTML == "Help") {$("#help_screen").removeClass('hide');}
            else if (e.target.innerHTML == "About") {$("#about_screen").removeClass('hide');}
            else { navClick("testtheboard"); }
      });
      $('#bottom_menu li').click(function (e) {
        $(e.target).addClass('active').siblings().removeClass('active');
            hideAllPages();
            if (e.target.innerHTML == "Demos &amp; Design") { $("#dnd_screen").removeClass('hide');}
            if (e.target.innerHTML == "Board Settings") {$("#boardseettings_screen").removeClass('hide');}
            if (e.target.innerHTML == "Test &amp; Debug") {$("#testandebug_screen").removeClass('hide');}
      });

	setInterval(() => {
            if(!document.hidden && pollresp)
	    if($("#home_screen_db").hasClass("hide") == false){
		    pollresp = false;
	            loadRefreshData();

		}
	},5000);
	filleepromdetails();
	loadRefreshData();

});


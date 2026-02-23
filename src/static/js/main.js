/*
* Copyright (c) 2020 - 2021 Xilinx, Inc. and Contributors. All rights reserved.
* Copyright (c) 2022 - 2026 Advanced Micro Devices, Inc.  All rights reserved.
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
    var ajaxData =  {
        func: "poll",
        params: "" + listsjson_sc.listtemp,
        status: app_strings.hasOwnProperty("versal_usb_boot")&& app_strings.versal_usb_boot.isSupport ? "usbstatus" : ""
    };
    $.ajax({
            url: "/funcreq",
            type: 'GET',
            data:ajaxData,
            dataType: 'json',
            success: function (res){
                var el = document.getElementById("home_board_temp_id");
                var tval = 0;
                tval = res.data.temp > 125 ? 125 : res.data.temp;
                tval = tval < 0 ? 0 : tval;
                if (res.data.temp == 256)
                    tval = '-';
                el.style.setProperty("--temps", tval);
                if(res.data.temp < 70) el.style.setProperty("--showc","green");
                else if(res.data.temp < 90) el.style.setProperty("--showc","orange");
                else el.style.setProperty("--showc","red");
                if(tval == '-'){el.style.setProperty("--showc","gray");}
                if("listtemp" in listsjson_sc){
                    if (res.data.temp == 256){
                        document.getElementById("home_board_temp_id").innerHTML = "- °C";
                    } else{
                        document.getElementById("home_board_temp_id").innerHTML = res.data.temp +" °C";
                    }
                } else {
                document.getElementById("home_board_temp_id").innerHTML = "NA";
		        }
                document.getElementById("active_bootmode").innerHTML = "Active:<b>"+res.data.active_bootmode+"</b>";
                if (app_strings.hasOwnProperty("versal_usb_boot") && app_strings.versal_usb_boot.isSupport){
                    var versalStatusElement = document.getElementById("versalusbstatus");
                    var connectButton = document.getElementById("connectversalbuttonid");
                    var disconnectButton = document.getElementById("disconnectversalbuttonid");
                    if (versalStatusElement && connectButton && disconnectButton) {
                        if (res.data.usbstatus == 0) {
                            versalStatusElement.innerHTML = "Status : <b>Disconnected</b>";
                            connectButton.style.display = "inline-block";
                            disconnectButton.style.display = "none";
                        }
                        else if (res.data.usbstatus == 1){
                            versalStatusElement.innerHTML = "Status : <b>Connected</b>";
                            connectButton.style.display = "none";
                            disconnectButton.style.display = "inline-block";
                        }
                        else{
                            versalStatusElement.innerHTML = "Status : -";
                        }
                    }
                }
 		pollresp = true;
            },
            error: function(){
                console.log("mthod call")
 		pollresp = true;
            }
    });
}
function filleepromdetails(){
    targ = ""
    if("listeeprom" in listsjson_sc && listsjson_sc.listeeprom.length > 0) targ = listsjson_sc.listeeprom[0];
    $.ajax({
            url: "/cmdquery",
            type: 'GET',
            data:{"sc_cmd":"geteeprom", "target":""+targ, "params":"summary"},
            dataType: 'json',
            success: function (res){
                if(res.status == "error" ){
			return;
		}
		var keys = Object.keys(res.data.summary)
		for (var i in keys){
		var em = document.createElement('p');
		em.setAttribute("class","details_info");
		em.innerHTML = keys[i]+" : " + "<b>"+res.data.summary[keys[i]]+"</b>"
		document.getElementById("db_dashboard").appendChild(em);
		}
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
                    window.alert("Not able to launch Jupyter notebook. Please check if Jupyter notebook is running.");
                }
            },
            error: function(){
                    window.alert("Not able to launch Jupyter notebook. Please check if Jupyter notebook is running.");
            }
    });
}
function launchacap(){
    
    openInNewTab(getlocallinkwithport("49995"));

}
function launchpmtool(){
    
    openInNewTab(getlocallinkwithport("5006"));

}
function hideAllPages(){
    $("#home_screen_com, #home_screen_db, #help_screen, #about_screen, #dnd_screen, #boardseettings_screen, #tools_screen, #testandebug_screen, #linuxprompt_screen,#raucupdate_screen,#versalimageupdate_screen,#setmacaddress_screen, #ttbbackid").addClass('hide');
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
                       em.addEventListener("click",cmdBtnonclick);
		       if(heads[elem+"title"]){
                       em.setAttribute("title",heads[elem+"title"]);
                       }
                       if(heads[elem+"spec_id"]){
                       em.setAttribute("tip", heads[elem+"spec_id"]);
                       em.setAttribute("request", "/cmdquery");
                       em.setAttribute("sc_cmd", "listSFP");
                       }	
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
                       if(c[elem+"extraparams"])
                       em.setAttribute("extraparams",c[elem+"extraparams"]);
                       em.addEventListener("click",cmdBtnonclick);
                       if(c[elem+"dontcare"])
                       em.setAttribute("dontcare",c[elem+"dontcare"]);
                       if(c[elem+"disabled"])
                       em.setAttribute("disabled",c[elem+"disabled"]);
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
                    	var em = document.createElement("select");
                        em.setAttribute("reqkey", c[elem]);
                        em.setAttribute("id", 'selectElementId1' );
                        if (c["EXT"]) {
                            em.setAttribute("clock_file_extensions", c["EXT"]);
                        }
                        var defOption = document.createElement("optgroup");
                        defOption.setAttribute("label", "Default");
                        em.appendChild(defOption);
                        var usrOption = document.createElement("optgroup");
                        usrOption.setAttribute("label", "User");
                        em.appendChild(usrOption);
                        tdcomp.appendChild(em)
                    break;
                    case "G":
                        var em = document.createElement("select");
                        em.setAttribute("reqkey", c[elem]);
                        em.setAttribute("id", 'selectElementId0');
                        if (c["EXT"]) {
                            em.setAttribute("clock_file_extensions", c["EXT"]);
                        }
                        var defOption = document.createElement("optgroup");
                        defOption.setAttribute("label", "Default");
                        em.appendChild(defOption);
                        var usrOption = document.createElement("optgroup");
                        usrOption.setAttribute("label", "User");
                        em.appendChild(usrOption);
                        tdcomp.appendChild(em)
		    break;
                    case "D":
                        var em = document.createElement("select");
                        em.setAttribute("reqkey", c[elem]);
                        var closedValue = null;
                        var closedDiff = Infinity;
                        targ = ""
                        if ("listvoltage" in listsjson_sc && listsjson_sc.listvoltage.length > 0) {
                            for (var i = 0; i < listsjson_sc.listvoltage.length; i++) {
                                var voltageValue = listsjson_sc.listvoltage[i];
                                if (voltageValue.includes("FMC") || voltageValue.includes("VCCO_706")) {
                                    targ = voltageValue.split(" - (")[0];
                                }
                            }
                        }
                        else if("listvoltage" in listsjson_raft && listsjson_raft.listvoltage.length > 0) {
                            for (var i = 0; i < listsjson_raft.listvoltage.length; i++) {
                                var voltageValue = listsjson_raft.listvoltage[i];
                                if (voltageValue.includes("FMC") || voltageValue.includes("VCCO_706")) {
                                    targ = voltageValue.split(" - (")[0];
                                }
                            }
                        }
                        var apiCall = isRaftSupported("listvoltage") ? "/raftquery" : (isSupported("listvoltage") ? "/cmdquery" : "");
                        if (c[elem + "F"]) {
                            $.ajax({
                                url: apiCall,
                                type: "GET",
                                data: { "sc_cmd": c[elem + "sc_cmd"], "target": "" + targ, "params": "" },
                                dataType: "json",
                                success: function (res) {
                                    voltage = parseFloat(Object.values(res.data)[0]);
                                    jQuery.each(c[elem + "V"], function (j, n) {
                                        var ddValue = parseFloat(n);
                                        var diff = Math.abs(ddValue - voltage);
                                        if (diff < closedDiff) {
                                            closedDiff = diff;
                                            closedValue = ddValue;
                                        }
                                        var g = document.createElement("option");
                                        g.setAttribute('value', n);
                                        g.innerHTML = "" + n + " " + c[elem + "N"];
                                        em.appendChild(g);
                                    });
                                    jQuery.each(em.options, function (index, option) {
                                        if (parseFloat(option.value) === closedValue) {
                                            option.selected = true;
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            jQuery.each(c[elem + "V"], function (j, n) {
                                var g = document.createElement("option");
                                g.setAttribute('value', n);
                                g.innerHTML = "" + n + " " + c[elem + "N"];
                                em.appendChild(g);
                            });
                        }
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
function hideNavbar() {
    var Nav = document.getElementById("navbar-collapse");
    if (Nav.style.display === "none") {
        Nav.style.display = "block";
    } else {
        Nav.style.display = "none";
    }
}
var pollInterval;
function Banner() {
    if (app_strings.hasOwnProperty('Notification_banner')) {
        if (app_strings.Notification_banner.isSuppot == false) {
            document.getElementById("navSec").style.display = "none";
        }
    }
    else {
        $.ajax({
            url: "/notif",
            type: "GET",
            dataType: "json",
            success: function (res) {
                var Nav = document.getElementById("navSec");
                if (res.data.length == []) {
                    Nav.style.display = "none";
                }
                else {
                    Nav.style.display = "block";
                    var bannerId = document.getElementById("navLink");
                    bannerId.innerHTML = res.data[0].message;
                    if (Object.keys(res.data[0].components).length) {
                        jQuery.each(res.data[0].components.components, function (l, elem) {
                            switch (elem.split("")[0]) {
                                case "B":
                                    var em = document.createElement("input");
                                    em.classList.add("buttons");
                                    em.setAttribute("value", res.data[0].components[elem]);
                                    em.setAttribute("type", "button");
                                    em.onclick = function () {
                                        showLoadingTooltip("bannerpdistatus", bannerId);
                                        $.ajax({
                                            url: res.data[0].components[elem + "A"],
                                            method: "GET",
                                            data: "",
                                            contentType: "application/json",
                                            success: function (res) {
                                                showSuccessTooltip("bannerpdistatus", res.status, bannerId);
                                            },
                                            error: function (res) {
                                                showFailureTooltip("bannerpdistatus", res.status, bannerId);
                                            }
                                        });
                                    }
                                    bannerId.appendChild(em);
                                    break;
                            }
                        });
                    }
                }
            },
            error: function (res) {
                console.log(res)
                stopPolling();
            }
        });
    }
}
function startPolling() {
    pollInterval = setInterval(Banner, 5000);
  }
  function stopPolling() {
    clearInterval(pollInterval);
  }
   document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
      startPolling();
    } else {
      stopPolling();
    }
  });
  startPolling();
function upload_clock_files(funcType) {
    $.ajax({
        url: "/clock_files",
        type: 'GET',
        dataType: 'json',
        data: { "func": funcType },
        success: function (res) {
            if (funcType === "clock"){
                document.querySelectorAll('#selectElementId1 ,#selectElementId0').forEach((em, i) => {
                    while (em.length > 0) em.remove(em.length - 1);
                    // console.log("clock_file_extensions:", em.getAttribute("clock_file_extensions"));
                    var extAttr = em.getAttribute("clock_file_extensions") || "";
                    var allowedExtensions = extAttr
                        .split(',')
                        .map(function (ext) { return ext.trim().toLowerCase(); })
                        .filter(function (ext) { return ext.length > 0; });

                    function isAllowedFile(filename) {
                        if (!allowedExtensions.length) return true;
                        var lowerName = String(filename).toLowerCase();
                        for (var idx = 0; idx < allowedExtensions.length; idx++) {
                            if (lowerName.endsWith(allowedExtensions[idx])) {
                                return true;
                            }
                        }
                        return false;
                    }
                    
                    function stripAllowedExtension(filename) {
                        if (!allowedExtensions.length) return filename;
                        var lowerName = String(filename).toLowerCase();
                        for (var idx = 0; idx < allowedExtensions.length; idx++) {
                            var ext = allowedExtensions[idx];
                            if (lowerName.endsWith(ext)) {
                                return filename.slice(0, filename.length - ext.length);
                            }
                        }
                        return filename;
                    }

                    var seenDefault = {};
                    jQuery.each(res["data"]["default"]["finallist"], function (k, d) {
                        if (!isAllowedFile(d)) return;
                        var displayName = stripAllowedExtension(d);
                        if (seenDefault[displayName]) return;
                        seenDefault[displayName] = true;
                        var g = document.createElement("option");
                        g.setAttribute('value', d);
                        g.innerHTML = displayName;
                        em.children[0].appendChild(g);
                    });

                    var seenUser = {};
                    jQuery.each(res["data"]["user"]["finaluploadlist"], function (k, d) {
                        if (!isAllowedFile(d)) return;
                        var displayName = stripAllowedExtension(d);
                        if (seenUser[displayName]) return;
                        seenUser[displayName] = true;
                        var g = document.createElement("option");
                        g.setAttribute('value', d);
                        g.innerHTML = displayName;
                        em.children[1].appendChild(g);
                    });
                });
            }else if (funcType === "pdi"){
                document.querySelectorAll('#PDIselectionOption1 , #PDIselectionOption2').forEach((em, i) => {
                    while (em.length > 0) em.remove(em.length - 1);
                    jQuery.each(res["data"]["pdi"]["pdi_files"], function (k, d) {
                        var g = document.createElement("option");
                        g.setAttribute('value', d);
                        g.innerHTML = d
                        em.appendChild(g);
                    });
                });
            }else if (funcType === "ospi"){
                document.querySelectorAll('#OSPIselectionOption').forEach((em, i) => {
                    while (em.length > 0) em.remove(em.length - 1);
                    jQuery.each(res["data"]["ospi"]["ospi_files"], function (k, d) {
                        var g = document.createElement("option");
                        g.setAttribute('value', d);
                        g.innerHTML = d
                        em.appendChild(g);
                    });
                });
            }else if (funcType === "rauc"){
                document.querySelectorAll('#RaucSelectionOption').forEach((em, i) => {
                    while (em.length > 0) em.remove(em.length - 1);
                    jQuery.each(res["data"]["rauc"]["rauc_files"], function (k, d) {
                        if (typeof d === 'string' && d.toLowerCase().endsWith('.raucb')) {
                            var g = document.createElement("option");
                            g.setAttribute('value', d);
                            g.innerHTML = d;
                            em.appendChild(g);
                        }
                    });
                    
                });
            }else if (funcType === "versal"){
                document.querySelectorAll('#VersalselectionOption').forEach((em, i) => {
                    while (em.length > 0) em.remove(em.length - 1);
                    jQuery.each(res["data"]["versal"]["versal_files"], function (k, d) {
                        var g = document.createElement("option");
                        g.setAttribute('value', d);
                        g.innerHTML = d
                        em.appendChild(g);
                    });
                });
            }
        },
        error: function (res) {
            console.log(res)
        }
    });
}
function fileUploder(formdata, fileObj, select_id, funcType) {
    if (fileObj.size == 0) {
        alert("Cannot upload an empty file");
         document.querySelectorAll('.ministatusloading').forEach(function (el) {
            el.classList.remove('ministatusloading');
        });
        return Promise.reject(new Error("Empty file"));
    }
    var dupFound = false;
    var sIds = ["selectElementId0", "selectElementId1", "PDIselectionOption1", "PDIselectionOption2", "RaucSelectionOption", "OSPIselectionOption", "VersalselectionOption"]
    jQuery.each(sIds, function (t, l) {

        document.querySelectorAll('#' + l).forEach((em, i) => {
            jQuery.each(em.children, function (a, b) {
                jQuery.each(b.children, function (c, d) {
                    if (d.value == fileObj.name) dupFound = true;
                });
            });
        });
    });
    if (dupFound) {
        alert("File with same name already exists. Please upload file with different name.");
        return Promise.reject(new Error("Duplicate file"));

    }
    return fetch('/uploader?func=' + funcType, {
        method: 'POST', // or 'PUT'
        body: formdata,
    })
        .then(response => {
            if (response.status == 200) {
                console.log('File uploaded successfully.');
                if (["clock", "pdi", "rauc", "ospi", "versal"].includes(funcType)) {
                    upload_clock_files(funcType);
                }
                return "Success";
            } else {
                console.error("Upload failed with status:", response.status);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
function getlogs(){
    $.ajax({
        url:"/scriptrunner",
        method:"GET",
        data:{"cmd":"getlogs"},
        contentType:"application/tar",
        success: function (res){
            var link = document.createElement('a')
            link.href = res.data
            link.click()
        },
        error: function(){
            console.log("fail");
        }
    });
}
function installboardsetup(){
    $('#loader').show();
    $.ajax({
        url:"/installboard",
        method:"GET",
        data:{},
        contentType:"application/json",
        success: function (res){
        $('#loader').hide();
            alert("Message: " + res.data);
        },
        error: function(){
        $('#loader').hide();
            console.log("fail");
        }
    });
}
function createTooltipElement(elementId,parentElement) {
    var existingElement = document.getElementById(elementId);
    if (!existingElement) {
        var smload = document.createElement("div");
        smload.id = elementId;
        smload.style.display = 'inline-block';
        smload.style.marginLeft = '15px';
        
        var tip = document.createElement("a");
        tip.id = elementId + "status";
        tip.classList.add("tooltiptext");
        
        smload.appendChild(tip);
        parentElement.appendChild(smload);
    }
}
function showSuccessTooltip(elementId, message,parentElement) {
    createTooltipElement(elementId, parentElement);
    var tip = document.getElementById(elementId + "status");
    var element = document.getElementById(elementId);
    element.className = "";
    element.classList.add("tooltip", "ministatussuccess");
    element.style.border = "";
    tip.innerHTML = message;
    tip.style.display = "block";
}

function showFailureTooltip(elementId, message, parentElement) {
    createTooltipElement(elementId,parentElement);
    var tip = document.getElementById(elementId + "status");
    var element = document.getElementById(elementId);
    element.className = "";
    element.classList.add("tooltip","ministatusfail");
    element.style.border = "";
    tip.innerHTML = message;
    tip.style.display = "block";
}
function showLoadingTooltip(elementId, parentElement) {
    createTooltipElement(elementId,parentElement);
    var tip = document.getElementById(elementId + "status");
    var element = document.getElementById(elementId);
    element.className = "";
    element.classList.add("tooltip","ministatusloading");
    tip.style.display = "none";
    if (elementId === "bannerpdistatus") {
        element.style.border = "3px dotted black";
    }
}

function exportCSV() {
    var popupmain = document.createElement('div');
    popupmain.className = 'popup-background';
    popupmain.style.display = "block";

    var popup = document.createElement('div');
    popup.setAttribute('id', 'popup');
    popup.className = 'popup-content';
    popup.style.zoom = "normal";

    var popupHeader = document.createElement('div');
    popupHeader.className = 'popup-header';

    var heading = document.createElement('h2');
    heading.style.textAlign = 'center';
    heading.setAttribute('popupid', '1');
    heading.id = 'popupheadingid';
    heading.textContent = 'Export CSV File';
    popupHeader.appendChild(heading);

    var popupMessage = document.createElement('p');
    popupMessage.innerHTML = "Export history of Power, Current and Voltage rails value into CSV file. <br> Please select seconds to capture:";
    popupMessage.style.padding = "10px";
    popupMessage.style.lineHeight = "25px";

    var inputField = document.createElement('input');
    inputField.setAttribute('type', 'number');
    inputField.setAttribute('value', 5);
    inputField.min = 5;
    inputField.max = 30;
    inputField.setAttribute('id', 'file_duration_input');
    inputField.style.width = "10%";
    inputField.style.margin = "0 10px 0 10px";

    var smload = document.createElement("div");
    smload.id = "downloadCSVid";
    smload.style.display = 'inline-block';
    smload.style.marginLeft = '15px';
    var tip = document.createElement("a");
    tip.id = "downloadCSVstatus";
    tip.classList.add("tooltiptext");
    smload.append(tip);

    var exportBtn = document.getElementById("exportCSV");
    var statustip = document.getElementById("loadingtip");
    statustip.append(smload);
    statustip.style.display = "";
    var popupFooter = document.createElement('div');
    popupFooter.classList.add('popup-footer');
    var span = document.createElement('span');

    var closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.classList.add('popupbuttons');
    closeButton.onclick = function () {
        document.body.removeChild(popupmain);
    };
    popupMessage.appendChild(inputField);
    popupMessage.innerHTML += "<br><b>Note:</b>The Power, Voltage, and Current rail values are recorded at selected intervals after clicking the Download button.";
    var downloadbtn = document.createElement('button');
    downloadbtn.textContent = 'Download';
    downloadbtn.style.marginRight = "10px";
    downloadbtn.classList.add('popupbuttons');
    downloadbtn.onclick = function () {
        popup.style.display="none";
        popupmain.style.display = "none";
        smload.style.border = "3px dotted black";
        smload.classList.add("ministatusloading");
        var fileDuration = document.getElementById('file_duration_input').value;
        console.log('Selected duration:', fileDuration);
        exportBtn.disabled = true;
        downloadbtn.disabled = true;
        closeButton.disabled = true;
        statustip.disabled = false;
        $.ajax({
            url: "/exportcsv",
            method: "GET",
            data: { file_duration: fileDuration },
            contentType: "json",
            success: function (res) {
                smload.className = "";
                if (res.status === 'error' || !(res.data && res.data.endsWith(".csv"))) {
                    smload.style.border = "";
                    document.body.removeChild(popupmain);
                    alert("Failed to export CSV File");
                } else {
                    smload.style.border = "";
                    var link = document.createElement('a');
                    link.href = res.data;
                    link.click();
                    document.body.removeChild(popupmain);
                    alert("CSV File exported successfully");
                }
                exportBtn.disabled = false;
                downloadbtn.disabled = false;
                closeButton.disabled = false;
                statustip.style.display = "none";
            },
            error: function () {
                smload.className = "";
                smload.style.border = "";
                console.log("Failed to export CSV.");
                exportBtn.disabled = false;
                downloadbtn.disabled = false;
                closeButton.disabled = false;
                statustip.style.display = "none";
                alert("Failed to export CSV File");
            }

        });
    };


    span.appendChild(closeButton);
    span.appendChild(downloadbtn);
    popupFooter.appendChild(span);
    popupmain.appendChild(popup);
    popup.appendChild(popupHeader);
    popup.appendChild(popupMessage);
    popup.appendChild(popupFooter);

    document.body.appendChild(popupmain);
}
function cmdBtnonclick(e){
    var eles = $(e.target).parent().siblings();
      var order = e.target.getAttribute("components");
      var tar = e.target.getAttribute("request");
        if(e.target.value.includes("All")||e.target.value.includes("Information")){
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
	return true;
        }
        // Read value from html and create api and send to server.
      var setparams = "";
      jQuery.each(eles, function(i, tds){
        var cnd = this.childNodes;
        jQuery.each(cnd, function(k, cn){
        try{
            if(cn.getAttribute("reqKey")){
                if(cn.nodeName.toLowerCase() == "input"){
                    if(e.target.getAttribute("dontcare") && cn.value.length == 0 )
                    setparams += (setparams.length ? "," : "" )+e.target.getAttribute("dontcare");
                    else
                    setparams += (setparams.length ? "," : "" )+cn.value
                }
                else if(cn.nodeName.toLowerCase() == "select"){
                    setparams += (setparams.length ? "," : "" )+cn.value;
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
      var extraparameter = e.target.getAttribute("extraparams")
      if (extraparameter){
        cmdData = {"sc_cmd":e.target.getAttribute("sc_cmd"), "target":e.target.getAttribute("target"), "params":setparams, "extraparams":e.target.getAttribute("extraparams")}
      }
      else{
        cmdData = {"sc_cmd":e.target.getAttribute("sc_cmd"), "target":e.target.getAttribute("target"), "params":setparams}
      }
    $.ajax({
            url: tar,
            type: 'GET',
            dataType: 'json',
            data:cmdData,
            success: function (res){
            if (e.target.getAttribute("sc_cmd").startsWith("list")){
            listsjson_sc.listSFP = res.data;
            jQuery.each(boardsettingsTab, function(i,t){
            if (t.tab == "SFP Data"){
            boardsettingsTab.splice(i,1);
            return false;
            }
            });
            addsfpTab();
            var y=document.getElementById(e.target.getAttribute("tip"));
            if (e.target.getAttribute("tip") == "SFP_Data" && !$("#SFP_Data").hasClass("hide")){
            var bodycomp = rendertabComponentDiv(e.target.getAttribute("tip"), boardsettingsTab[boardsettingsTab.length-1]);
            y.remove();
           bodycomp.classList.remove("hide");
           $("#bsettings_subtabs").append(bodycomp);
           return false;
          }
          return false;
            }
            else{
                  // Set value from API response to html div here
                  jQuery.each(eles, function(i, tds){
                    var cn = this.childNodes[0];
                    try{
                        if(cn.getAttribute("respKey")){
                            if(cn.nodeName.toLowerCase() == "label"){
                                if (res.data[cn.getAttribute("respKey")] != undefined){
                                    if (res.data[cn.getAttribute("respKey")] != "-"){
                                        cn.innerHTML = res.data[cn.getAttribute("respKey")] + " " + cn.getAttribute("notation");
                                     }
                                     else{
                                        cn.innerHTML = "NA";
                                     }
                                }
                            }
                        }
			if(cn.nodeName.toLowerCase() == "div"){
			    if (res.status == "error"){
                                cn.childNodes[0].innerHTML = res.data.message+restime();
                                cn.className = '';
                                cn.classList.add("ministatusfail");
                                cn.classList.add("tooltip");
			    }
 	                    
			    else if (res.status == "partial_success"){
                                cn.childNodes[0].innerHTML = res.data.error+restime();
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
                }
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
}
function rendertabComponentDiv(title, comp){

    var tabcomp = document.createElement("div");
    tabcomp.classList.add("content-body");
    tabcomp.id = title.split(' ').join('_').replace("+","")
    if(comp.subtype == 'tab_plus'){
        var tabdiv = document.createElement("div");
        var navdiv = document.createElement("nav");
        var uldiv = document.createElement("ul");
        uldiv.classList.add("subtabitemlist");

        jQuery.each(comp.components, function(j, c){

	if (c.subtype == 'tab_plus_button') {
		var lidiv = document.createElement("li");
                    var bt = document.createElement("input");
                    var bt1 = document.createElement("button");
                    bt1.setAttribute("type", "list");
                    bt1.classList.add("button");
                    bt1.innerHTML = c.name;
                    bt.innerHTML = c.name;
                    bt.classList.add("Btn");
                    bt.setAttribute("style", "visibility: hidden");
                    bt1.setAttribute("id", "selectFile");
                    bt.setAttribute("type", "file");
                    bt.setAttribute('multiple', 'multiple');
                    if (c["EXT"]) {
                        var rawExtList = Array.isArray(c["EXT"]) ? c["EXT"] : String(c["EXT"]).split(',');
                        var normalizedExt = rawExtList
                            .map(function (ext) {
                                var trimmed = String(ext).trim();
                                if (!trimmed) return "";
                                return trimmed.startsWith('.') ? trimmed : '.' + trimmed;
                            })
                            .filter(function (ext) { return ext.length > 0; })
                            .join(',');
                        if (normalizedExt.length > 0) {
                            bt.setAttribute('accept', normalizedExt);
                        }
                    }
                    bt1.onclick = function () {
                         bt.click();
                         return false;
                    }

                    bt.addEventListener("change", (e) => {
                    var formData = new FormData();
                        var filesCount = e.target.files.length;
                        var uploadedCount = 0;
                        
                        // Show loading state using utility function
                        showLoadingTooltip("uploadFileStatus", lidiv);
                        var uploadTip = document.getElementById("uploadFileStatusstatus");
                        if (uploadTip) {
                            uploadTip.innerHTML = "Uploading " + filesCount + " file(s)...";
                            // uploadTip.style.display = "block";
                        }
                        
                        for (let i = 0; i < e.target.files.length; i++) {
                            formData.append('file', e.target.files[i]);
                            fileUploder(formData, e.target.files[i], e.target.files[i].name.split('.')[1] == 'txt' ? '1' : '0',"clock").then(function(result) {
                                uploadedCount++;
                                if (uploadedCount === filesCount) {
                                    // All files uploaded successfully
                                    showSuccessTooltip("uploadFileStatus", "Success", lidiv);
                                }
                            }).catch(function(error) {
                                showFailureTooltip("uploadFileStatus", "Upload failed", lidiv);
                            });
                        }
                        e.target.value = "";
                    })
		    lidiv.appendChild(bt);
                    lidiv.appendChild(bt1);
                    uldiv.appendChild(lidiv);
		}else{
                var lidiv = document.createElement("li");
                lidiv.classList.add("tab_subitem");
                if(j == 0){
                    lidiv.classList.add("active");
                }
                lidiv.setAttribute('specKey_id',title.split(' ').join('_') + c.name.split(' ').join('_').replace("+",""));
                var node = document.createTextNode(c.name);
                lidiv.appendChild(node);
                uldiv.appendChild(lidiv);
              }
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
		if (c.subtype == 'tab_plus_button') {
                    }
		else{
                var bodycomp = renderComponentDiv(title.split(' ').join('_') + c.name.split(' ').join('_').replace("+",""), c.components, c.headcomponents )
                if(j){
                    bodycomp.classList.add("hide");
                }
                contentDiv.appendChild(bodycomp);

	     }	
            }
        });

  }
    else if (comp.subtype == 'tab') {
          var tabdiv = document.createElement("div");
          var navdiv = document.createElement("nav");
          var uldiv = document.createElement("ul");
          uldiv.classList.add("subtabitemlist");
          jQuery.each(comp.components, function (j, c) {
               var lidiv = document.createElement("li");
               lidiv.classList.add("tab_subitem");
               if (j == 0) {
                    lidiv.classList.add("active");
               }
               lidiv.setAttribute('specKey_id', title.split(' ').join('_') + c.name.split(' ').join('_').replace("+", ""));
               var node = document.createTextNode(c.name);
               lidiv.appendChild(node);
               uldiv.appendChild(lidiv);
          });
          navdiv.appendChild(uldiv);
          tabdiv.appendChild(navdiv);
          tabcomp.appendChild(tabdiv);
          var contentDiv = document.createElement("div");
          jQuery.each(comp.components, function (j, c) {
               if (c.subtype == 'tab') {
                    var ti = title.split(' ').join('_') + c.name.split(' ').join('_').replace("+", "");
                    var b = rendertabComponentDiv(ti, c);
                    if (j) {
                         b.classList.add("hide");
                    }
                    contentDiv.appendChild(b);
               }
               else {
                    var bodycomp = renderComponentDiv(title.split(' ').join('_') + c.name.split(' ').join('_').replace("+", ""), c.components, c.headcomponents)
                    if (j) {
                         bodycomp.classList.add("hide");
                    }
                    contentDiv.appendChild(bodycomp);

               }
          });
    }else {
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
        var targetDiv = $("#" + e.target.getAttribute("specKey_id"));
        $(e.target).addClass('active').siblings().removeClass('active');
        targetDiv.removeClass('hide').siblings().addClass('hide');
        if (e.target.getAttribute("specKey_id") !== "Clock" && e.target.getAttribute("specKey_id") !== "FMC") {
            targetDiv.find('input[value="Get All"]').trigger('click');
            targetDiv.find('input[value="↻ Information"]').trigger('click');
        }
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
}
function displaypopup(title, message, res, e, cn, inprg, count) {
    var Message = res.data.message.split('\n');
    var bitsMessage = Message.filter(function(line) {
        return !line.toLowerCase().includes("image location");
    });
    var updatedBitsMessage = bitsMessage.join('\n');
    var bodycomp = document.createElement("div");
    bodycomp.classList.add("popup-content");

    var headcomp = document.createElement("div");
    headcomp.classList.add("popup-header");
    bodycomp.append(headcomp);
    var heading = document.createElement("h2");
    heading.setAttribute("style", "text-align: center;");
    heading.setAttribute("popupid", "1");
    heading.setAttribute("id", "popupheadingid");
    heading.innerHTML = e.target.getAttribute("target_s");
    headcomp.append(heading);

    var tablecomp = document.createElement("table");
    tablecomp.classList.add("boardsettings_table");

    var tbodycomp = document.createElement("tbody");
    tbodycomp.classList.add("table_body_pop");
    tbodycomp.setAttribute("id", "popuptbody");
    // popup image locations
    var em1 = document.createElement("div");
    em1.classList.add("popup_image_bg_div");

    var mainDiv = document.createElement("div");
    mainDiv.style.width = "100%";
    mainDiv.style.position = "relative";
    mainDiv.style.overflow = "auto";
    mainDiv.style.height = "100%";
    mainDiv.style.scrollbarWidth = "thin";
    mainDiv.style.maxHeight = "100vh";
    mainDiv.style.zoom = "75%";
    mainDiv.setAttribute("id", "mainDiv");

    var image = document.createElement("img");
    image.setAttribute("src", app_strings.test_board.center_pane.image);
    image.style.transformOrigin = "top left";
    image.style.top = "0";
    image.style.left = "0";
    image.style.maxWidth = "none";
    image.style.maxHeight = "none";
    image.setAttribute("id", "popup-img");

    var poup_msg = res.data.message;
    var matches = [...poup_msg.matchAll(/Image location=(\d+),(\d+), size=(\d+),(\d+)/g)];

    var imageValues = [];
    var boxes = [];

    var isZoomedIn = true;
    var zoomButton = document.createElement("input");
    zoomButton.type = "button";
    zoomButton.value = "Zoom In Image";
    zoomButton.classList.add("popupbuttons");

    function zoomImage() {
        if (!image.complete || image.naturalHeight === 0) return;

        var imageActualheight = image.naturalHeight;
        var imageActualwidth = image.naturalWidth;

        if (imageActualwidth > 1300 && imageActualheight > 900) {
            mainDiv.style.zoom = "30%";
            mainDiv.style.maxHeight = "215vh";
            boxes.forEach(function(box) {
                box.style.border = "8px solid yellow";
            });
        }

        var numBoxes = boxes.length;

        if (isZoomedIn) {
            var zoomLevel = 1;
            image.style.transform = "scale(" + zoomLevel + ") translate(0, 0)";
            boxes.forEach(function(box) {
                box.style.transform = "scale(" + zoomLevel + ") translate(0, 0)";
                box.style.left = box.getAttribute("data-x") + "px";
                box.style.top = box.getAttribute("data-y") + "px";
            });
            zoomButton.value = "Zoom In Image";
        } else {
            var min_x = Math.min(...imageValues.map(({x}) => x));
            var max_x = Math.max(...imageValues.map(({x, width}) => x + width));
            var min_y = Math.min(...imageValues.map(({y}) => y));
            var max_y = Math.max(...imageValues.map(({y, height}) => y + height));

            var bounding_width = max_x - min_x;
            var bounding_height = max_y - min_y;

            var zoom_x = mainDiv.clientWidth / bounding_width;
            var zoom_y = mainDiv.clientHeight / bounding_height;
            var zoom = Math.min(zoom_x, zoom_y);

            if (numBoxes === 1) {
                zoom = Math.min(zoom, 3);
            }

            image.style.transform = "scale(" + zoom + ") translate(0,0)";
            boxes.forEach(function(box, i) {
                var x = imageValues[i].x * zoom;
                var y = imageValues[i].y * zoom;
                box.style.transform = "scale(" + zoom + ")";
                box.style.left = x + "px";
                box.style.top = y + "px";
            });

            var scX = min_x * zoom - (mainDiv.clientWidth / 2 - (bounding_width * zoom / 2));
            var scY = min_y * zoom - (mainDiv.clientHeight / 2 - (bounding_height * zoom / 2));
            zoomButton.value = "Zoom Out Image";
            mainDiv.scrollLeft = scX;
            mainDiv.scrollTop = scY;
        }

        isZoomedIn = !isZoomedIn;
    }

    zoomButton.addEventListener("click", zoomImage);

    if (matches.length > 0) {
        tbodycomp.append(em1);

        imageValues = matches.map(function(match) {
            return {
                x: parseInt(match[1]),
                y: parseInt(match[2]),
                width: parseInt(match[3]),
                height: parseInt(match[4])
            };
        });

        image.onload = function() {
            zoomImage();
        };
        mainDiv.appendChild(image);
        imageValues.forEach(function(loc, idx) {
            var box = document.createElement("div");
            box.classList.add("popup-box");
            box.style.width = loc.width + "px";
            box.style.height = loc.height + "px";
            box.style.left = loc.x + "px";
            box.style.top = loc.y + "px";
            box.style.position = "absolute";
            box.style.border = "4px solid yellow";
            box.style.transformOrigin = "top left";
            box.setAttribute("data-x", loc.x);
            box.setAttribute("data-y", loc.y);
            box.setAttribute("data-width", loc.width);
            box.setAttribute("data-height", loc.height);
            mainDiv.appendChild(box);
            boxes.push(box);
        });

        em1.appendChild(zoomButton);
        em1.appendChild(mainDiv);
    }

    var trcomp = document.createElement("tr");
    var tdcomp = document.createElement("td");
    trcomp.appendChild(tdcomp);
    tdcomp.innerHTML = updatedBitsMessage.replaceAll('\n', '<br>');
    tbodycomp.appendChild(trcomp);
    tablecomp.appendChild(tbodycomp);
    bodycomp.appendChild(tablecomp);

    var d = document.createElement("div");
    d.classList.add("popup-footer");
    heading = document.createElement("a");
    heading.setAttribute("id", "popupErrorMsg");
    heading.setAttribute("class", "popuperrormsg");
    var sp = document.createElement("span");

    var em = document.createElement("input");
    if (res.data.message.toLowerCase().indexOf("'ok'") > -1) {
        em.setAttribute("value", "Cancel");
    } else {
        em.setAttribute("value", "Fail");
    }
    em.setAttribute("type", "button");
    em.classList.add("popupbuttons");
    em.onclick = function(ev) {
        ev.target.parentNode.parentNode.parentNode.remove();
        if (document.getElementById("popform").innerHTML.length == 0) {
            document.getElementById("popform").style.display = "none";
        }
        manualtestresult(false, res, e, cn, inprg, count);
    };
    sp.appendChild(em);

    em = document.createElement("input");
    em.setAttribute("type", "button");
    if (res.data.message.toLowerCase().indexOf("'ok'") > -1) {
        em.setAttribute("value", "OK");
    } else {
        em.setAttribute("value", "Pass");
    }
    em.onclick = function(ev) {
        ev.target.parentNode.parentNode.parentNode.remove();
        if (document.getElementById("popform").innerHTML.length == 0) {
            document.getElementById("popform").style.display = "none";
        }
        manualtestresult(true, res, e, cn, inprg, count);
    };
    em.classList.add("popupbuttons");
    sp.appendChild(em);

    if (matches.length > 0) {
        sp.appendChild(zoomButton);
    }

    d.append(sp);
    d.append(heading);
    bodycomp.append(d);

    $("#popform").append(bodycomp);
    var b = document.getElementById("popform");
    b.style.display = "block";
    document.getElementById("apiloadingdiv").style.display = "none";
}

function manualtestresult(result,res, e,cn,inprg,count){
                                        var hasFail = res.data.bitlogs && res.data.bitlogs.includes("FAIL");
                                        
                                        if(result && !hasFail){
                                        if(count != parseInt(e.target.getAttribute("test_type"))){
						manualTest(e,cn,inprg,count+1);
					}else{ 
					inprg.className="";
					inprg.classList.add("progress_inprogress_bar");
					cn.childNodes[0].innerHTML ="Success";
					cn.className = '';
					cn.classList.add("ministatussuccess");
					cn.classList.add("tooltip");
					setTimeout(()=>{inprg.innerHTML = "Success";inprg.classList.add("inprogress_bar_state_success"); },10);
                                        }

                                        }else{
					inprg.className="";
					inprg.classList.add("progress_inprogress_bar");

					cn.childNodes[0].innerHTML = res.data.bitlogs + "\n";
					cn.className = '';
					cn.classList.add("ministatusfail");
					cn.classList.add("tooltip");
					setTimeout(()=>{inprg.innerHTML = "Fail";inprg.classList.add("inprogress_bar_state_fail"); },10);

                                        }
}

function manTestResAnalysis(res,e,cn,inprg,count){
		if(parseInt(e.target.getAttribute("test_type")) > 0){

				if (res.status === 'success') {
					var result = displaypopup(res.data.message+"","",res,e,cn,inprg,count);
				}else{
					inprg.className="";
					inprg.classList.add("progress_inprogress_bar");
                                        var val = res.data;
                                        if(res.data.message !== undefined) val = res.data.message;
					cn.childNodes[0].innerHTML = val+restime();
					cn.className = '';
					cn.classList.add("ministatusfail");
					cn.classList.add("tooltip");
					setTimeout(()=>{inprg.innerHTML = "Fail";inprg.classList.add("inprogress_bar_state_fail"); },10);

				}
                  }
		
}
function manualTest(e,cn,inprg,count){
     $.ajax({
	url: "/cmdquery",
	type: 'GET',
	dataType: 'json',
	data:{"sc_cmd":"BIT", "target": e.target.getAttribute("target_s"), "params":""+count },
	success: function (res){
                if(res) {
			manTestResAnalysis(res,e,cn,inprg,count)
 		}
                if (res.data.bitlogs) {
                    var textbox = $(".textBox")[0];
                    textbox.value += res.data.bitlogs + "\n";
                }
          },
	  error: function(){
		inprg.className="";
		inprg.classList.add("progress_inprogress_bar");
		cn.childNodes[0].innerHTML = 'Network Issue'+restime();
		cn.className = '';
		cn.classList.add("ministatusfail");
		cn.classList.add("tooltip");
		inprg.className="";
		inprg.classList.add("progress_inprogress_bar");
		setTimeout(()=>{inprg.innerHTML = "Fail";inprg.classList.add("inprogress_bar_state_fail"); },10);
       	  } 
         
     });				

}

function restime(){
    return "";//"</br>"+(new Date()).toLocaleTimeString();
}
function generateBITUI() {

       var runall = document.createElement("input");
    runall.setAttribute("type", "button");
    runall.setAttribute("value", "Run All");
    runall.classList.add("buttons_it");
    runall.addEventListener("click", cmdBtnonclick);

    var theadAutomated = document.createElement("thead");
    var trAutomatedLabel = document.createElement("tr");
    var thAutomatedLabel = document.createElement("th");
    thAutomatedLabel.setAttribute("colspan", "6");
    thAutomatedLabel.textContent = "Automated Tests";
    thAutomatedLabel.classList.add("table_body");
    thAutomatedLabel.style.textAlign = "center";
    thAutomatedLabel.style.borderBottom = "none";
    trAutomatedLabel.appendChild(thAutomatedLabel);
    theadAutomated.appendChild(trAutomatedLabel);

    var theadManual = document.createElement("thead");
    var trManualLabel = document.createElement("tr");
    var thManualLabel = document.createElement("th");
    thManualLabel.setAttribute("colspan", "6");
    thManualLabel.textContent = "Interactive Tests";
    thManualLabel.classList.add("table_body");
    thManualLabel.style.textAlign ="center";
    thManualLabel.style.borderBottom = "none";
    trManualLabel.appendChild(thManualLabel);
    theadManual.appendChild(trManualLabel);

    var automatedTbody = document.createElement("tbody");
    automatedTbody.classList.add("table_body");
    var manualTbody = document.createElement("tbody");
    manualTbody.classList.add("table_body");

    var tablecomp = document.createElement("table");
    tablecomp.classList.add("testdebug_table");

    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    headerRow.style.color="white";

    var headers = ["Checkbox", "BITs List", "Info", "Progress", "Run", "Status"];
    headers.forEach((headerText, index) => {
        var th = document.createElement("th");
        if (headerText === "Checkbox") {
            var selectAllCheckbox = document.createElement("input");
            selectAllCheckbox.setAttribute("type", "checkbox");
            selectAllCheckbox.setAttribute("checked",true);
            selectAllCheckbox.classList.add("headcheckbox");
            selectAllCheckbox.addEventListener("change", function() {
                var checkboxes = tablecomp.querySelectorAll("tbody input[type='checkbox']:not([disabled])");
                checkboxes.forEach(checkbox => checkbox.checked = selectAllCheckbox.checked);
            });
            th.appendChild(selectAllCheckbox);
        } else if (headerText === "Run") {
            th.appendChild(runall);
        }  else {
            th.textContent = headerText;
        }
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    jQuery.each(listsjson_bit.listBIT, function(j, c) {
        var trcomp = document.createElement("tr");
        var man_test = 0;
        if (c.includes('- Manual Test')) {
            man_test = c.split(')')[0].split('(')[1];
            c = c.split(' - Manual Test')[0];
        }
        var tdcomp = document.createElement("td");
        var em = document.createElement("input");
        em.setAttribute("type", "checkbox");
        if(man_test){
            em.setAttribute("disabled", true);
        }else{
            em.setAttribute("checked", true);
        }
        tdcomp.appendChild(em);
        trcomp.appendChild(tdcomp);

        tdcomp = document.createElement("td");
        tdcomp.style.width = "15vw";
        em = document.createTextNode(c);
        tdcomp.appendChild(em);
        trcomp.appendChild(tdcomp);

        var info = listsjson_sc.Description;
        tdcomp = document.createElement("td");
        em = document.createElement("div");
        em.classList.add("tooltipinfo");
        em.style.marginTop = "-10px";
        em.style.marginLeft = "10px";
        var es = document.createTextNode("ⓘ");
        var es1 = document.createElement("a");
        es1.classList.add("tooltiptextinfo");
        if (info.length > 0) {
            es1.textContent = info[j];
        }
        em.appendChild(es);
        em.appendChild(es1);
        tdcomp.appendChild(em);
        trcomp.appendChild(tdcomp);

        tdcomp = document.createElement("td");
        tdcomp.style.width = "50vw";
        em = document.createElement("div");
        em.classList.add("progress_back_bar");
        var em2 = document.createElement("div");
        em2.classList.add("progress_inprogress_bar");
        em.appendChild(em2);
        tdcomp.appendChild(em);
        trcomp.appendChild(tdcomp);

        tdcomp = document.createElement("td");
        em = document.createElement("input");
        em.classList.add("buttons_bit");
        em.setAttribute("type", "button");
        em.setAttribute("value", "Run");
        em.setAttribute("request", c["url"]);
        em.setAttribute("target_s", c);
        em.setAttribute("test_type", man_test);
        tdcomp.appendChild(em);
        trcomp.appendChild(tdcomp);

        tdcomp = document.createElement("td");
        em = document.createElement("div");
        var ar = document.createElement("a");
        ar.classList.add("tooltiptext");
        em.appendChild(ar);
        tdcomp.appendChild(em);
        trcomp.appendChild(tdcomp);

        if (man_test) {
            manualTbody.appendChild(trcomp);
        } else {
            automatedTbody.appendChild(trcomp);
        }
    });
    var theadtextbox = document.createElement("thead");
    var trtextboxLabel = document.createElement("tr");
    var thtextboxLabel = document.createElement("th");
    thtextboxLabel.setAttribute("colspan", "6");
    thtextboxLabel.textContent = "BITs Info";
    thtextboxLabel.classList.add("table_body");
    thtextboxLabel.style.textAlign = "center";
    thtextboxLabel.style.borderBottom = "none";
    trtextboxLabel.appendChild(thtextboxLabel);
    theadtextbox.appendChild(trtextboxLabel);

    tablecomp.appendChild(thead);
    tablecomp.appendChild(theadAutomated);
    tablecomp.appendChild(automatedTbody);
    tablecomp.appendChild(theadManual);
    tablecomp.appendChild(manualTbody);
    tablecomp.appendChild(theadtextbox);


    var textbox = document.createElement("textarea");
    textbox.setAttribute("rows","25");
    textbox.classList.add("textBox");
    textbox.readOnly = true;
    textbox.style.resize = 'none';
    textbox.style.overflow = 'auto';

    var buttonGroup = document.createElement("div");
    buttonGroup.classList.add("textboxbuttons");
   // Create the clear button
    var clearButton = document.createElement("input");
    clearButton.setAttribute("type", "button");
    clearButton.classList.add("textbox_buttons");
    clearButton.style.marginRight = "5px";
    clearButton.setAttribute("value", "clear");
    clearButton.addEventListener("click", function() {
        textbox.value = '';
    });
    // Create the copy button
    var copyButton = document.createElement("input");
    copyButton.setAttribute("type", "button");
    copyButton.classList.add("textbox_buttons");
    copyButton.setAttribute("value", "copy");
    copyButton.addEventListener("click", function() {
        textbox.select();
        document.execCommand('copy');
        alert('Text copied to clipboard!');
    });
    buttonGroup.append(clearButton);
    buttonGroup.append(copyButton);
    $("#bit_tab_screen").append(tablecomp);
    $("#bit_tab_screen").append(buttonGroup);
    $("#bit_tab_screen").append(textbox);
    $("#bit_tab_screen").append("<br><br>");


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
			    var cn = erow[0].childNodes[5].childNodes[0];
			    var inprg = erow[0].childNodes[3].childNodes[0].childNodes[0];
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
				if(parseInt(e.target.getAttribute("test_type")) > 0){
					manualTest(e,cn,inprg,1);
				}else{
				     $.ajax({
					url: "/cmdquery",
					type: 'GET',
					dataType: 'json',
					data:{"sc_cmd":"BIT", "target": e.target.getAttribute("target_s"), "params":"" },
					success: function (res){
						inprg.className="";
						inprg.classList.add("progress_inprogress_bar");
						if(e.target.getAttribute("test_type") == "true"){
    
								var result = confirm(res.data.message+"\n\nIf you see above output, press \"Ok\". Otherwise, press \"Cancel\"");
								if (result) {
									cn.childNodes[0].innerHTML = res.data.message+restime();
									cn.className = '';
									cn.classList.add("ministatussuccess");
									cn.classList.add("tooltip");
									setTimeout(()=>{inprg.innerHTML = "Success";inprg.classList.add("inprogress_bar_state_success"); },10);
								}else{

									cn.childNodes[0].innerHTML = res.data.message+restime();
									cn.className = '';
									cn.classList.add("ministatusfail");
									cn.classList.add("tooltip");
									setTimeout(()=>{inprg.innerHTML = "Fail";inprg.classList.add("inprogress_bar_state_fail"); },10);

								}
						}				
						else{		
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
						}
						if (res.data.bitlogs) {
                         			    var textbox = $(".textBox")[0];
			                            textbox.value += res.data.bitlogs + "\n";
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

				}

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
//remove the file from the dropdown
function createRemoveButton(selectElementId, fileType) {
    var removeButton = document.createElement("input");
    removeButton.classList.add("buttons");
    removeButton.classList.add("dash_bm");
    removeButton.style.marginLeft = "10px";
    removeButton.setAttribute("value", "Remove files");
    removeButton.setAttribute("type", "button");
    
    removeButton.addEventListener('click', function() {
        var selectElement = document.getElementById(selectElementId);
        
        if (selectElement.options.length === 0) {
            alert("No files available to remove");
            return;
        }

        // Create popup for file selection with checkboxes
        var popupBackground = document.createElement('div');
        popupBackground.className = 'popup-background';
        popupBackground.style.display = "block";

        var popup = document.createElement('div');
        popup.className = 'popup-content';
        popup.style.zoom = "normal";
        popup.style.maxHeight = "70vh";
        popup.style.overflow = "auto";
        popup.style.width = "50%";

        var popupHeader = document.createElement('div');
        popupHeader.className = 'popup-header';

        var heading = document.createElement('h2');
        heading.style.textAlign = 'center';
        heading.textContent = 'Select Files to Delete (' + fileType.toUpperCase() + ')';
        popupHeader.appendChild(heading);

        var popupMessage = document.createElement('div');
        popupMessage.style.padding = "20px";

        // Select All checkbox
        var selectAllDiv = document.createElement('div');
        selectAllDiv.style.paddingBottom = "10px";

        var selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.id = 'selectAll' + fileType;
        selectAllCheckbox.style.marginRight = "10px";

        var selectAllLabel = document.createElement('label');
        selectAllLabel.setAttribute('for', 'selectAll' + fileType);
        selectAllLabel.textContent = 'Select All';
        selectAllLabel.style.fontWeight = "bold";
        selectAllLabel.style.cursor = "pointer";

        selectAllDiv.appendChild(selectAllCheckbox);
        selectAllDiv.appendChild(selectAllLabel);
        popupMessage.appendChild(selectAllDiv);

        // File list with checkboxes
        var fileListDiv = document.createElement('div');
        fileListDiv.style.maxHeight = "40vh";
        fileListDiv.style.overflow = "auto";
        fileListDiv.style.border = "1px solid #ddd";
        fileListDiv.style.padding = "10px";
        fileListDiv.style.borderRadius = "5px";

        for (var i = 0; i < selectElement.options.length; i++) {
            var fileDiv = document.createElement('div');
            fileDiv.style.marginBottom = "8px";
            fileDiv.style.padding = "8px";
            fileDiv.style.borderRadius = "3px";
            fileDiv.style.backgroundColor = "#f9f9f9";
            fileDiv.style.border = "1px solid #e0e0e0";

            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = selectElement.options[i].value;
            checkbox.className = 'file-checkbox';
            checkbox.id = 'file_' + i + '_' + fileType;
            checkbox.style.marginRight = "10px";

            var label = document.createElement('label');
            label.setAttribute('for', 'file_' + i + '_' + fileType);
            label.style.cursor = "pointer";
            label.style.userSelect = "none";

            var fileicon = document.createElement('span');
            fileicon.innerHTML = '&#128196;';
            fileicon.style.marginRight = "5px";
            fileicon.style.color = "#666";

            label.appendChild(fileicon);
            var fileText = document.createTextNode(selectElement.options[i].value);
            label.appendChild(fileText);

            fileDiv.appendChild(checkbox);
            fileDiv.appendChild(label);
            fileListDiv.appendChild(fileDiv);
        }

        popupMessage.appendChild(fileListDiv);

        // Select All functionality
        function updateSelectAllState() {
            var checkboxes = popup.querySelectorAll('.file-checkbox');
            var checkedCount = popup.querySelectorAll('.file-checkbox:checked').length;
            selectAllCheckbox.checked = checkedCount === checkboxes.length;
            selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
        }

        selectAllCheckbox.addEventListener('change', function() {
            var checkboxes = popup.querySelectorAll('.file-checkbox');
            checkboxes.forEach(function(checkbox) {
                checkbox.checked = selectAllCheckbox.checked;
            });
        });

        // Update select all state when individual checkboxes change
        fileListDiv.addEventListener('change', function(e) {
            if (e.target.className === 'file-checkbox') {
                updateSelectAllState();
            }
        });

        var popupFooter = document.createElement('div');
        popupFooter.className = 'popup-footer';
        
        var buttonContainer = document.createElement('span');

        var cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.className = 'popupbuttons';
        cancelButton.style.cursor = "pointer";
        cancelButton.style.marginRight = "10px";
        cancelButton.onclick = function() {
            document.body.removeChild(popupBackground);
        };

        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Selected';
        deleteButton.style.marginRight = "10px";
        deleteButton.className = 'popupbuttons';
        deleteButton.style.cursor = "pointer";
        deleteButton.onclick = function() {
            var checkedBoxes = popup.querySelectorAll('.file-checkbox:checked');
            
            if (checkedBoxes.length === 0) {
                alert("Please select at least one file to delete");
                return;
            }

            var filesToDelete = [];
            checkedBoxes.forEach(function(checkbox) {
                filesToDelete.push(checkbox.value);
            });

            var confirmMessage = "Are you sure you want to delete the following " + 
                               filesToDelete.length + " file(s)?\n\n" + 
                               filesToDelete.join('\n');

            if (confirm(confirmMessage)) {
                document.body.removeChild(popupBackground);
                deleteSelectedFiles(filesToDelete, fileType, selectElement);
            }
        };

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(deleteButton);
        popupFooter.appendChild(buttonContainer);

        popup.appendChild(popupHeader);
        popup.appendChild(popupMessage);
        popup.appendChild(popupFooter);
        popupBackground.appendChild(popup);

        document.body.appendChild(popupBackground);
    });
    
    return removeButton;
}

function deleteSelectedFiles(filesToDelete, fileType, selectElement) {
    var results = {
        success: [],
        failed: []
    };

    var deletePromises = [];
    var completedRequests = 0;

    function processResults() {
        // Show results
        var resultMessage = "";
        if (results.success.length > 0) {
            resultMessage += "Successfully deleted " + results.success.length + " file(s):\n";
            resultMessage += results.success.join('\n') + "\n\n";
        }
        if (results.failed.length > 0) {
            resultMessage += "Failed to delete " + results.failed.length + " file(s):\n";
            resultMessage += results.failed.join('\n');
        }
        
        alert(resultMessage);
        
        // Refresh file list
        upload_clock_files(fileType);
    }

    // Delete files one by one
    filesToDelete.forEach(function(filename) {
        $.ajax({
            url: "/removefile?func=" + fileType + "&filename=" + encodeURIComponent(filename),
            type: 'DELETE',
            dataType: 'json',
            success: function(res) {
                completedRequests++;
                if (res.status === 'success') {
                    results.success.push(filename);
                    // Remove from dropdown immediately
                    for (var i = 0; i < selectElement.options.length; i++) {
                        if (selectElement.options[i].value === filename) {
                            selectElement.remove(i);
                            break;
                        }
                    }
                } else {
                    results.failed.push(filename + " (" + res.data.error + ")");
                }
                
                // Check if all requests completed
                if (completedRequests === filesToDelete.length) {
                    processResults();
                }
            },
            error: function() {
                completedRequests++;
                results.failed.push(filename + " (Network error)");
                
                // Check if all requests completed
                if (completedRequests === filesToDelete.length) {
                    processResults();
                }
            }
        });
    });
}

function generateRAUCblock() {
    var hideBackground = document.createElement('div');
    hideBackground.className = 'popup-background';
    hideBackground.style.display = "block";

    var mainContainer = document.createElement("div");
    mainContainer.classList.add("rauc_container");

    /* Partition A */
    var containerA = document.createElement("div");
    containerA.classList.add("block_dashboard_1");
    containerA.classList.add("partition");

    var partitionA = document.createElement("h2");
    partitionA.textContent = "Partition A";
    partitionA.style.color = "white";

    var statusA = document.createElement("p");
    statusA.classList.add("details_info");
    statusA.innerHTML = "Status  : <span id='imageA'></span> ";
    statusA.style.color = "white";

    var RunBootStatusA = document.createElement("p");
    RunBootStatusA.classList.add("details_info");
    RunBootStatusA.innerHTML = "Run on next boot :<span id='statusimageA'></span>";
    RunBootStatusA.style.color = "white";

    containerA.appendChild(partitionA);
    containerA.appendChild(statusA);
    containerA.appendChild(RunBootStatusA);

    /* Partition B */
    var containerB = document.createElement("div");
    containerB.classList.add("block_dashboard_1");
    containerB.classList.add("partition");
    var partitionB = document.createElement("h2");
    partitionB.textContent = "Partition B";
    partitionB.style.color = "white";

    var statusB = document.createElement("p");
    statusB.classList.add("details_info");
    statusB.innerHTML = "Status  : <span id='imageB'></span> ";
    statusB.style.color = "white";

    var RunBootStatusB = document.createElement("p");
    RunBootStatusB.classList.add("details_info");
    RunBootStatusB.innerHTML = "Run on next boot :<span id='statusimageB'></span>";
    RunBootStatusB.style.color = "white";

    var bootStatus = document.createElement("p");
    bootStatus.classList.add("bootStatus");
    bootStatus.innerHTML = "Currently Running";
    containerB.appendChild(partitionB);
    containerB.appendChild(statusB);
    containerB.appendChild(RunBootStatusB);

    /* rauc bundle update */
    
    var raucpopupmain = document.createElement('div');
    raucpopupmain.className = 'popup-background';
    raucpopupmain.style.display = "block";

    var popup = document.createElement('div');
    popup.setAttribute('id', 'popup');
    popup.className = 'popup-content';
    popup.style.zoom = "normal";

    var popupHeader = document.createElement('div');
    popupHeader.className = 'popup-header';

    var heading = document.createElement('h2');
    heading.style.textAlign = 'center';
    heading.setAttribute('popupid', '1');
    heading.id = 'popupheadingid';
    heading.textContent = 'Linux File System Status';
    popupHeader.appendChild(heading);

    var popupMessage = document.createElement('p');
    popupMessage.style.padding = "10px";
    popupMessage.style.lineHeight = "25px";
    popupMessage.style.maxHeight = "50vh";
    popupMessage.style.overflow = "auto";

    var popupFooter = document.createElement('div');
    popupFooter.classList.add('popup-footer');
    var span = document.createElement('span');

    var closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.classList.add('popupbuttons');
    closeButton.onclick = function () {
        document.body.removeChild(raucpopupmain);
    };

    span.appendChild(closeButton);
    popupFooter.appendChild(span);
    raucpopupmain.appendChild(popup);
    popup.appendChild(popupHeader);
    popup.appendChild(popupMessage);
    popup.appendChild(popupFooter);

    var raucFlash = document.createElement("p");
    raucFlash.classList.add("details_info");
    var es = document.createTextNode("Browse:");
    raucFlash.appendChild(es);

    var button = document.createElement("input");
    button.classList.add("buttons");
    button.classList.add("dash_bm");
    button.style.width = '53%';
    button.id="uploadrauc";
    button.setAttribute("type", "file");
    button.setAttribute('accept', '.raucb');
    button.addEventListener('change', function(event) {
        document.getElementById("uploadraucloadid").className = "";
        document.getElementById("uploadraucstatus").innerHTML = "";
        var file = event.target.files[0];
        if (file) {
            var formData = new FormData();
            formData.append("file", file);
            document.getElementById("uploadraucloadid").className = "ministatusloading";
            fileUploder(formData, file, "RaucSelectionOption", "rauc").then(() => {
                document.getElementById("uploadraucloadid").className = "ministatussuccess";
                document.getElementById("uploadraucloadid").classList.add("tooltip");
                document.getElementById("uploadraucstatus").innerHTML = "Success";
            }).catch(() => {
                document.getElementById("uploadraucloadid").className = "ministatusfail";
                document.getElementById("uploadraucloadid").classList.add("tooltip");
                document.getElementById("uploadraucstatus").innerHTML = "Upload Failed";
            });
        }
    });
    raucFlash.appendChild(button);    
    // Add loading indicator for file upload
    var smload = document.createElement("div");
    smload.id="uploadraucloadid";
    smload.style.display = 'inline-block';
    smload.style.marginLeft = '15px';
    raucFlash.append(smload);
    var tip = document.createElement("a");
    tip.id="uploadraucstatus";
    tip.classList.add("tooltiptext");
    smload.append(tip);
    
    var es2 = document.createElement("p");
    es2.classList.add("details_info");
    es2.style.marginLeft= "0px";
    es2.textContent = "Update Bundle:";
    es2.style.color = "white";
    raucFlash.append(es2);
    var m = document.createElement("select");
    m.id = "RaucSelectionOption";
    m.classList.add("dash_bm");
    es2.appendChild(m);

    rauc_update_btn = document.createElement("input");
    rauc_update_btn.classList.add("buttons");
    rauc_update_btn.classList.add("dash_bm");
    rauc_update_btn.id="update_rauc";
    rauc_update_btn.setAttribute("value", "Update");
    rauc_update_btn.setAttribute("type", "button");

    es2.appendChild(rauc_update_btn);
    
    $('#RaucSelectionOption').change(function(e){
        document.getElementById("uploadraucloadid").className = "";
        document.getElementById("uploadraucstatus").innerHTML = "";
    });
     rauc_update_btn.onclick = function () {
            $('#loader').show();
            $('#raucupdate_screen').append(hideBackground);
             var uplodedFile = $('#RaucSelectionOption').val().split("\t")[0];
        $.ajax({
                url: "/raucupdate",
                type: "GET",
                dataType: "json",
                data: { "func": "install /data/" + uplodedFile, "target": "", "params": "" },
                success: function (res) {
                    if (res.status == 'success') {
                        popupMessage.innerHTML = res.data.replace(/\n/g, '<br>');
                        popupMessage.innerHTML += "\n\nClick on 'Reboot Device'"; 
                        document.body.appendChild(raucpopupmain);
                        $('#loader').hide();
                        $(hideBackground).remove();
                    } else {
                        popupMessage.innerHTML = res.data.replace(/\n/g, '<br>'); 
                        document.body.appendChild(raucpopupmain);
                        $('#loader').hide();
                        $(hideBackground).remove();
                    }
                },
                error: function () {
                    popupMessage.innerHTML = "Network error";
                    document.body.appendChild(raucpopupmain);
                    $('#loader').hide();
                    $(hideBackground).remove();
                }
            });
    };

    /* Boot update */
    var bootBtn = document.createElement("input");
    bootBtn.classList.add("buttons");
    bootBtn.classList.add("dash_bm");
    bootBtn.setAttribute("value", "Run On Next Boot");
    bootBtn.setAttribute("type", "button");
    bootBtn.style.width = "40%";
    bootBtn.onclick = function () {
        $.ajax({
            url: "/raucupdate",
            type: "GET",
            dataType: "json",
            data: { "func": "status mark-active other", "target": "", "params": "" },
            success: function (res) {
                if (res.data.includes("rootfs.1")) {
                    alert("Partiton is switced to Image B \nClick on 'Reboot Device'");
                }
                else if (res.data.includes("rootfs.0")) {
                    alert("Partiton is switced to Image A \nClick on 'Reboot Device'");
                }
                else {
                    alert(res.data);
                }
            },
            error: function () {
                alert("Network Error");
            }
        });
    };

    $.ajax({
        url: "/raucupdate",
        type: "GET",
        dataType: "json",
        data: { "func": "status", "target": "", "params": "" },
        success: function (res) {
            if (res.data) {
                var result = res.data;
                result = result.replace(/\x1b\[34m/g, '<span style="color: white;font-weight: bold;">');  // Blue text
                result = result.replace(/\x1b\[31m/g, '<span style="color: red;font-weight: bold;">');   // Red text
                result = result.replace(/\x1b\[32m/g, '<span style="color: #16f316 ;font-weight: bold;">'); // Green text
                result = result.replace(/\x1b\[0m/g, '</span>');                        // Reset color

                var lines = result.split('\n');
                var bootedFrom = lines.find(line => line.includes('Activated:'));

                var rootfsB = lines.find(line => line.includes('[rootfs.1]'));
                if (rootfsB) {
                    var rootfsBIndex = lines.indexOf(rootfsB);
                    var statusBLine = lines.slice(rootfsBIndex, rootfsBIndex + 4).find(line => line.includes('boot status:'));
                    var statusB = statusBLine ? statusBLine.split('boot status: ')[1].trim() : '-';
                    document.getElementById("imageB").innerHTML = `${statusB}`;
                }

                var rootfsA = lines.find(line => line.includes('[rootfs.0]'));
                if (rootfsA) {
                    var rootfsAIndex = lines.indexOf(rootfsA);
                    var statusALine = lines.slice(rootfsAIndex, rootfsAIndex + 4).find(line => line.includes('boot status:'));
                    var statusA = statusALine ? statusALine.split('boot status: ')[1].trim() : '-';
                    document.getElementById("imageA").innerHTML = `${statusA}`;
                }
                if (bootedFrom) {
                    var bootedStatus = bootedFrom.split(': ')[1].trim();
                    if (bootedStatus.includes('rootfs.0')) {
                        var RunbootTextA = document.getElementById("statusimageA");
                        RunbootTextA.innerHTML = " yes";
                        RunbootTextA.style.color = "#16f316";
                        var RunbootTextB = document.getElementById("statusimageB");
                        RunbootTextB.innerHTML = " no";
                        RunbootTextB.style.color = "red";
                        containerA.appendChild(bootStatus);
                        containerB.appendChild(raucFlash);
                        containerB.appendChild(bootBtn);
                    } else if (bootedStatus.includes('rootfs.1')) {
                        var RunbootTextA = document.getElementById("statusimageA");
                        RunbootTextA.innerHTML = " no";
                        RunbootTextA.style.color = "red";
                        var RunbootTextB = document.getElementById("statusimageB");
                        RunbootTextB.innerHTML = " yes";
                        RunbootTextB.style.color = "#16f316";
                        containerB.appendChild(bootStatus);
                        containerA.appendChild(raucFlash);
                        containerA.appendChild(bootBtn);
                    }
                    else {
                        document.getElementById("statusimageA").innerHTML = " -";
                        document.getElementById("statusimageB").innerHTML = " -";
                    }
                }
            } else if (res.error) {
                document.getElementById("status-output").textContent = "Error: " + res.error;
            }
        },
        error: function () {
            document.getElementById("status-output").textContent = "Error fetching RAUC status.";
        }
    });

    mainContainer.appendChild(containerA);
    mainContainer.appendChild(containerB);

    /* Reboot the board */
    var rebootBtn = document.createElement("input");
    rebootBtn.classList.add("buttons");
    rebootBtn.classList.add("dash_bm");
    rebootBtn.setAttribute("value", "Reboot Device");
    rebootBtn.setAttribute("type", "button");
    rebootBtn.style.width = "10%";
    rebootBtn.style.textAlign = "center";
    rebootBtn.onclick = function () {
        $.ajax({
            url: "/raucupdate",
            type: "GET",
            dataType: "json",
            data: { "func": "reboot", "target": "", "params": "" },
            success: function (res) {
                if (!res.data.includes("Invalid command")) {
                    alert("Message: Reboot successful please refresh the browser after 10s");
                }
                else {
                    alert("reboot failed");
                }
            },
            error: function () {
                alert("reboot failed");
            }
        });
    };
    // Create and append the remove button
    var removeBundleButton = createRemoveButton("RaucSelectionOption", "rauc");
    removeBundleButton.style.width = "12%";
    removeBundleButton.setAttribute("value", "Remove Bundle Files");

    $("#rauc_update_screen").append(mainContainer);
    $("#rauc_update_screen").append(removeBundleButton);
    $("#rauc_update_screen").append(rebootBtn);
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
  var tip=document.createElement("a");
    tip.id="bootsetstatus";
    tip.classList.add("tooltiptext");
    smload.append(tip);

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
 var resetmode=document.createElement("a");
    resetmode.id="bootresetstatus";
    resetmode.classList.add("tooltiptext");
    smload4.append(resetmode);
    $('#bootmodeselctOption').change(function (e) {
		document.getElementById("setbootloaddivid").className = "";
		document.getElementById("bootsetstatus").innerHTML = "";
    });
    $('#setbootmodebuttonid').click(function (e) {
    document.getElementById("bootsetstatus").innerHTML = "";
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
			document.getElementById("setbootloaddivid").classList.add("tooltip");
			document.getElementById("bootsetstatus").innerHTML = res.data;
		    	document.getElementById("setbootloaddivid").classList.add("ministatusfail");
                }else{
			document.getElementById("setbootloaddivid").classList.add("tooltip");
			document.getElementById("bootsetstatus").innerHTML = "Success";
		   	document.getElementById("setbootloaddivid").classList.add("ministatussuccess");
                }
	},
        error: function(){
			document.getElementById("setbootloaddivid").className = "";
			document.getElementById("setbootloaddivid").classList.add("ministatusfail");
			document.getElementById("setbootloaddivid").classList.add("tooltip");
			document.getElementById("bootsetstatus").innerHTML = "Network Error";
	}
    });
    });

    $('#resetbootmodebuttonid').click(function (e) {
    document.getElementById("bootresetstatus").innerHTML = "";
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
			document.getElementById("resetbootloaddivid").classList.add("tooltip");
			document.getElementById("bootresetstatus").innerHTML = res.data;
			document.getElementById("resetbootloaddivid").classList.add("ministatusfail");
                }else{
			document.getElementById("resetbootloaddivid").classList.add("tooltip");
			document.getElementById("bootresetstatus").innerHTML = "Success";
			document.getElementById("resetbootloaddivid").classList.add("ministatussuccess");
                }
	},
        error: function(){
			document.getElementById("resetbootloaddivid").className = "";
			document.getElementById("resetbootloaddivid").classList.add("ministatusfail");
			document.getElementById("resetbootloaddivid").classList.add("tooltip");
			document.getElementById("bootresetstatus").innerHTML = "Network Error";
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

//Upload PDI section
function generatePDIblock(){
    var block = $("#detectPDI");
    var em1 = document.createElement("div");
    em1.classList.add("details_info");
    block.append(em1)
    var es = document.createTextNode("Browse PDI:");
    em1.appendChild(es);

    var button = document.createElement("input");
    button.classList.add("buttons");
    button.classList.add("dash_bm");
    button.style.width = '55%';
    button.id="uploadpdi";
    button.setAttribute("value", "Browse");
    button.setAttribute("type", "file");
//    button.setAttribute('accept', '.pdi');
    button.addEventListener('change', function(event) {
    var file = event.target.files[0];
    if (file) {
        var formData = new FormData();
        formData.append("file", file);
        fileUploder(formData, file, "PDIselectionOption1", "pdi");
        fileUploder(formData, file, "PDIselectionOption2", "pdi");
    }
});
    em1.appendChild(button);
    // Create and add remove button using the function
    var removeButton = createRemoveButton("PDIselectionOption1", "pdi");
    em1.appendChild(removeButton);
//load PDI section
    var em2 = document.createElement("p");
    em2.classList.add("details_info");
//    em2.style.borderBottom = 'none';
    em2.id="loadpdi";
    block.append(em2);

    var es2 = document.createTextNode(" Load PDI:");
    em2.append(es2);
    var m = document.createElement("select");
    m.id = "PDIselectionOption1";
    m.classList.add("dash_bm");
    em2.appendChild(m);
    var button2 = document.createElement("input");
    button2.classList.add("buttons");
    button2.classList.add("dash_bm");
    button2.id="loadpdibuttonid";
    button2.setAttribute("value", "Load");
    button2.setAttribute("type", "button");
    em2.appendChild(button2);

    var smload1 = document.createElement("div");
    smload1.id="loadpdiloadid";
    smload1.style.display = 'inline-block';
    smload1.style.marginLeft = '15px';
    em2.append(smload1);
    var tip1=document.createElement("a");
    tip1.id="loadpdistatus";
    tip1.classList.add("tooltiptext");
    smload1.append(tip1);
//Set boot PDI section
    var em4 = document.createElement("p");
    em4.classList.add("details_info");
    em4.id="loadpdi";
    block.append(em4);

    var es3 = document.createTextNode(" Set boot PDI:");
    em4.append(es3);
    var m = document.createElement("select");
    m.id = "PDIselectionOption2";
    m.classList.add("dash_bm");
    em4.appendChild(m);
    var button3 = document.createElement("input");
    button3.classList.add("buttons");
    button3.classList.add("dash_bm");
    button3.id="setbootpdibuttonid";
    button3.setAttribute("value", "Load");
    button3.setAttribute("type", "button");
    em4.appendChild(button3);

    var smload2 = document.createElement("div");
    smload2.id="setbootpdiloadid";
    smload2.style.display = 'inline-block';
    smload2.style.marginLeft = '15px';
    em4.append(smload2);
    var tip2=document.createElement("a");
    tip2.id="setbootpdistatus";
    tip2.classList.add("tooltiptext");
    smload2.append(tip2);
//Reset boot PDI section
    var em6 = document.createElement("p");
    em6.classList.add("details_info");
    em6.id="loadpdi";
    block.append(em6);

    var es4 = document.createTextNode(" Reset boot PDI:");
    em6.append(es4);
    var button4 = document.createElement("input");
    button4.classList.add("buttons");
    button4.classList.add("dash_bm");
    button4.id="resetbootpdibuttonid";
    button4.setAttribute("value", "Reset");
    button4.setAttribute("type", "button");
    em6.appendChild(button4);

    var smload3 = document.createElement("div");
    smload3.id="resetbootpdiloadid";
    smload3.style.display = 'inline-block';
    smload3.style.marginLeft = '15px';
    em6.append(smload3);
    var tip3=document.createElement("a");
    tip3.id="resetbootpdistatus";
    tip3.classList.add("tooltiptext");
    smload3.append(tip3);
  
    $('#PDIselectionOption1').change(function(e){
        document.getElementById("loadpdiloadid").className = "";
        document.getElementById("loadpdistatus").innerHTML = "";
    });
    $('#loadpdibuttonid').click(function(e){
        document.getElementById("loadpdistatus").innerHTML = "";
        document.getElementById("loadpdiloadid").className = "";
        document.getElementById("loadpdiloadid").classList.add("ministatusloading");

        $.ajax({
        url: "/cmdquery",
        type: 'GET',
        dataType: 'json',
        data:{"sc_cmd":"loadPDI", "target": $('#PDIselectionOption1').val().split("\t")[0], "params":""},
        success: function (res){
            document.getElementById("loadpdiloadid").className = "";
                if (res.status === 'error'){
			document.getElementById("loadpdiloadid").classList.add("tooltip");
			document.getElementById("loadpdistatus").innerHTML = res.data.message;
		    	document.getElementById("loadpdiloadid").classList.add("ministatusfail");
                }else{
			document.getElementById("loadpdiloadid").classList.add("tooltip");
			document.getElementById("loadpdistatus").innerHTML = "Success";
		   	document.getElementById("loadpdiloadid").classList.add("ministatussuccess");
                }
        },
            error: function(){
                document.getElementById("loadpdiloadid").className = "";
                document.getElementById("loadpdiloadid").classList.add("ministatusfail");
                document.getElementById("loadpdiloadid").classList.add("tooltip");
                document.getElementById("loadpdistatus").innerHTML = "Network Error";
	    }
        });
    });
    $('#PDIselectionOption2').change(function(e){
        document.getElementById("setbootpdiloadid").className = "";
        document.getElementById("setbootpdistatus").innerHTML = "";
    });
    $('#setbootpdibuttonid').click(function(e){
        document.getElementById("setbootpdistatus").innerHTML = "";
        document.getElementById("setbootpdiloadid").className = "";
        document.getElementById("setbootpdiloadid").classList.add("ministatusloading");

        $.ajax({
        url: "/cmdquery",
        type: 'GET',
        dataType: 'json',
        data:{"sc_cmd":"setbootPDI", "target": $('#PDIselectionOption2').val().split("\t")[0], "params":""},
        success: function (res){
            document.getElementById("setbootpdiloadid").className = "";
                if (res.status === 'error'){
			document.getElementById("setbootpdiloadid").classList.add("tooltip");
			document.getElementById("setbootpdistatus").innerHTML = res.data.message;
		    	document.getElementById("setbootpdiloadid").classList.add("ministatusfail");
                }else{
			document.getElementById("setbootpdiloadid").classList.add("tooltip");
			document.getElementById("setbootpdistatus").innerHTML = "Success";
		   	document.getElementById("setbootpdiloadid").classList.add("ministatussuccess");
                }
        },
            error: function(){
                document.getElementById("setbootpdiloadid").className = "";
                document.getElementById("setbootpdiloadid").classList.add("ministatusfail");
                document.getElementById("setbootpdiloadid").classList.add("tooltip");
                document.getElementById("setbootpdistatus").innerHTML = "Network Error";
	    }
        });
    });
    $('#resetbootpdibuttonid').click(function (e) {
    document.getElementById("resetbootpdistatus").innerHTML = "";
    document.getElementById("resetbootpdiloadid").className = "";
    document.getElementById("resetbootpdiloadid").classList.add("ministatusloading");

     $.ajax({
            url: "/cmdquery",
            type: 'GET',
            dataType: 'json',
            data:{"sc_cmd":"resetbootPDI", "target":"", "params":""},
        success: function (res){
		document.getElementById("resetbootpdiloadid").className = "";
                if (res.status === 'error'){
			document.getElementById("resetbootpdiloadid").classList.add("tooltip");
			document.getElementById("resetbootpdistatus").innerHTML = res.data.message;
			document.getElementById("resetbootpdiloadid").classList.add("ministatusfail");
                }else{
			document.getElementById("resetbootpdiloadid").classList.add("tooltip");
			document.getElementById("resetbootpdistatus").innerHTML = "Success";
			document.getElementById("resetbootpdiloadid").classList.add("ministatussuccess");
                }
	},
        error: function(){
			document.getElementById("resetbootpdiloadid").className = "";
			document.getElementById("resetbootpdiloadid").classList.add("ministatusfail");
			document.getElementById("resetbootpdiloadid").classList.add("tooltip");
			document.getElementById("resetbootpdistatus").innerHTML = "Network Error";
	}
    });
    });

}

//Upload OSPI section
function generateOSPIblock(){
    var block = $("#detectOSPI");
    var em1 = document.createElement("div");
    em1.classList.add("details_info");
    block.append(em1)
    var es = document.createTextNode("Browse OSPI:");
    em1.appendChild(es);

    var button = document.createElement("input");
    button.classList.add("buttons");
    button.classList.add("dash_bm");
    button.style.width = '53%';
    button.id="uploadospi";
    button.setAttribute("value", "Browse");
    button.setAttribute("type", "file");
//    button.setAttribute('accept', '.bin');
    button.addEventListener('change', function(event) {
        document.getElementById("uploadospiloadid").className = "";
        document.getElementById("uploadospistatus").innerHTML = "";
        var file = event.target.files[0];
        if (file) {
            var formData = new FormData();
            formData.append("file", file);
            document.getElementById("uploadospiloadid").className = "ministatusloading";
            fileUploder(formData, file, "OSPIselectionOption", "ospi").then(() => {
                document.getElementById("uploadospiloadid").className = "ministatussuccess";
                document.getElementById("uploadospistatus").innerHTML = "Upload Success";
            }).catch(() => {
                document.getElementById("uploadospiloadid").className = "ministatusfail";
                document.getElementById("uploadospistatus").innerHTML = "Upload Failed";
            });
        }
    });
    em1.appendChild(button);
    // Create and add remove button using the function
    var removeButton = createRemoveButton("OSPIselectionOption", "ospi");
    em1.appendChild(removeButton);


    // Add loading indicator for file upload
    var smload2 = document.createElement("div");
    smload2.id="uploadospiloadid";
    smload2.style.display = 'inline-block';
    smload2.style.marginLeft = '15px';
    em1.append(smload2);
    var tip2 = document.createElement("a");
    tip2.id="uploadospistatus";
    tip2.classList.add("tooltiptext");
    smload2.append(tip2);
    //load OSPI section
    var ospipopupmain = document.createElement('div');
    ospipopupmain.className = 'popup-background';
    ospipopupmain.style.display = "block";
    ospipopupmain.setAttribute('id', 'popupmain');

    var popup = document.createElement('div');
    popup.setAttribute('id', 'popup');
    popup.className = 'popup-content';
    popup.style.zoom = "normal";
    popup.style.width = "60%";
    popup.style.maxHeight = "56%";
    popup.style.overflow = "auto";

    var popupHeader = document.createElement('div');
    popupHeader.className = 'popup-header';

    var heading = document.createElement('h2');
    heading.style.textAlign = 'center';
    heading.setAttribute('popupid', '1');
    heading.id = 'popupheadingid';
    heading.textContent = 'OSPI Image Update Status';
    popupHeader.appendChild(heading);

    var popupMessage = document.createElement('p');
    popupMessage.style.padding = "10px";
    popupMessage.style.lineHeight = "25px";
    popupMessage.style.maxHeight = "50vh";
    popupMessage.style.overflow = "auto";

    var popupFooter = document.createElement('div');
    popupFooter.classList.add('popup-footer');

    var closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.classList.add('popupbuttons');
    closeButton.onclick = function () {
        document.body.removeChild(ospipopupmain);
    };
    closeButton.disabled = true;
    popupFooter.appendChild(closeButton);
    ospipopupmain.appendChild(popup);
    popup.appendChild(popupHeader);
    popup.appendChild(popupMessage);
    popup.appendChild(popupFooter);

    var em2 = document.createElement("p");
    em2.classList.add("details_info");
//    em2.style.borderBottom = 'none';
    block.append(em2);

    var es2 = document.createTextNode(" Load OSPI:");
    em2.append(es2);
    var m = document.createElement("select");
    m.id = "OSPIselectionOption";
    m.classList.add("dash_bm");
    em2.appendChild(m);

    var ErrorStatus = "OSPI Flash Failure: The OSPI flash process has encountered an error. Please try the following steps to resolve the issue:\
<br>&emsp;1.Retry the flashing process.\
<br>&emsp;2.If the issue persists, verify the integrity of the OSPI image.\
<br>&emsp;3.Check the board settings for any discrepancies.\
<br>If the problem persists after troubleshooting these steps, consider seeking additional support or consulting the relevant documentation.";
    var pollactive = true;
    var pollInterval;
    function Timer(){
            if (!pollactive) {
                clearInterval(pollInterval);
                return;
            }
            ospiSuccess();
    }
    function ospiSuccess(){
        $.ajax({
            url: "/status",
            type: 'GET',
            dataType: 'json',
            data: { "cmd": "ospiboot" },
            success: function (res) {
                if (!pollactive) { 
                    clearInterval(pollInterval);
                    return;
                }
                var message = res.data.message;
                var table = "<table>";
                for (var key in message) {
                    table += "<tr><td></td><td>" + " " + key + "</td><td style='text-align:center'>" + message[key] + "</td></tr>";
                }
                table += "</table>";
                popupMessage.innerHTML = table;
            },
            error: function () {
                popupMessage.innerHTML = ErrorStatus
            }
        });
    }
    $('#OSPIselectionOption').change(function(e){
    var loadElement = document.getElementById("loadospiloadid");
    var statusElement = document.getElementById("loadospistatus");
    
    if (loadElement) loadElement.className = "";
    if (statusElement) statusElement.innerHTML = "";
    });
    
    var em3 = document.createElement("p");
    em3.classList.add("details_info");
    em3.id="applyospi";
    block.append(em3);
    var checkBox1 = document.createElement("input");
    checkBox1.id="verifyospibuttonid";
    checkBox1.setAttribute("type", "checkbox");
    var label1 = document.createElement("label");
    label1.setAttribute("for", checkBox1.id);
    label1.textContent = "Verify";
    label1.style.margin = "0 20px 0 5px";
    em3.appendChild(checkBox1);
    em3.appendChild(label1);
    
    var checkBox2 = document.createElement("input");
    checkBox2.id="programospibuttonid";
    checkBox2.setAttribute("type", "checkbox");
    checkBox2.setAttribute("name", "Program");
    
    var label2 = document.createElement("label");
    label2.setAttribute("for", checkBox2.id);
    label2.style.margin = "0 20px 0 5px";
    label2.textContent = "Program"; 

    var button3 = document.createElement("input");
    button3.classList.add("buttons");
    button3.classList.add("dash_bm");
    button3.style.margin = "0px";
    button3.id="applyospibuttonid";
    button3.setAttribute("value", "Apply");
    button3.setAttribute("type", "button");
    em3.appendChild(checkBox2);
    em3.appendChild(label2);
    em3.appendChild(button3);
    
    var em4 = document.createElement("p");
    em4.classList.add("details_info");
    em4.id="eraseospi";
    var es = document.createTextNode("Erase OSPI:");
    em4.appendChild(es);
    block.append(em4);
    

    var button4 = document.createElement("input");
    button4.classList.add("buttons");
    button4.classList.add("dash_bm");
    button4.id="eraseospibuttonid";
    button4.setAttribute("value", "Erase");
    button4.setAttribute("type", "button");
    em4.appendChild(button4);

    var applyospiID = document.getElementById("applyospi");

    $('#applyospibuttonid').click(function (e) {
        popupMessage.innerHTML = "<b style='display: flex; justify-content: center; align-items: center;'>Initializing... Please wait</b>";
        closeButton.disabled = true;
        document.body.appendChild(ospipopupmain);
        var verifyChecked = document.getElementById("verifyospibuttonid").checked;
        var programChecked = document.getElementById("programospibuttonid").checked;
        if (!verifyChecked && !programChecked) {
            alert("Please select an option (Verify and/or Program)");
            document.getElementById("popupmain").style.display = "none";
        return;
        }
        var pollInterval = setInterval(Timer, 1000);
        showLoadingTooltip("applyospistatus", applyospiID);
        var ospifile = $('#OSPIselectionOption').val().split("\t")[0];
        var ospidata = {"cmd": "ospiboot","file": " -i /data/OSPI/" + ospifile};
        if (verifyChecked) {
        ospidata.verify = "true";
        }
        if (programChecked) {
            ospidata.program = "true";
        }
        pollactive = true;
        $.ajax({
            url: "/scriptrunner",
            type: 'GET',
            dataType: 'json',
            data: ospidata,
            success: function (res) {
                clearInterval(pollInterval);
                if (res.status === 'error') {
                    pollactive = false;
                    showFailureTooltip("applyospistatus",res.data.message,applyospiID);
                    popupMessage.innerHTML = ErrorStatus;
                    closeButton.disabled = false;
                } else {
                    showSuccessTooltip("applyospistatus", "Success", applyospiID);
                    closeButton.disabled = false;
                    ospiSuccess();
                }
            },
            error: function () {
                pollactive = false;
                clearInterval(pollInterval);
                document.body.appendChild(ospipopupmain);
                showFailureTooltip("applyospistatus", ErrorStatus, applyospiID);
                popupMessage.innerHTML = ErrorStatus;
                closeButton.disabled = false;
            }
        });
    });
    var eraseospiID = document.getElementById("eraseospi");
    $('#eraseospibuttonid').click(function (e) {
        popupMessage.innerHTML = "<b style='display: flex; justify-content: center; align-items: center;'>Erasing OSPI... Please wait</b>";
        closeButton.disabled = true;
        document.body.appendChild(ospipopupmain);

        var pollInterval = setInterval(Timer, 1000);
        showLoadingTooltip("eraseospistatus", eraseospiID);

        var ospidata = {
            "cmd": "ospiboot",
            "erase": "true"
        };

        pollactive = true;
        $.ajax({
            url: "/scriptrunner",
            type: 'GET',
            dataType: 'json',
            data: ospidata,
            success: function (res) {
                clearInterval(pollInterval);
                if (res.status === 'error') {
                    pollactive = false;
                    showFailureTooltip("eraseospistatus",res.data.message,eraseospiID);
                    popupMessage.innerHTML = ErrorStatus;
                    closeButton.disabled = false;
                } else {
                    showSuccessTooltip("eraseospistatus", "Success", eraseospiID);
                    closeButton.disabled = false;
                    ospiSuccess();
                }
            },
            error: function () {
                pollactive = false;
                clearInterval(pollInterval);
                document.body.appendChild(ospipopupmain);
                showFailureTooltip("eraseospistatus", ErrorStatus, eraseospiID);
                popupMessage.innerHTML = ErrorStatus;
                closeButton.disabled = false;
            }
        });
    });
    
    if (!app_strings.hasOwnProperty('OSPI_feature') || !app_strings.OSPI_feature.isSuppot){
        document.getElementById("detectOSPI").remove();
    }
}
function generateUARTblock() {
    if (app_strings.hasOwnProperty('UART_content')) {
        var block = document.getElementById("detectUART");
        block.classList.add("block_dashboard_1");
        var em1 = document.createElement("p");
        em1.classList.add("details_info");
        block.appendChild(em1);

        var title = document.createElement("b");
        title.textContent = app_strings.UART_content.title;
        em1.appendChild(title);

        for (var i = 0; i < app_strings.UART_content.pane.length; i++) {
            var em2 = document.createElement("p");
            em2.classList.add("details_info");
            var es2 = document.createTextNode(app_strings.UART_content.pane[i].title)
            em2.appendChild(es2);
            block.appendChild(em2);
            var button = document.createElement("input");
            button.classList.add("buttons");
            button.classList.add("dash_bm");
            button.setAttribute("type", "button");
            button.setAttribute("value", app_strings.UART_content.pane[i].button_title);
            var link_url = encodeURIComponent(app_strings.UART_content.pane[i].button_link_url);
            var title = encodeURIComponent(app_strings.UART_content.pane[i].button_link_title);
            var command = encodeURIComponent(app_strings.UART_content.pane[i].button_link_command);
            var url = link_url + "?title=" + title + "&command=" + command;
            (function (url) {
                button.onclick = function () {
                    openInNewTab(url);
                };
            })(url);
            em2.appendChild(button);
        }
    }
    else{
        document.getElementById("detectUART").remove();
    }
}
function generateVersalFlashblock() {
    var block = $("#detectVersalFlash");
    var em0 = document.createElement("p");
    em0.classList.add("details_info");
    em0.id = "versalusbstatus";
    block.append(em0)
    var em1 = document.createElement("div");
    em1.classList.add("details_info");
    block.append(em1)
    var es = document.createTextNode("Browse USB Image:");
    em1.appendChild(es);

    var button = document.createElement("input");
    button.classList.add("buttons");
    button.classList.add("dash_bm");
    button.style.width = '60%';
    button.id="uploadVersal";
    button.setAttribute("value", "Browse");
    button.setAttribute("type", "file");
    button.addEventListener("change", function (event) {
      document.getElementById("uploadversalwicid").className = "";
      document.getElementById("uploadversalstatus").innerHTML = "";
      var file = event.target.files[0];
      if (file) {
        var formData = new FormData();
            formData.append("file", file);
            document.getElementById("uploadversalwicid").className = "ministatusloading";
            fileUploder(formData, file, "VersalselectionOption", "versal").then(() => {
                document.getElementById("uploadversalwicid").className = "ministatussuccess";
                document.getElementById("uploadversalstatus").innerHTML = "Upload Success";
            }).catch(() => {
                document.getElementById("uploadversalwicid").className = "ministatusfail";
                document.getElementById("uploadversalstatus").innerHTML = "Upload Failed";
            });
      }
    });
    em1.appendChild(button);
    var smload2 = document.createElement("div");
    smload2.id="uploadversalwicid";
    smload2.style.display = 'inline-block';
    smload2.style.marginLeft = '15px';
    em1.append(smload2);
    var tip2 = document.createElement("a");
    tip2.id="uploadversalstatus";
    tip2.classList.add("tooltiptext");
    smload2.append(tip2);
//Upload Versal wic    
    var em3 = document.createElement("p");
    em3.classList.add("details_info");
//    em3.style.borderBottom = 'none';
    em3.id="loadversal";
    block.append(em3);
    var es2 = document.createTextNode(" USB Image:");
    em3.append(es2);
    var m = document.createElement("select");
    m.id = "VersalselectionOption";
    m.classList.add("dash_bm");
    em3.appendChild(m);    
    var button1 = document.createElement("input");
    button1.classList.add("buttons");
    button1.classList.add("dash_bm");
    button1.id="connectversalbuttonid";
    button1.setAttribute("value", "Connect");
    button1.setAttribute("type", "button");
    em3.appendChild(button1);
    var versalID = document.getElementById("loadversal");
    $('#connectversalbuttonid').click(function (e){
        var versalwic = $('#VersalselectionOption').val().split("\t")[0]
        showLoadingTooltip("versalstatus", versalID);
        $.ajax({
            url: "/scriptrunner",
            type: 'GET',
            dataType: 'json',
            data: { "cmd": "versalUSBconnect", "file": versalwic },
            success: function (res) {
                if (res.status === 'error'){
                     showFailureTooltip("versalstatus", res.data.message, versalID);
                }else{
                    showSuccessTooltip("versalstatus", res.status, versalID);
                }
            },
            error: function (res) {
                showFailureTooltip("versalstatus", res.data.message, versalID);
            }
        });
    });
    
    var button2 = document.createElement("input");
    button2.classList.add("buttons");
    button2.classList.add("dash_bm");
    button2.id="disconnectversalbuttonid";
    button2.setAttribute("value", "Disconnect");
    button2.setAttribute("type", "button");
    em3.appendChild(button2);
    $('#disconnectversalbuttonid').click(function (e){
        // var versalwic = $('#VersalselectionOption').val().split("\t")[0]
        showLoadingTooltip("versalstatus", versalID);
        $.ajax({
            url: "/scriptrunner",
            type: 'GET',
            dataType: 'json',
            data: { "cmd": "versalUSBdisconnect"},
            success: function (res) {
                 if (res.status === 'error'){
                     showFailureTooltip("versalstatus", res.data.message, versalID);
                }else{
                    showSuccessTooltip("versalstatus", res.status, versalID);
                }
            },
            error: function (res) {
                showFailureTooltip("versalstatus", res.data.message, versalID);
            }
        });
    });

    if (!app_strings.hasOwnProperty('versal_usb_boot') || !app_strings.versal_usb_boot.isSupport) {
        document.getElementById("detectVersalFlash").remove();
    }
    
}
//Set mac addresses
function formatEEPROMDisplay(data) {
    var container = document.createElement('div');
    container.style.lineHeight = '1.6';  
    var title = document.createElement('b');
    title.textContent = 'EEPROM DATA:';
    container.appendChild(title);    
    container.appendChild(document.createElement('br'));
    container.appendChild(document.createElement('br'));   
    // Handle Versal MAC addresses
    if (data && data.versalMacs && data.versalMacs.length > 0) {
        if (data.versalMacs.length === 1) {
            // Single Versal MAC
            var versalLabel = document.createElement('b');
            versalLabel.textContent = 'Versal MAC: ';
            container.appendChild(versalLabel);
            
            var versalMacInput = document.createElement('input');
            versalMacInput.type = 'text';
            versalMacInput.id = 'versalMacInput';
            versalMacInput.className = 'versalMacInput';
            versalMacInput.value = data.versalMacs[0];
            versalMacInput.style.marginLeft = '10px';
            versalMacInput.style.padding = '5px';
            versalMacInput.style.border = '1px solid #ccc';
            versalMacInput.style.borderRadius = '3px';
            versalMacInput.style.width = '150px';
            versalMacInput.placeholder = 'xx:xx:xx:xx:xx:xx';
            container.appendChild(versalMacInput);
        } else {
            // Multiple Versal MACs
            for (var i = 0; i < data.versalMacs.length; i++) {
                var versalLabelMulti = document.createElement('b');
                versalLabelMulti.textContent = 'Versal MAC ' + (i + 1) + ': ';
                container.appendChild(versalLabelMulti);
                
                var versalMacInputMulti = document.createElement('input');
                versalMacInputMulti.type = 'text';
                versalMacInputMulti.id = 'versalMacInput' + i;
                versalMacInputMulti.className = 'versalMacInput';
                versalMacInputMulti.value = data.versalMacs[i];
                versalMacInputMulti.style.marginLeft = '10px';
                versalMacInputMulti.style.padding = '5px';
                versalMacInputMulti.style.border = '1px solid #ccc';
                versalMacInputMulti.style.borderRadius = '3px';
                versalMacInputMulti.style.width = '150px';
                versalMacInputMulti.placeholder = 'xx:xx:xx:xx:xx:xx';
                container.appendChild(versalMacInputMulti);
                
                // Add line break after each MAC except the last one
                if (i < data.versalMacs.length - 1) {
                    container.appendChild(document.createElement('br'));
                }
            }
        }
    } else {
        // Show empty Versal MAC field by default
        var versalLabelEmpty = document.createElement('b');
        versalLabelEmpty.textContent = 'Versal MAC: ';
        container.appendChild(versalLabelEmpty);
        
        var versalMacInputEmpty = document.createElement('input');
        versalMacInputEmpty.type = 'text';
        versalMacInputEmpty.id = 'versalMacInput';
        versalMacInputEmpty.className = 'versalMacInput';
        versalMacInputEmpty.value = '';
        versalMacInputEmpty.style.marginLeft = '10px';
        versalMacInputEmpty.style.padding = '5px';
        versalMacInputEmpty.style.border = '1px solid #ccc';
        versalMacInputEmpty.style.borderRadius = '3px';
        versalMacInputEmpty.style.width = '150px';
        versalMacInputEmpty.placeholder = 'xx:xx:xx:xx:xx:xx';
        container.appendChild(versalMacInputEmpty);
    }    
    // Add line breaks before save button
    container.appendChild(document.createElement('br'));
    container.appendChild(document.createElement('br'));    
    // Create Save button
    var saveButton = document.createElement('button');
    saveButton.textContent = 'WRITE EEPROM ';
    saveButton.classList.add("buttons");
    saveButton.classList.add("dash_bm");
    saveButton.onclick = writeEEPROMData;
    container.appendChild(saveButton);
    
    return container;
}
function writeEEPROMData() {
    var versalMacInputs = document.querySelectorAll('.versalMacInput');
    var versalMacs = [];
    var hasEmptyField = false;
    var emptyFields = [];
    versalMacInputs.forEach(function(input, index) {
        var value = input.value.trim();
        if (value) {
            versalMacs.push(value);
        } else {
            hasEmptyField = true;
            if (versalMacInputs.length === 1) {
                emptyFields.push('Versal MAC');
            } else {
                emptyFields.push('Versal MAC ' + (index + 1));
            }
        }
    });
    if (hasEmptyField) {
        alert('Please enter MAC address, do not set empty\n\nEmpty fields: ' + emptyFields.join(', '));
        return;
    }
    if (versalMacs.length === 0) {
        alert('Please enter at least one Versal MAC address');
        return;
    }
    var macPattern = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    for (var i = 0; i < versalMacs.length; i++) {
        if (!macPattern.test(versalMacs[i])) {
            alert('Invalid Versal MAC address format at position ' + (i + 1) + '. Please use format: xx:xx:xx:xx:xx:xx');
            return;
        }
    }
    var requestData = {
        "cmd": "writeeepromdata"
    };
    // Use both array and individual parameter format for compatibility
    versalMacs.forEach(function(mac, index) {
        requestData['versalMacs[' + index + ']'] = mac;
    });    
    // Also send as array format
    if (versalMacs.length > 0) {
        requestData['versalMacs[]'] = versalMacs;
    }
    var saveButton = event.target;
    saveButton.disabled = true;
    showLoadingTooltip("eepromwritestatus", saveButton.parentElement);    
    $.ajax({
        url: "/scriptrunner",
        type: 'GET',
        dataType: 'json',
        data: requestData,
        success: function (res) {
            saveButton.disabled = false;
            if (res.status === 'success') {
                showSuccessTooltip("eepromwritestatus", "EEPROM updated successfully!", saveButton.parentElement);
                alert('EEPROM updated successfully!');
                var existingDetails = document.getElementById("db_dashboard").querySelectorAll('p.details_info');
                existingDetails.forEach(function(element) {
                    element.remove();
                });
                filleepromdetails();
            } else {
                alert('Error updating EEPROM: ' + (res.data.error || res.data.message));
                showFailureTooltip("eepromwritestatus", "Error: " + (res.data.error || res.data.message), saveButton.parentElement);
            }
        },
        error: function (res) {
            saveButton.disabled = false;
            showFailureTooltip("eepromwritestatus", "Network error", saveButton.parentElement);
            alert('Network error occurred while updating EEPROM');
        }
    });
}
function generatesetmacaddressblock() {
    var block = $("#detectEEPROM");
    var em0 = document.createElement("p");
    em0.classList.add("details_info");
    block.append(em0);
    var button = document.createElement("input");
    button.classList.add("buttons");
    button.classList.add("dash_bm");
    button.id="fetchmacadd";
    button.setAttribute("value", "FETCH");
    button.setAttribute("type", "button");
    em0.appendChild(button);
    var em1 = document.createElement("p");
    em1.classList.add("details_info");
    block.append(em1);
    // Show empty fields initially
    var initialDisplay = formatEEPROMDisplay(null);
    em1.appendChild(initialDisplay);
    
    button.onclick = function() {
        showLoadingTooltip("eepromstatus", em0);
        $.ajax({
            url: "/scriptrunner",
            type: 'GET',
            dataType: 'json',
            data: { "cmd": "fetcheepromdata" },
            success: function (res) {
                if (res.status === 'success') {
                    var eepromData = res.data;
                    var formattedOutput = formatEEPROMDisplay(eepromData);
                    em1.innerHTML = '';
                    em1.appendChild(formattedOutput);
                    showSuccessTooltip("eepromstatus", "Success", em0);
                } else {
                    showFailureTooltip("eepromstatus", "Error: " + (res.data.message || res.data.error || "Failed to fetch EEPROM data"), em0);
                }
            },
            error: function (res) {
                showFailureTooltip("eepromstatus", "Error fetching EEPROM data", em0);
            }
        });
    };
}

function navClick(tid){
    console.log(tid);
    if (tid !== "cockpit" && tid !== "pmdashboard") {
        hideAllPages();
    }
    if (tid === "testtheboard") {if(listsjson_sc.listfeature.length == 1 && listsjson_sc.listfeature[0].length == 4){alert("This Feature is not supported.");return;}}
    if (tid === "testtheboard") {$("#home_screen_db").removeClass('hide');}
    if (tid === "boardsettings") {
        $("#boardseettings_screen").removeClass('hide'); 
        $("#ttbbackid").removeClass('hide');
        var activeTab = $('#boardtestdiv li.active');
        if (activeTab.length > 0) {
            var activeTabId = activeTab.attr('specKey_id');
            if (activeTabId) {
                var targetDiv = $("#" + activeTabId);
                if (activeTabId !== "Clock" && activeTabId !== "FMC") {
                    targetDiv.find('input[value="Get All"]').trigger('click');
                    targetDiv.find('input[value="↻ Information"]').trigger('click');
                }
            }
        }
    }
    if (tid === "boardinterfacetest") {$("#testandebug_screen").removeClass('hide'); $("#ttbbackid").removeClass('hide');}
    if (tid === "raucupdate") {$("#raucupdate_screen").removeClass('hide'); $("#ttbbackid").removeClass('hide');}
    if (tid === "versalimageupdate") {$("#versalimageupdate_screen").removeClass('hide'); }
    if (tid === "setmacaddress") {$("#setmacaddress_screen").removeClass('hide'); }

//    if (tid === "demosdesigns") {$("#dnd_screen").removeClass('hide');}
    if (tid === "cockpit") {launchacap()}
    if (tid === "pmdashboard") {launchpmtool()}    
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
        $("#railcolumn_com").append(em1);
	if (app_strings.home_tab.left_pane[i].button_title.length != 0) {
	        $("#railcolumn_com").append(em4);
        }
   }
// center pane
   {
        var em1 = document.createElement("div");
        em1.classList.add("image_bg_div");
        var em2 = document.createElement("img");
        em2.classList.add("image_bg");
        em2.setAttribute("src", app_strings.home_tab.center_pane.image);
        em2.setAttribute("onerror", "this.src='../static/images/placeholder.png'");
        em2.setAttribute("loading", "lazy");
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
        if (app_strings.home_tab.center_pane.button_title != 0){
            em3.append(em4)
        }
	if(app_strings.home_tab.center_pane.button_link.length != 0){
            $("#railcolumn_com2").append(em3);
        }
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
		try{
		em7.innerHTML = app_strings.help_content.content[i].content[j];
		}
		catch(err){
		em7.textContent = app_strings.help_content.content[i].content[j];
		}
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
        if (app_strings.about_content.content[i].heading.length){
	        var em5 = document.createElement("p");
        	em5.classList.add("subheadings");
	        em5.textContent = "\n"+app_strings.about_content.content[i].heading + "\n";
        	em3.append(em5)
        }
        if(app_strings.about_content.content[i].content_type == 1){
        var em4 = document.createElement("ul");
        for(var j = 0; j < app_strings.about_content.content[i].content.length; j++){
		var em7 = document.createElement("li");
		em7.classList.add("descontent_2");
		try{
		em7.innerHTML = app_strings.about_content.content[i].content[j];
		}
		catch(err){
		em7.textContent = app_strings.about_content.content[i].content[j];
		}
		em4.append(em7)
        em3.append(em4);
        }}else{
        for(var j = 0; j < app_strings.about_content.content[i].content.length; j++){
		var em5 = document.createElement("p");
		em5.classList.add("descontent");
		em5.textContent = app_strings.about_content.content[i].content[j] + "\n";
		em3.append(em5);
        }
        }
        }
        $("#about_screen").append(em3);
        var em6 = document.createElement("div");
        em6.style.marginTop = "10px";
        var em8 = document.createElement("p");
        em8.classList.add("subheadings");
        em8.textContent = "\nVersion Information:"
        em6.append(em8);
        var em7 = document.createElement("p");
        em7.classList.add("descontent");
        em7.style.fontFamily = "monospace";
        em7.textContent = version.version_info.join('\n');
        em7.innerHTML+="<br><br>";
        em6.append(em7);
        if (general.boardName.toLowerCase()!="unknown"){
            $("#about_screen").append(em6);
        }
   }
/*	Test the board */
   {
        $('#home_screen_db .app-title').html(app_strings.test_board.title);
        var em1 = document.createElement("div");
        em1.classList.add("image_bg_div");
        var em2 = document.createElement("img");
        em2.classList.add("image_bg");
        em2.setAttribute("src", app_strings.test_board.center_pane.image);
        em2.setAttribute("onerror", "this.src='../static/images/placeholder.png'");
        em2.setAttribute("loading", "lazy");
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
        if(app_strings.test_board.center_pane.button_title.length != 0){
            $("#testboard_home").append(em3);
            $("#testboard_home").append(em4);
 	}
   }
    if(general.boardName.toLowerCase()==="unknown"){
        ["testtheboard", "pmdashboard", "versalimageupdate", "exportCSV"].forEach(id => {
            document.getElementById(id).remove();
        });
    }else{
        document.getElementById("boardsupport").remove();
    }
    if(rauc_support.rauc === "no"){
        document.getElementById("raucupdate").remove();
    }
/*      VERSAL POWER TOOL  */
if(general.boardName.toLowerCase()=="vck190" || general.boardName.toLowerCase()=="vmk180"){
	console.log(general.boardName)
}else{
	document.getElementById("developusingtools").remove();
}   
{
       $('#linuxprompt_screen .app-title').html(app_strings.powertool.title);
        var em7 = document.createElement("span");
        for(var i = 0; i < app_strings.powertool.pane.length; i++){
        var em6 = document.createElement("span");
        var em1 = document.createElement("div");
        em1.classList.add("block_dashboard_lp");
        var em5 = document.createElement("p");
        em5.classList.add("link_key");
        em5.textContent = app_strings.powertool.pane[i].title;
        em1.append(em5)
        var em2 = document.createElement("a");
        em2.classList.add("logo-align");
        em2.classList.add("align-center");
        em2.setAttribute("value", "Reset");
        var em3 = document.createElement("img");
        em3.setAttribute("src", app_strings.powertool.pane[i].image);
        em3.setAttribute("alt", "logo");
        em3.setAttribute("width", "100%");
        em2.append(em3)
        em1.append(em2)

        var em11 = document.createElement("p");
        em11.classList.add("link_key");
        em11.textContent = app_strings.powertool.pane[i].text;
        if (app_strings.powertool.pane[i].text.length) em1.append(em11)

        var em9 = document.createElement("span");
        var em4 = document.createElement("input");
        em4.classList.add("prod_page_btn");
        em4.setAttribute("type", "button");
        em4.setAttribute("linkv", app_strings.powertool.pane[i].button_link);
        em4.setAttribute("value", app_strings.powertool.pane[i].button_title);
        if(app_strings.powertool.pane[i].button_link_type){
            em4.onclick = function (e) {
              window[e.target.attributes.linkv.value]();
            };
        }else{
        em4.onclick = function (e){ openInNewTab(e.target.attributes.linkv.value);};
        }
        if (app_strings.powertool.pane[i].button_link.length && app_strings.powertool.pane[i].button_title.length ) em9.append(em4)
        var em8 = document.createElement("input");
        em8.classList.add("prod_page_btn");
        em8.setAttribute("type", "button");
        em8.setAttribute("linkv", app_strings.powertool.pane[i].learnmore_link);
        em8.setAttribute("value", "LEARN MORE");
        em8.onclick = function (e){ openInNewTab(e.target.attributes.linkv.value);};

        if (app_strings.powertool.pane[i].learnmore_link.length) em9.append(em8);
        em1.append(em9)
        em6.append(em1)
        em7.append(em6)
        }
        $("#linuxprompt_screen").append(em7);

   }
/*	VERSAL COCKPIT */
   {
        $('#dnd_screen .app-title').html(app_strings.cockpit.title);
        var em7 = document.createElement("span");
        for(var i = 0; i < app_strings.cockpit.pane.length; i++){
        var em6 = document.createElement("span");
        var em1 = document.createElement("div");
        em1.classList.add("block_dashboard_lp");
        var em5 = document.createElement("p");
        em5.classList.add("link_key");
        em5.textContent = app_strings.cockpit.pane[i].title;
        em1.append(em5)
        var em2 = document.createElement("a");
        em2.classList.add("logo-align");
        em2.classList.add("align-center");
        em2.setAttribute("value", "Reset");
        var em3 = document.createElement("img");
        em3.setAttribute("src", app_strings.cockpit.pane[i].image);
        em3.setAttribute("alt", "logo");
        em3.setAttribute("width", "100%");
        em2.append(em3)
        em1.append(em2)

        var em11 = document.createElement("p");
        em11.classList.add("link_key");
        em11.textContent = app_strings.cockpit.pane[i].text;
        if (app_strings.cockpit.pane[i].text.length) em1.append(em11)

        var em9 = document.createElement("span");
        var em4 = document.createElement("input");
        em4.classList.add("prod_page_btn");
        em4.setAttribute("type", "button");
        em4.setAttribute("linkv", app_strings.cockpit.pane[i].button_link);
        em4.setAttribute("value", app_strings.cockpit.pane[i].button_title);
        if(app_strings.cockpit.pane[i].button_link_type){
            em4.onclick = function (e) {
              window[e.target.attributes.linkv.value]();
            };
        }else{
        em4.onclick = function (e){ openInNewTab(e.target.attributes.linkv.value);};
        }
        if (app_strings.cockpit.pane[i].button_link.length && app_strings.cockpit.pane[i].button_title.length ) em9.append(em4)
        var em8 = document.createElement("input");
        em8.classList.add("prod_page_btn");
        em8.setAttribute("type", "button");
        em8.setAttribute("linkv", app_strings.cockpit.pane[i].learnmore_link);
        em8.setAttribute("value", "LEARN MORE");
        em8.onclick = function (e){ openInNewTab(e.target.attributes.linkv.value);};

        if (app_strings.cockpit.pane[i].learnmore_link.length) em9.append(em8);
        em1.append(em9)
        em6.append(em1)
        em7.append(em6)
        }
        $("#dnd_screen").append(em7);
   }
/*	DESIGN EAXMPLES */
   {
        $('#tools_screen .app-title').html(app_strings.design_examples.title);
       var em7 = document.createElement("span");
        for(var i = 0; i < app_strings.design_examples.pane.length; i++){
        var em6 = document.createElement("span");
        var em1 = document.createElement("div");
        em1.classList.add("block_dashboard_lp");
        var em5 = document.createElement("p");
        em5.classList.add("link_key");
        em5.textContent = app_strings.design_examples.pane[i].title;
        em6.append(em5)
        var em2 = document.createElement("a");
        em2.classList.add("logo-align");
        em2.classList.add("align-center");
        em2.setAttribute("value", "Reset");
        var em3 = document.createElement("img");
        em3.setAttribute("src", app_strings.design_examples.pane[i].image);
        em3.setAttribute("alt", "logo");
        em3.setAttribute("width", "100%");
        em2.append(em3)
        em1.append(em2)

        var em9 = document.createElement("span");
        var em11 = document.createElement("input");
        em11.classList.add("prod_page_btn_disble");
        em11.setAttribute("type", "button");
        em11.setAttribute("value",app_strings.design_examples.pane[i].text);
        em9.append(em11);
        if (app_strings.design_examples.pane[i].text.length) em1.append(em9)

        var em9 = document.createElement("span");
        var em4 = document.createElement("input");
        em4.classList.add("prod_page_btn");
        em4.setAttribute("type", "button");
        em4.setAttribute("linkv", app_strings.design_examples.pane[i].button_link);
        em4.setAttribute("value", app_strings.design_examples.pane[i].button_title);
        if(app_strings.design_examples.pane[i].button_link_type){
            em4.onclick = function (e) {
              window[e.target.attributes.linkv.value]();
            };
        }else{
        em4.onclick = function (e){ openInNewTab(e.target.attributes.linkv.value);};
        }
        var em8 = document.createElement("input");
        em8.classList.add("prod_page_btn");
        em8.setAttribute("type", "button");
        em8.setAttribute("linkv", app_strings.design_examples.pane[i].learnmore_link);
        em8.setAttribute("value", "LEARN MORE");
        em8.onclick = function (e){ openInNewTab(e.target.attributes.linkv.value);};

        if (app_strings.design_examples.pane[i].learnmore_link.length) em9.append(em8);
        em6.append(em1)
        em6.append(em9)
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
    generateRAUCblock();
    generatePDIblock();
    generateOSPIblock();
    generateUARTblock();
    generateVersalFlashblock();
    generatesetmacaddressblock();
    $('.app-title:empty').hide();
      $('#top_menu li').click(function (e) {

        $(e.target).addClass('active').siblings().removeClass('active');
            hideAllPages();
            if (e.target.innerHTML == "HOME") {$("#home_screen_com").removeClass('hide');} // "home_screen_com"  home_screen_db"
            else if (e.target.innerHTML == "HELP") {$("#help_screen").removeClass('hide');}
            else if (e.target.innerHTML == "ABOUT") {$("#about_screen").removeClass('hide');}
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
	    if($("#home_screen_db").hasClass("hide") == false || $("#versalimageupdate_screen").hasClass("hide") == false){
		    pollresp = false;
	            loadRefreshData();

		}
	},5000);
	filleepromdetails();
	Banner();
	loadRefreshData();
	upload_clock_files("pdi");
	upload_clock_files("clock");
	upload_clock_files("rauc");
	upload_clock_files("ospi");
	upload_clock_files("versal");
        if(!listsjson_sc.listfeature.includes("listBIT")){
        	$("#boardinterfacetest").remove();
    	}

});

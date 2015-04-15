/*
 * smartConfig.js
 *
 * smartConfig Java Script file
 *
 * Copyright (C) {YEAR} Texas Instruments Incorporated - http://www.ti.com/ 
 * ALL RIGHTS RESERVED 
 *                                                                                                                                                                                                                                                                     
*/
function onReady()
{
	function setWidth() // Adjust width according to table width
	{
		var tableWidth = $("table")[0].offsetWidth;
		$(".main_panel").css("max-width", (tableWidth + 10) + "px");
	}
	
	function setColumnClass() // Set left/right column classes
	{
		$("td").each( // For each td
			function(index, element)
			{
				if (index % 2 == 0) // left col
				{
					$(element).addClass("left_column");
				}
				else // right col
				{
					$(element).addClass("right_column");
				}
				
			}
		);
		
	}
	
	function setControls() // Set interactive controls
	{
		function clickHandler() // On click handler for button
		{						
			switch (currentState) // alternate between two states
			{
				case operatingStates.Idle:	// If currently idle				
					currentState = operatingStates.Working; // Set to working
					$(this)
						.button('option', 'label', 'Working...') // Change caption
						.removeClass("start_button") // Remove blue color
						.addClass("working_button"); // Set red color
						
						var ssid = $("#SSID").val();
						var gatewayIpAddress = $("#gatewayIpAddress").val();
						var password = $("#password").val();
						var encryptionKey = $("#key").val();
						var ackString = $("#ackString").val();
						
						applet.startTransmitting(networkInterface, ssid, gatewayIpAddress, password, encryptionKey, ackString);
					break;
					
				case operatingStates.Working:	// If currently busy
					currentState = operatingStates.Idle;
					$(this)
						.button('option', 'label', 'Start')  // Change caption
						.removeClass("working_button") // Remove red color
						.addClass("start_button");// Set blue color
						
						applet.stopTransmitting();
					break;							
					
			}
		}
	
		var operatingStates = {Idle:0, Working: 1}; // Enum for operating states
		var currentState = operatingStates.Idle;  // Initial state
		
		$("#workingButton") 
		.button() // Set as jQuery ui button
		.click(clickHandler) // Assign click handler
		.addClass("start_button"); // Add initial state (idle) class
		$("body").append($("<applet archive='smartConfig.jar' code='SmartConfig.class' width=1 height=1></applet>"));
	}
	
	setColumnClass(); // Apply column classes
	setWidth(); // Adjust panel width
	setControls(); // Set interactive controls.
}

function onSmartConfigConnect(param)
{
	switch(param)
	{
		case "FTC_SUCCESS":
			displayAlertDialog("Successful connection", "Your device is now connected to the network.",  MessageTypes.OK_MSG);
			break;
			
		case "FTC_ERROR":
			displayAlertDialog("Unknown error", "An unknown error has occured.",  MessageTypes.ERROR_MSG);
			break;
			
		case "FTC_TIMEOUT":
			displayAlertDialog("Connection timeout", "The smart config app has timed out.",  MessageTypes.ERROR_MSG);
			break;
	}
	
	console.log(param);
		$("button")
			.button('option', 'label', 'Start')  // Change caption
			.removeClass("working_button") // Remove red color
			.addClass("start_button");// Set blue color
			
	
}

function onAppletLoad()
{
	applet = document.applets[0];
	var browser = window.navigator.appName

	
	
	if (!((browser== "Microsoft Internet Explorer")||(browser == "Netscape")))
	{
		displayAlertDialog("Warning","Recommend to use Internet explorer, Chrome or Firefox", MessageTypes.ERROR_MSG);
	}
	
	networkInterface = applet.getNetworkParameter("interfaceName", "");
	
	if (networkInterface == "")
	{		
		displayAlertDialog("Wireless interface not detected", "SmartConfig was unable to trace your wireless network connection, Please insert your wireless parameters manually", MessageTypes.ERROR_MSG);
		return;
	}	
	var ssid = applet.getNetworkParameter("SSID", networkInterface);
	var gatewayIpAddress = applet.getNetworkParameter("gateway", networkInterface);
	var mtu = parseInt(applet.getNetworkParameter("MTU", networkInterface));
	var is5GHz = eval (applet.getNetworkParameter("5GHz", networkInterface));
	
	$("#SSID").val(ssid);	
	$("#gatewayIpAddress").val(gatewayIpAddress);
	
	if (mtu < 1500)
	{
		displayAlertDialog("Problematic MTU", "MTU is too small. Please increase MTU for \"" + networkInterface + "\" to at least 1500 bytes", MessageTypes.ERROR_MSG);
		return;
	}
	
	if (is5GHz)
	{
		displayAlertDialog("Problematic Band", "Currently, smart config supports only 2.4GHz networks",  MessageTypes.ERROR_MSG);
		return;
	}
}

var applet, networkInterface;


$(document).ready(onReady);
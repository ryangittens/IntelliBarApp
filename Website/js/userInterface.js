/*
 * userInterface.js
 *
 * user Interface settings.
 *
 * Copyright (C) {YEAR} Texas Instruments Incorporated - http://www.ti.com/ 
 * ALL RIGHTS RESERVED 
 *                                                                                                                                                                                                                                                                     
*/

var MessageTypes = {
		ERROR_MSG:1,
		OK_MSG:2,
		QUESTION_MSG:3,
		HIGH_IMPORTANCE_QUESTION_MSG:4,
		TRASH_MSG:5,
		NO_MSG:6,
		WORK_IN_PROGRESS:7,
		ACCESS_FORBIDDEN: 8
};

/**
* @const
* @type {String} */ 
var STR_CANCEL = "Cancel";


/**
* @const
* @type {String} */ 
var STR_OK = "OK";

function messageTypeToDialogClass(messageType)
{
	var className = "";
	switch (messageType)
	{
		case MessageTypes.ERROR_MSG:
			className = "alert";
			break;

		default:
			className = "";
	}
	return className;
}

function messageTypeToClassName(messageType)
{
	var className = "";
	switch (messageType)
	{
		case MessageTypes.ERROR_MSG:
		case MessageTypes.HIGH_IMPORTANCE_QUESTION_MSG:
			className = "ui-icon ui-icon-alert ui-icon-alert-box";
			break;

		case MessageTypes.OK_MSG:
			className = "ui-icon ui-icon-check ui-icon-alert-box";
			break;

		case MessageTypes.QUESTION_MSG:
			className = "ui-icon ui-icon-help ui-icon-alert-box";
			break;

		case MessageTypes.TRASH_MSG:
			className = "ui-icon ui-icon-trash ui-icon-alert-box";
			break;

		case MessageTypes.WORK_IN_PROGRESS:
			className = "custom_icon work-in-progress-icon";
			break;

		case MessageTypes.ACCESS_FORBIDDEN:
			className = "ui-icon ui-icon-circle-minus";
			break;

		default:
			console.log("Unknown message_type: " + messageType);
	}
	return className;
}

function displayAlertDialog(title, text_contents, messageType, on_ok, onResize, dialogId)
{
	var table = document.createElement("table");
	var row = table.insertRow(0);

	var div;

	if (on_ok == undefined)
	{
		on_ok = function(){};
	}

	if (messageType && messageType != MessageTypes.NO_MSG)
	{
		div = document.createElement("div");
		div.className = messageTypeToClassName(messageType);
		row.insertCell(0).appendChild(div);
	}

	div = document.createElement("div");
	div.innerHTML = text_contents;
	div.className = 'message_box_contents';
	row.insertCell(1).appendChild(div);
	if (dialogId == undefined)
	{
		dialogId = "alert_dialog";
	}
	var $dialog = $("#" + dialogId);
	if ($dialog.size() == 0)
	{
		$dialog = $("<div class='ui-content' data-overlay-theme='a' id='" + dialogId + "'></div>").css("z-index", 2);
		$("body").append($dialog);
	}

	$dialog.empty();

	var buttons = [
		{
			id: "alert_dialog-ok",
			text: STR_OK,
			click: function() {on_ok(); $( this ).dialog( "close" );}
		}
	];

	
	$dialog.append(table);
	// open jquery ui dialog
	$dialog.dialog({
		"autoOpen": true,
		"title": title,
		"modal": true,
		"dialogClass": messageTypeToDialogClass(messageType),
		"buttons":buttons,
		"resizeStop": onResize ? onResize : function(){},
		"width": 500,
		"close": function() {}
	});

};

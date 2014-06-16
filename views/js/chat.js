$( main );

var MySessionID = '999';

var AWAY_MSG = new Array(
	"I am away now...",
	"has fall asleep...",
	"is idling...",
	"êQÇ‹Ç∑ÅBÅBÅB",
	"ì≠Ç´Ç‹Ç∑ÅBÅB",
	"ãxÇ›Ç‹Ç∑ÅBÅB",
	"an allied hero has fallen...",
	"work work...",
	"need more minerals..."
);

var IsNeedReconnect = false;
var focusHandle = 0;
var blurHandle = 0;
var WebMsgType = {
	AUTH : "auth",
	CHAT : "chat",
	WCHAT: "wchat",
	WHISPER: "whisper",
	STATUS: "status"
};

var WebMsg = function (sessionid, type, data) {
	this.SessionID = sessionid;
	this.Name = '';
	this.Type = type;
	this.Data = data;
};

var connection = 0;

// Define Dom elements
var dom = {
    chatArea: "chatarea",
	chatSend: "chatsend",
	chatinput: "chatinput",
	chatUsers: "chatusers",
    get: function( szID ){
        return $('#'+szID);
    }
};


function main(){
    console.log( "Chat initialize");

	$(document).ready( function() {
		initConnection();
	
		// bind events
		var chatSend = dom.get( dom.chatSend );
		chatSend.click(function() {
			DoChat();
		});
		
		
		dom.get(dom.chatinput).keypress(function(e) {
			var code = e.keyCode || e.which;
			if(code == 13) { // 'Enter' keycode
				console.log( "Handler for .keypress() called." );
				DoChat();
			}
		});
		
		$(document).keypress(function(e) {
			var code = e.keyCode || e.which;
			if(code == 9) { // 'Tab' keycode
				dom.get(dom.chatinput).focus();
			}
		});
		
		if (Notification.permission != 'denied') {	
			$('#show_button').show();
			$('#show_button').click(function(e) {
				Notification.requestPermission();			
			});				
		}
		else {
			$('#show_button').hide();
		}
	
		
		$(window).focus(function() {	
			clearTimeout(blurHandle);
			
			var packet = MakePacket(MySessionID,WebMsgType.STATUS, 'online');
			SendMessage(packet);			
		});
	
		$(window).blur(function() {	
			clearTimeout(focusHandle);
			
			var packet = MakePacket(MySessionID,WebMsgType.STATUS, 'away');
			SendMessage(packet);
			
			//var ranid = Math.floor(Math.random() * AWAY_MSG.length);
			//blurHandle = setTimeout(function(){
			//	console.log('You are Away');
			//	var packet = MakePacket(MySessionID,WebMsgType.STATUS, 'away');
			//	SendMessage(packet);
			//},60000);				
		});				
		
		
		$('#channel-tab a').click(function (e) {
			e.preventDefault()
			$(this).tab('show')
			console.log("tabbing");
		});
		
		var first = $('#select-user li').index(0);
		console.log(first);
		
	});
	// Set up Web Socket
}

function initConnection()
{
	connection = new WebSocket('ws://localhost:8080')
	// When the connection is open, send some data to the server
	connection.onopen = function () {
	  //connection.send('Ping'); // Send the message 'Ping' to the server
	  
	  var packet = MakePacket(MySessionID,WebMsgType.AUTH,"");
	  SendMessage(packet);
	  
	  console.log("Connection Open");
	  addRowToTable('chatarea', 'Connected to Server');
	  IsNeedReconnect = false;
	  refreshChatScroll();
	};

	// Log errors
	connection.onerror = function (error) {
	  console.log('WebSocket Error ' + error);
	};

	// Log messages from the server
	connection.onmessage = function (ws) {
		var jsonPacket = ws.data;
		//console.log(jsonPacket);
		try {
			var packet = $.parseJSON( jsonPacket );
			
			if (packet.Type == 'chat') {
				addRowToTable('chatarea', packet.Data)
				
				refreshChatScroll();

				if ( !document.hasFocus() && packet.Name != MyUserName)
				{
					if (packet.Data.indexOf('has join the party') = -1) {
						drawNotification(packet.Name, packet.Data);
					}
				}
			}
			if (packet.Type == 'whisper') {
				row = addRowToTable('chatarea', packet.Name + " Whispers >> " + packet.Data.Msg);
				var text = row.children().css( 'color', '#FFFFFF' );
				
				row.mouseover(function (e) {
					console.log('is over');
					$(this).children().css( 'color', 'orange');
				});
				row.mouseout(function (e) {
					console.log('is out');
					$(this).children().css( 'color', '#FFFFFF');
				});
				
				row.click(function (e) {
					console.log('revealed');
					var $row = $(this);
					$row.children().css('color', 'green');
					$row.unbind('mouseover');
					$row.unbind('mouseout');
				});
				
				refreshChatScroll();
				
				
				if ( !document.hasFocus() && packet.Name != MyUserName)
				{
					drawNotification(packet.Name, 'Send you a secret whisper, hover/click to uncover the secret');
				}				
				
				
			}			
			else if (packet.Type == 'users')
			{
				var userlist = packet.Data;
				
				var chatUsers = dom.get( dom.chatUsers );
				var chatMode = $('#select-user');
				chatUsers.empty();
				chatMode.empty();
				
				addChatMode('Global');
				
				for (var i in userlist) {
					row = addRowToTable('chatusers', userlist[i]);
					row.removeClass();
					row.toggleClass('warning');
					
					addChatMode(userlist[i]);
				}
				
				// rebind chat listeners after changing elements
				bindChatModeListener();
		
			}
			else if (packet.Type == 'status') {
				console.log('setting status for ' + packet.Name);
				var userTr = $( "#chatusers tr:contains('" + packet.Name + "')" );
				if (packet.Data == 'away') {
					userTr.removeClass();
					userTr.toggleClass('warning');
				}
				else if (packet.Data == 'online') {
					userTr.removeClass();
					userTr.toggleClass('success');
				}
			}
			else if (packet.Type == 'history') {
				
				try {
					console.log("History Packet is HERE");
					console.log(packet.Data);
					var split_lines = packet.Data;
					var len = split_lines.length;
					for ( var index in split_lines) {
						var pckData = $.parseJSON( split_lines[index] );
						
						console.log(pckData);
						
						row = addRowToTable('chatarea', pckData.Data);
						var text = row.children().css( "color", "#D0D0D0" );
						
						refreshChatScroll();
					}

				} catch (e) {
					console.log("Error Parsing History json");
				}
				
			
			}
			
		} catch(e) {
			console.log("Malform Json");
		}

		

	};
	
	connection.onerror = function(ws)
	{
		var chatArea = $('#chattable');
		var chatUsers = dom.get( dom.chatUsers );
		//chatArea.empty();
		chatUsers.empty();
		
		addRowToTable('chatarea', 'Connection to Server Error');
		
		IsNeedReconnect = true;
		
		connection.close();
		//Reconnect();
		
		console.log("Connection Error");
		
	}
	
	connection.onclose = function(ws)
	{
		var chatArea = $('#chatarea');
		var chatUsers = dom.get( dom.chatUsers );
		//chatArea.empty();
		chatUsers.empty();
		
		addRowToTable('chatarea', 'Connection to Server Closed Unexpectedly');
		
		IsNeedReconnect = true;
		
		connection.close();
		Reconnect();
		
		console.log("Connection Closed");
	}
	
}

function Reconnect() {
	setTimeout(function(){
		console.log("Reconnecting");
		location.reload(true);
		initConnection();
		
	},5000);
}

function DoChat()
{
	var chatinput = dom.get( dom.chatinput );
	
	var szMode = $('#select-curr').text();
	console.log(typeof(szMode));
	console.log(szMode);
	
	if (chatinput.val().length > 0) {
		var packet = 0;
		if (szMode === 'Global') {
			packet = MakePacket(MySessionID,WebMsgType.CHAT,chatinput.val());
		}
		else {
			var payload = {
				'ToPlayer': szMode,
				'Msg' : chatinput.val()
			};
			packet = MakePacket(MySessionID,WebMsgType.WHISPER, payload);
			
			row = addRowToTable('chatarea', "You Whisper to " + szMode + " >> " + chatinput.val());
			
			var text = row.children().css( "color", "green" );
			
			if ( $('#id_privacy:checked').val() == 'privacy' ){
				row.fadeOut(1000);
			}
			
			refreshChatScroll();
		}
		
		SendMessage(packet);
		chatinput.val('');	
	}	
}

function bindChatModeListener()
{
	$('#select-user li a').click(function(e) {
		var $curr = $(this);
		console.log($curr.text());
		$('#select-user li.active').removeClass('active');
		var $li = $curr.parent();
		$li.addClass('active');
		
		$('#select-curr').text($curr.text());
		
		e.preventDefault();
	});			
}

function addChatMode(szName)
{
	//if (szName != MyUserName) 
	{
		var chatMode = $('#select-user');
		var li = $('<li>');
		var a = $('<a>');
		//a.attr('href', '');
		a.text(szName);
		li.append(a);
		chatMode.append(li);	
	}
}

function SendMessage(szMsg)
{
	connection.send(szMsg);
}

function MakePacket(sessionid, Type, data)
{	
	var packet = new WebMsg(sessionid,Type, data);
	return JSON.stringify(packet);
}


function addRowToTable()
{
	var szDomName = arguments[0];

	var table = $('#'+szDomName);
	var tableRow = $('<tr>');
	
	//console.log("Arguments: " + arguments[1]);
	for (var i = 1; i < arguments.length; i++) {
		var col = $('<td>');
		col.append( arguments[i] );
		tableRow.append( col );
	}

	table.append( tableRow );
	
	return tableRow;
}

function drawNotification(name, msg)
{
	if (Notification.checkPermission() == 0)
	{	
		notification_test = Notification.createNotification(
		  'res/kt80x80.jpg', name + " Says, ", msg);
		notification_test.ondisplay = function() { 
			setTimeout( notification_test.cancel.bind( notification_test ), 3000 ); // automatically dismisses the notification after 3s
			console.log("onDisplay");
		};
		notification_test.onclose = function() { console.log("onClose"); };
		notification_test.show();
		notification_test.onclick = function() {
			window.focus();
			this.cancel();
		};
	}
	else
	{
		Notification.requestPermission();						
	}
}

function refreshChatScroll() {
	var chatArea = $('#chattable');	
	chatArea.scrollTop(chatArea[0].scrollHeight);
}

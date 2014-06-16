/**
 *	ChatAPI Functionality  
 *
 *  Type: [auth, chat, join]
 */

( function(root, factory) {
    if( typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    }
    else if( typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    }
    else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function() {
/*	Put Library Definition here to contain in module namespace  
*/
	return {
		WebMsgType : {
			AUTH : 'auth',
			CHAT : 'chat',
			WHISPER: 'whisper',
			USERLIST: 'users',
			STATUS : 'status',
			HISTORY: 'history',
			JOIN : 'join',       // joining room
			LEAVE :'leave'       // leaving room
		},

		WebMsg : function (sessionid, type, data) {
			this.SessionID = sessionid;
			this.Type = type;
			this.Name = '';
			this.Data = data;
		}, 
		
		Room : function (szOwnerName) {
			this.RoomID = -1;
			this.RoomName = 'NewRoom';
			this.Owner = szOwnerName;
			this.PlayerList = [];
			this.MsgHistory = [];
		},
		
		RoomList : [],
		
		CreateRoom : function(player) {
			var room = new Room(player.Name);
			
			RoomList.push(room);
			
		},
	}
	
}));

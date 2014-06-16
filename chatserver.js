/**
 *  
 *  Websocket Chat Server
 * libraries
 *  Websockets - https://github.com/einaros/ws
 *  Memcached - https://github.com/3rd-Eden/node-memcached
 */
// Require Libraries

module.exports = exports = function(server, mongodb) {

    var getMac = require('getmac').getMac;    
    var WebSocketServer = require('ws').Server    
    var ChatAPI = require('./chatcommon.js');
    var WebMsgType = ChatAPI.WebMsgType;
    var WebMsg = ChatAPI.WebMsg;


    var PlayerArray = new Array();

    var Player = function(sessionid, name, ws)
    {
        this.Name = name;
        this.WebSockList = new Array();
        this.WebSockList[sessionid] = ws;
    }

    function LengthOfMap(obj)
    {
        return Object.keys(obj).length;
    }

    function SendToSocket(socket, data)
    {
        try {
            socket.send(JSON.stringify(data));
        }
        catch (e) {
            console.log("SendToSocket: Socket Error");
        }
    }

    function Broadcast(data)
    {
        console.log("Total Players: " + Object.keys(PlayerArray).length);
        for (var i in PlayerArray) {
            console.log('Sending to ' + i);
            var player = PlayerArray[i];


            for (var j in player.WebSockList) {
                var socket = player.WebSockList[j];
                try {				
                    var jsondata = JSON.stringify(data);
                    socket.send(jsondata);
                    console.log("Broadcast: " + j);
                }
                catch (e) {
                    console.log("Broadcast: Malformed Json, " + e);
                }				

                if (data.Type == WebMsgType.CHAT) {
                    StoreMessage(socket.PlayerName,jsondata);
                }
            }


        }
    }

    function SendToPlayer(packet)
    {
        var toPlayer = GetPlayerByName(packet.Data.ToPlayer);
        if (toPlayer) {
            for (var j in toPlayer.WebSockList) {
                var socket = toPlayer.WebSockList[j];
                SendToSocket(socket, packet);
            }
        }
    }

    function RegisterPlayer(sessionid, name, ws)
    {
        // New Player
        if ( !(name in PlayerArray) ) {
            ws.PlayerName = name;
            ws.SessionId = sessionid;
            PlayerArray[name] = new Player(sessionid, name, ws);

            var msgPck = CreatePacket('', WebMsgType.CHAT, name + ' has join the party...');
            msgPck.Name = 'SERVER';
            msgPck.Timestamp = Date.now();
            Broadcast(msgPck);
        }
        else { // Duplicated Player
            ws.PlayerName = name;
            ws.SessionId = sessionid;

            PlayerArray[name].WebSockList[sessionid] = ws;
        }
    }

    function UnregPlayer(name, sessionid)
    {
        if (name in PlayerArray) {

            var player = PlayerArray[name];

            if (sessionid in player.WebSockList) {
                delete player.WebSockList[sessionid];
            }

            // Last Socket of Player
            if ( LengthOfMap(player.WebSockList) === 0 ) {
                var msgPck = CreatePacket('', WebMsgType.CHAT, name + ' has left the party...');
                msgPck.Name = 'SERVER';
                msgPck.Timestamp = Date.now();
                Broadcast(msgPck);

                delete PlayerArray[name];
                console.log("Number Players: " + Object.keys(PlayerArray).length);
            }
        }
    }

    function BroadcastPlayerList()
    {
        console.log("SendPlayerList: " + Object.keys(PlayerArray).length);

        var userlist = new Array();
        for (var i in PlayerArray) {
            userlist.push(PlayerArray[i].Name);
        }	

        var packet = new WebMsg("ServerSessionID", WebMsgType.USERLIST, userlist);

        for (var i in PlayerArray) {
            console.log(i);
            var player = PlayerArray[i];


            for (var j in player.WebSockList) {
                var socket = player.WebSockList[j];
                console.log("BroadcastPlayerList: " + j);
                SendToSocket(socket, packet);
            }

        }
    }


    function SendMsgHistoryTo(playername, socket)
    {

    }

    function StoreMessage(playername, msg)
    {


    }

    function CreatePacket(sessionid, type, username, data)
    {
        return new WebMsg(sessionid, type, username, data);
    }

    function GetPlayerByName(name)
    {
        if ( name in PlayerArray ) {
            return PlayerArray[name];
        }

        console.log("GetPlayerByName: Not found " + name);
        return 0;
    }

    var wss = new WebSocketServer({server: server});
    console.log('Websocket listening on ' + server.address().port);
    
    getMac( function(err, macAddress) {
        if (err)  throw err;
        console.log(macAddress);    
    })                           
    
    function bindChatRoutes(ws)
    {
        ws.on('message', function(message) {
            console.log('received: %s', message);
            //ws.send("Server> " + message)
            try {
                var packet = JSON.parse(message);

                if (packet.Type == WebMsgType.AUTH) {

                    RegisterPlayer(packet.Data.SessionID, 'user', ws);
                }
                else if (packet.Type == WebMsgType.CHAT) {

                    packet.Name = ws.PlayerName;
                    packet.Data = packet.Data;
                    packet.Timestamp = Date.now();
                    Broadcast(packet);
                }
                else if (packet.Type == WebMsgType.WHISPER) {		

                    var toPlayer = GetPlayerByName(packet.Data.ToPlayer);

                    if (toPlayer) {
                        //StoreMessage(packet.Data.Msg);
                        packet.Name = ws.PlayerName;
                        packet.Timestamp = Date.now();
                        //SendToSocket(toPlayer.WebSock, packet);
                        SendToPlayer(packet);
                    }
                }
                else if (packet.Type == WebMsgType.STATUS) {
                    // name the packet from user and broadcast
                    packet.Timestamp = Date.now();
                    packet.Name = ws.PlayerName;
                    Broadcast(packet);
                }
            } catch (e) {
                console.log('Malform Json');
                console.log(message);
                var packet = CreatePacket('', WebMsgType.CHAT,'God > dont be evil');
                ws.send(JSON.stringify(packet));
            }
        });

        ws.on('close', function(code, message) {
            UnregPlayer(ws.PlayerName, ws.SessionId);
            BroadcastPlayerList();

            console.log("Client Closed Connection: " + code + "," + message);
        });

        ws.on('error', function(error) {
            UnregPlayer(ws.PlayerName, ws.SessionId);
            BroadcastPlayerList();

            console.log("Client Error: " + ws.PlayerName + "," + code);
        });       
        
    } // end bindChatRoutes
    
    wss.on('connection', function(ws) {
        console.log("User Connected");
                        
        // Register User
        console.log(ws._socket.address());
        console.log(ws._socket.remoteAddress);

        var user_addr = ws._socket.address().address;
        // Find user based on ip and mac address
        
        var players = mongodb.collection("players");
        
        players.findOne( {'_id' : user_addr}, function(err, document) {
            
            console.dir(document);
            
            if (!document) {
                console.log('Creating new user ' + user_addr);
            
                players.update( { '_id' : user_addr }, {'_id' : user_addr}, { upsert : true, w : 1 }, function(err, num_records) {
                   
                    if (err) {
                        console.log(err);
                        console.log('error in creating user ' + user_addr);
                        return;
                    }
                    
                    console.log('updated ' + num_records + ' records');                
                });                                              
            }
            else {
                bindChatRoutes(ws);        
            }                                                      
        });                        
    }); // end wss.on

} // end export
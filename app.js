var express = require('express');
var http = require('http');
var mongodb = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

var chatServer = require('./chatserver');
var app = express();

var port = 8080;

mongodb.connect('mongodb://localhost:27017/koi', function(err, db) {                   

    if (err) {
        console.log('Error connecting to DB');
        return;
    }
    
    var server = http.createServer(app).listen(port, function(err) {
        console.log('err: ' + err);
        console.log("HTTP Listening on " + server.address().port);  
        console.dir(server.address());
        chatServer(server, db);
    });

    // settings
    app.set('trust proxy', true);
    
    // Serve the static html pages
    app.use('/', express.static(__dirname + '/views/'));
    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded()); // to support URL-encoded bodies   
    
    app.get('/koi/orders/current', function (req, res) {
        
        console.log(req.params.drink);     
        console.log(req.query);     
        console.log('Get Current Orders of the day');
        
        var orders = db.collection('orders');
        
        orders.find( {}, {}, function (err, cursor) {
            cursor.toArray (function(err, docs) {
                 res.send(JSON.stringify(docs));
            });
        });
        
       
    });
    
    app.get('/koi/menu', function (req, res) {
        
        var s_drinks = db.collection("s_drinks");
        
        s_drinks.find( {}, {}, function (err, cursor) {
            cursor.toArray (function(err, docs) {
                console.log('send drinks menu');
                res.send(JSON.stringify(docs));
            });
        });
        
    });
    
    var ICE_LEVEL   = [ 'Normal Ice', 'Less Ice', 'No Ice', 'More Ice' ];
    var PEARL_LEVEL = [ 'Normal Pearl', 'Less Pearl', 'No Pearl', 'More Ice' ];
    
    app.post('/koi/order/send', function (req, res) {
        console.log(req.ips);   
        console.log(req.body);    
        console.log('posting order');

        var post = req.body;
        var orders = db.collection('orders');
        var s_drinks = db.collection('s_drinks');
        
        s_drinks.find( {}, {}, function (err, cursor) {
            cursor.toArray (function(err, docs) {
                console.log('Ordering drinks');
                
                var playername = 'person';
                var drink_id = post['drink'];
                var size = post['size'] ? 'Large' : 'Medium';
                var price = post['size'] ? docs[drink_id].large_price : docs[drink_id].medium_price;
                var pearl_level = ICE_LEVEL[post['form_ice_level']];
                var ice_level = PEARL_LEVEL[post['form_pearl_level']];
                
                var order = { 
                    'fk_player_name' : 'person',
                    'order_name' : docs[drink_id].name,
                    'size' : size,
                    'price' : price,
                    'sugar_level' : ice_level,
                    'ice_level' : pearl_level,
                    'datetime' : new Date()
                };
                
                orders.insert( order, { w : 1 }, function(err, document) {
                    console.dir(document[0]);
                    res.send('success');
                });                  
            });
        });
    });
    
});  

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
    
    app.get('/koi/orders', function (req, res) {
        
        console.log(req.params.drink);     
        console.log(req.query);     
        console.log('some request');

        
        res.send(req.query);
    });
    
    app.get('/koi/menu', function (req, res) {
        
        var s_drinks = db.collection("s_drinks");
        
        s_drinks.find( {}, {}, function (err, cursor) {
            console.dir(cursor);
            cursor.toArray (function(err, docs) {
               console.log(docs); 
                res.send(JSON.stringify(docs));
            });
        });
        
    });
    
    app.post('/koi/order', function (req, res) {
        console.log(req.ips);   
        console.log(req.body);    
        console.log('posting order');

        
        res.send({ 'post-data' : 'some post payload'});
    });    
    
});  

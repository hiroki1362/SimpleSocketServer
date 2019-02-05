var PORT = 8000;
var WebSocketServer = require("ws").Server;
var http = require("http");
var fs =require('fs');
//var express = require("express");

//var app = express();
//app.use(express.static(__dirname + "/"));
//var server = http.createServer(app);

var server = require('http').createServer(function(req, res) {

	var url = req.url;
	var tmp = url.split('.');
	var ext = tmp[tmp.length - 1];
 	var path = '.' + url;

 	var config = {
 		region: process.env.REGION,
 		accessKey: process.env.ACCESS_KEY,
 		secretKey: process.env.SECRET_KEY,
 		phrase: process.env.PHRASE
 	}

	/*
	var config = {
 		region: "aaaa",
 		accessKey: "abbb",
 		secretKey: "addd",
 		phrase: "process.env.PHRASE"
 	}*/

	res.writeHead(200, {'Content-Type': getType(req.url)});

	var output = null;
	console.log(req.url);

	if (ext == "/") {
		output = fs.readFileSync('./index.html','utf-8');
	} else if (ext == "html" && req.url === "/index.html") {
		output = fs.readFileSync('./index.html','utf-8');
	} else if (ext == "jpg" || ext == "gif" || ext == "png") {
		console.log(path);
		modifyPath = decodeURIComponent(path);
		output = fs.readFileSync(modifyPath, "binary");
		res.end(output, "binary");
	} else {
		console.log(path);
		output = fs.readFileSync(path, "utf-8");
	}
	
	res.end(output);
	
}).listen(PORT);


var wss = new WebSocketServer({server: server});

var connections = [];




/**
 * WebSocket接続 / 送信時のイベント設定
 */
wss.on("connection", function (ws) {
	connections.push(ws);

	ws.on("close", function() {
		connections = connections.filter(function (conn, i) {
			return (conn === ws) ? false: true;
		});
	});

	ws.on("message", function(message) {
		console.log(message);
		broadcastMessage(JSON.stringify(message));
	});

});

//server.listen(PORT);

/**
 * メッセージ送信
 */
function broadcastMessage(message) {
	connections.forEach(function(con, i) {
		con.send(message);
	});
}

function getType(_url) {
  var types = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".png": "image/png",
    ".gif": "image/gif",
    ".jpg": "image/jpeg",
    ".svg": "svg+xml"
  }
  for (var key in types) {
    if (_url.endsWith(key)) {
      return types[key];
    }
  }
  return "text/plain";
}

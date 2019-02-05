var PORT = 8000;
var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");

var app = express();
app.use(express.static(__dirname + "/"));
var server = http.createServer(app);
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

server.listen(PORT);

/**
 * メッセージ送信
 */
function broadcastMessage(message) {
	connections.forEach(function(con, i) {
		con.send(message);
	});
}
const PORT = 8000;
const WebSocketServer = require("ws").Server;
const http = require("http");
const express = require("express");

let app = express();
app.use(express.static(__dirname + "/"));
let server = http.createServer(app);
let wss = new WebSocketServer({server: server});

let connections = [];

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
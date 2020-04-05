/**
 * The server
 * - receives keyboard inputs from the clients
 * - calculates the new state based on inputs and physics
 * - broadcasts the state to the clients
 *
 * The client
 * - sends keyboard inputs to the server
 * - receives the game state from the server
 * - draws the game state
 *
 * The game state contains
 * - positions of all the paddles
 * - position of the ball
 * - velocity of the ball
 *
 * */

import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";

const app = express();
app.set("port", process.env.PORT || 3000);

var http = require("http").Server(app);

app.get("/", (req: any, res: any) => {
    res.send("hello world");
});

let io = require("socket.io")(http);

io.on("connection", function (socket: any) {
    console.log("a user connected");
});

const server = http.listen(3000, function () {
    console.log("listening on *:3000");
});

export class Server {}

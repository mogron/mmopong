import "./LoadEnv"; // Must be the first import
import http from "@server";
import * as socketio from "socket.io";
import logger from "@shared/Logger";

// Start the server
const port = Number(process.env.PORT || 3000);
http.listen(port, () => {
  logger.info("Express server started on port: " + port);
});

export class Server {
  io: any;

  constructor() {
    this.io = require("socket.io")(http);
    this.io.on("connection", function (socket: any) {
      console.log("a user connected");
      socket.on("input", (msg: string) => console.log(msg));
    });
  }
}

new Server();

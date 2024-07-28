import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 4000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handler(req, res).catch((err) => {
      console.error("Error handling request:", err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    });
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Adjust this based on your client's origin
      methods: ["GET", "POST"],
    },
  });

  let code = '// Start coding...';

  io.on("connection", (socket) => {
    console.log("A new connection");
    socket.emit("code_update", code);

    socket.on("code_update", (newCode) => {
      code = newCode; // Update server-side code
      socket.broadcast.emit("code_update", newCode); // Broadcast to all clients except the sender
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  httpServer.listen(port, (err) => {
    if (err) {
      console.error("Error starting server:", err);
      process.exit(1);
    }
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});

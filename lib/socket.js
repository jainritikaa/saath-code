import { io } from "socket.io-client";

const URL = "http://localhost:4000"; // Ensure this matches your server URL

export const socket = io(URL, {
  autoConnect: true,
});

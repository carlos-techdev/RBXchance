import io from "socket.io-client";
import { API_URL } from "./api.service";

// const SOCKET_URL = API_URL.slice(0, -4);
const SOCKET_URL = API_URL;

// Export individual socket connections
export const chatSocket = io.connect(SOCKET_URL + "/chat");
export const coinflipSocket = io.connect(SOCKET_URL + "/coinflip");
export const jackpotSocket = io.connect(SOCKET_URL + "/jackpot");
export const rouletteSocket = io.connect(SOCKET_URL + "/roulette");
export const crashSocket = io.connect(SOCKET_URL + "/crash");
export const battlesSocket = io.connect(SOCKET_URL + "/battles");
export const casesSocket = io.connect(SOCKET_URL + "/cases");

// Export all socket connections
export const sockets = [
  chatSocket,
  coinflipSocket,
  jackpotSocket,
  rouletteSocket,
  crashSocket,
  battlesSocket,
  casesSocket,
];

// Authenticate websocket connections
export const authenticateSockets = (token) => {
  //console.log("[WS] Authenticating...");

  // Emit auth event for all sockets
  sockets.forEach((socket) => socket.emit("auth", token));
};

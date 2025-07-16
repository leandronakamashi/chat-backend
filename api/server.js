// backend/server.js
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3000 });

const clients = new Set();

wss.on("connection", function connection(ws) {
  clients.add(ws);
  console.log("Cliente conectado. Total:", clients.size);

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ tipo: "total", total: clients.size }));
    }
  }

  ws.on("message", function incoming(message) {
    console.log("Mensagem recebida:", message.toString());

    // Envia para todos os clientes conectados
    for (const client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log("Cliente desconectado. Total:", clients.size);
  });
});

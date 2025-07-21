// backend/server.js
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3000 });

const clients = new Set();

wss.on("connection", function connection(ws) {
  clients.add(ws);
  console.log("Cliente conectado. Total:", clients.size);

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      // backend/server.js
      client.send(JSON.stringify({ tipo: "valor", valor: clients.size }));
    }
  }

  ws.on("message", function incoming(message) {
    // Envia para todos os clientes conectados

    try {
      const data = JSON.parse(message);
      if (data.tipo === "mensagem") {
        for (const client of clients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                tipo: "mensagem",
                texto: data.texto,
                nome: data.nome, // envia o nome recebido do frontend
              })
            );
          }
        }
      }
    } catch (err) {
      // Trate mensagens não JSON normalmente
      console.error("Erro ao processar mensagem:", err);
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log("Cliente desconectado. Total:", clients.size);
  });
});

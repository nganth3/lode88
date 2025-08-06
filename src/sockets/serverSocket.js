#!/usr/bin/env node
var WebSocketServer = require("websocket").server
const clients = new Set()
// Hàm khởi động WebSocket server
export function START_WEB_SOCKET(server) {
  const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
  })

  wsServer.on("request", (request) => {
    console.log(`${new Date()} Connection from origin ${request.origin}.`)

    if (!originIsAllowed(request.origin)) {
      request.reject()
      console.log(
        `${new Date()} Connection from origin ${request.origin} rejected.`
      )
      return
    }

    const connection = request.accept("echo-protocol", request.origin)
    clients.add(connection)
    console.log(`${new Date()} Connection accepted.`)
    // BOT_TELE.send_mesage_to_group("Connection accepted")

    connection.on("message", async (message) => {
      console.log("Received message:", message)
      // if (message.type === 'utf8') {
      //   let data = JSON.parse(message.utf8Data)
      //   let data_send = ""
      //   // Gửi phản hồi lại client
      //   connection.sendUTF(JSON.stringify(data_send))
      //  // connection.sendUTF(message.utf8Data)
      // } else if (message.type === 'binary') {
      //   connection.sendBytes(message.binaryData)
      // }
    })

    connection.on("close", () => {
      clients.delete(connection)
      console.log(`${new Date()} Peer disconnected.`)
    })
  })
}

// Xử lý kết nối WebSocket

// Hàm broadcast tới tất cả client
export function BROADCAST_MESSEAGE(data) {
  const message = typeof data === "string" ? data : JSON.stringify(data)
  for (const conn of clients) {
    if (conn.connected) {
      try {
        conn.sendUTF(message)
      } catch (err) {
        console.error("Broadcast error:", err)
      }
    }
  }
}

export { clients }

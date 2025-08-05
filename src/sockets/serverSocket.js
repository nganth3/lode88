#!/usr/bin/env node
import { createServer } from "http"
import { server as WebSocketServer } from "websocket"

const clients = new Set()

// HTTP server chỉ để bắt request không hợp lệ
const server = createServer((req, res) => {
  res.writeHead(404)
  res.end()
})

// Khởi tạo WebSocket server
const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
})

// Kiểm tra origin (có thể tùy chỉnh)
function originIsAllowed(origin) {
  return true
}

// Xử lý kết nối WebSocket
wsServer.on("request", (request) => {
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

// Hàm khởi động WebSocket server
export function START_WEB_SOCKET(port = process.env.SOCKET_PORT || 8017) {
  server.listen(port, () => {
    console.log(`${new Date()} WebSocket server started on port ${port}`)
  })
}

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

import { WebSocketServer, WebSocket } from 'ws';

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT as number });
const clients = new Set<WebSocket>();

// สร้างตัวแปรเก็บประวัติแชท (เก็บสูงสุด 20 ข้อความ)
const chatHistory: string[] = [];

wss.on('connection', (ws) => {
  clients.add(ws);

  // เมื่อมีคนเข้าห้องมาใหม่ ให้ส่งประวัติแชทเก่าไปให้ดู
  chatHistory.forEach((msg) => {
    ws.send(msg);
  });

  ws.on('message', (data) => {
    const message = data.toString();
    
    // บันทึกข้อความใหม่ลงประวัติแชท
    chatHistory.push(message);
    if (chatHistory.length > 20) {
      chatHistory.shift(); // ถ้าเกิน 20 บรรทัด ให้ลบอันเก่าสุดทิ้ง
    }

    // กระจายข้อความให้ทุกคน
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message); 
      }
    });
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

console.log(`🚀 Server is running on port ${PORT}`);
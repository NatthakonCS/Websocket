import blessed from 'blessed';
import WebSocket from 'ws';

// เพิ่มการตั้งค่า unicode: true เพื่อให้รองรับภาษาไทยดีขึ้น
const screen = blessed.screen({ 
  smartCSR: true, 
  title: 'Console Chat Room',
  fullUnicode: true 
});

const chatLog = blessed.log({
  top: 0, left: 0, width: '100%', height: '100%-3',
  border: { type: 'line' },
  style: { border: { fg: 'cyan' } },
  tags: true
});

const inputBox = blessed.textbox({
  bottom: 0, left: 0, height: 3, width: '100%',
  keys: true, inputOnFocus: true,
  border: { type: 'line' },
  style: { border: { fg: 'white' }, focus: { border: { fg: 'green' } } }
});

screen.append(chatLog);
screen.append(inputBox);
chatLog.add('{yellow-fg}=== Console Chat Room ==={/yellow-fg}');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  chatLog.add('{green-fg}🟢 เชื่อมต่อกับ Server สำเร็จ!{/green-fg}');
  screen.render();
});

ws.on('message', (data) => {
  chatLog.add(data.toString());
  screen.render();
});

inputBox.on('submit', (text) => {
  if (text.trim()) {
    ws.send(`[User]: ${text}`);
  }
  // รีเซ็ตช่องพิมพ์ให้คลีนที่สุด
  inputBox.setValue(''); 
  inputBox.focus();
  screen.render();
});

screen.key(['escape', 'C-c'], () => process.exit(0));

inputBox.focus();
screen.render();
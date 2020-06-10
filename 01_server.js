const http = require("http");
const port = 8080;

const INTERVAL = process.argv[2] || 1000;
const TIMEOUT = process.argv[3] || 5000;

let intervalID;
let clients = 0;

const toggleConsoleOutput = (toggle) => {
  if (toggle) {
    if (!intervalID) {
      intervalID = setInterval(() => {
        console.log(new Date().toString());
      }, INTERVAL);
    }
  } else {
    if (clients < 1) {
      clearInterval(intervalID);
      intervalID = null;
    }
  }
}

const connectionHandle = (req, res) => {
  clients++;
  toggleConsoleOutput(true);
  setTimeout(() => {
    clients--;
    toggleConsoleOutput(false);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(new Date().toString());
  }, TIMEOUT);
}

http
  .createServer(connectionHandle)
  .listen(port);

console.log(`Сервер запущен по адресу: localhost:${port}`);

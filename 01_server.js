const http = require("http");
const port = 8080;

const interval = process.argv[2];
const timeout = process.argv[3];

http
  .createServer((req, res) => {
    const intervalID = setInterval(() => {
      console.log(new Date().toString());
    }, interval);
    setTimeout(() => {
      clearInterval(intervalID);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(new Date().toString());
    }, timeout);
  })
  .listen(port);

console.log(`Сервер запущен по адресу: localhost:${port}`);

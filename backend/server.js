/*'use strict';

const express = require('express');
const cors = require('cors');

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
app.use(cors()) //TUTO: Cors for frontend ip != backend ip

app.get('/', (req, res) => {
  res.send('Hello World');
});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
*/


'use strict';

const express = require("express");
const http = require("http");

const cors = require('cors');

const port = process.env.PORT || 8080;

const app = express();
const index = require("./routes/index");

app.use(index);


const server = http.createServer(app);

// server-side
const io = require("socket.io")(server, {
	cors: {
	  origin: "http://localhost:3000",
	  methods: ["GET", "POST"]
	}
  });


//const io = socketIo(server);

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));

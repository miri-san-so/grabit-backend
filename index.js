const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const fs = require("fs");
const ss = require("socket.io-stream");
app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
	maxHttpBufferSize: 1e8,
	cors: { origin: "*" },
});

io.on("connection", (socket) => {
	// console.log(socket.id);
	socket.timeout(10000);

	socket.emit("your_id", { id: socket.id });

	socket.on("test", (data) => {
		console.log(data);
	});

	socket.on("join_figma_room", (data) => {
		console.log(data.my_id + " joined " + data.room);
		socket.join(data.room);
	});

	socket.on("join_room", (room) => {
		console.log("Figma Plugin joining " + room);
		socket.join(room);
	});

	socket.on("error", (e) => {
		console.log("error");
		console.log(e);
	});

	socket.on("image", async (data) => {
		console.log("socket on image");
		console.log(data);
		socket.broadcast.to(data.room).emit("trying", {
			images: data.files,
		});
		// const buffer = Buffer.from(data.raw).toString("base64");
		// console.log(buffer.slice(0, 120));
		// socket.broadcast.emit("trying", {
		// 	name: data.name,
		// 	type: data.type,
		// 	buffer: buffer,
		// });

		// socket.emit("hello", {
		// 	name: data.name,
		// 	type: data.type,
		// 	raw: buffer,
		// });
	});
	socket.on("disconnect", (socket) =>
		console.log(`${socket} has disconnected`)
	);
	socket.on("reconnect", (socket) => console.log(`${socket} has reconnected`));
});

io.on("reconnect", (socket) => {
	console.log("reconnect");
	console.log(socket);
});

io.on("disconnect", (socket) => console.log(`${socket} has disconnected`));

httpServer.listen(3001, () => {
	console.log("Server running on 3001");
});

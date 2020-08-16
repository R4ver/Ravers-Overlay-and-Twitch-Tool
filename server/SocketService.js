const socketIo = require("socket.io");
const storage = require("node-persist");

class SocketService {
    constructor(server) {
        this.io = socketIo(server);
        this.io.on("connection", async (socket) => {
            console.log("user connected");
            const currentChannelData = await storage.getItem("channel");
            this.io.emit("welcome", currentChannelData);
        });
    }

    emiter(event, body) {
        console.log(event, body);
        if (body) this.io.emit(event, body);
    }
}

module.exports = SocketService;

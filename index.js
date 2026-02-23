require("dotenv").config()

const express = require("express")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")

require("./connection")

const router = require("./router")
const { saveMessageController } = require("./controller/messageController")

const app = express()

app.use(cors({origin:"*"}))
app.use(express.json())
app.use(router)

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

// username -> socketId
let onlineUsers = {}

io.on("connection", (socket) => {

    // JOIN
    socket.on("join", (username) => {
        onlineUsers[username] = socket.id
        io.emit("online_users", Object.keys(onlineUsers))
    })

    // PRIVATE MESSAGE
    socket.on("private_message", async (data) => {

        // save to DB and return saved message
        const savedMessage = await saveMessageController(data)

        const receiverSocket = onlineUsers[data.to]

        if (receiverSocket) {
            io.to(receiverSocket).emit("receive_message", savedMessage)
        }

        // also send back to sender (important for consistent data)
        socket.emit("receive_message", savedMessage)
    })

    // TYPING INDICATOR
    socket.on("typing", ({ from, to }) => {
        const receiverSocket = onlineUsers[to]
        if (receiverSocket) {
            io.to(receiverSocket).emit("show_typing", from)
        }
    })

    // MARK AS SEEN
    socket.on("mark_seen", ({ sender, receiver }) => {

        const senderSocket = onlineUsers[sender]

        if (senderSocket) {
            io.to(senderSocket).emit("message_seen", receiver)
        }
    })

    // DISCONNECT
    socket.on("disconnect", () => {

        for (let user in onlineUsers) {
            if (onlineUsers[user] === socket.id) {
                delete onlineUsers[user]
                break
            }
        }

        io.emit("online_users", Object.keys(onlineUsers))
    })

})
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});
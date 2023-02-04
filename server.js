const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const db = require('./dbConnector')
const homeRoute = require('./routes/home_page')
const morgan = require('morgan');
const AccountRoute = require('./routes/registration')
const cors = require('cors');
const { Chatroom } = require('./models/Chatrroom')
const { Profile } = require('./models/Profile')
const jwt = require('jsonwebtoken')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan("dev"))

const server = http.createServer(app)
app.get('profile_page', (req, res) => {
    res.send(profile_page)
})
app.use(cors())
db.dbConnector();
let ids = [1]

app.use("/api/account", AccountRoute)
app.use("/api/home", homeRoute)

io = new Server(server, {
    cors: {
        origin: 'http://localhost:19006',
    },
})
io.on('connection', (socket) => {

    console.log("A connection has been made")
    let roomName = null
    socket.on('join-room', async (data) => {
        //chatroom name is just adding the profile id of the sender and reciever
        console.log(data)
        let result = jwt.verify(data.senderToken, "cash2me")
        let user_id = result.id
        //getting profile of the sender
        let profile = await Profile.findOne({ user: user_id }).populate('user')
        console.log(profile._id)
        let receiver = data.receiver_id
        console.log(receiver)
        var senderIdEx = `.*${profile._id}.*`;
        var senderIdregEx = new RegExp(senderIdEx);
        var receiverIdEx = `.*${receiver}.*`;
        var receiverIDregEx = new RegExp(receiverIdEx)
        var chatroom = await Chatroom.findOne().and([{ name: receiverIDregEx }, { name: senderIdregEx }])
        console.log(chatroom)
        if (!chatroom) {
            let roomname = profile._id + "--" + receiver
            console.log(`this is the roomname ${roomname}`)
            chatroom = new Chatroom({
                "name": roomname
            })
            await chatroom.save()

        }
        socket.join(chatroom.name)
        roomName = chatroom.name
        io.in(roomName).emit("allMessages",chatroom.messages )
        socket.to(roomName).emit('User-joined', { id: ids.length,user:"admin", load: "other user is here" });
        
        socket.on('send-message', async (msg) => {
            console.log(msg)
            msg['id']=ids.length
            io.in(roomName).emit("receive-message",msg )
            chatroom.messages.push(msg)
            //socket.emit('recieve-message', { id: ids.length, load: msg })
            ids.push(1)
            console.log({ id: ids.length })
            await chatroom.save()
        })

    })





})
app.use((req, res, next) => {
    res.status(404)
    res.json({ "message": "Endpoint not found boss" })

})

app.use((err, req, res, next) => {
    res.status(500)
    res.json({ "message": err })

})

server.listen(3000, () => {
    console.log("Server is running on port 3000")
})

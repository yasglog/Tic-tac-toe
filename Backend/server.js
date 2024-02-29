const express=require('express')
const app=express();
const cors = require("cors");
app.use(cors());
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let userSocketMap=[];
function getAllUser(roomId){

    return Array.from(io.sockets.adapter.rooms.get(roomId)||[]).map((socketId)=>{
        return{
            socketId,
            username:userSocketMap[socketId]
        }
    })
}

io.on('connection',(socket)=>{
    console.log('socket connection',socket.id)

    socket.on('join',({roomId,username})=>{
      userSocketMap[socket.id]=username;
      socket.join(roomId);
      const clients=getAllUser(roomId)
      let value=clients[0].username

      clients.forEach(({socketId})=>{

        // console.log(socketId)
        // const value=userSocketMap[0].username;
        io.to(socketId).emit('joined',{
            clients,
            username,
            socketId:socket.id,
            auther:value
        })
      });


    socket.on('disconnecting',()=>{
      const rooms=[...socket.rooms];
      rooms.forEach((roomsId)=>{
          socket.in(roomsId).emit('disconnected',{
              socketId:socket.id,
              username:userSocketMap[socket.id]
          });
      });
      delete userSocketMap[socket.id];
      socket.leave();
  })
  socket.on('textChange', ({ value, roomId,pairValue,Username,turn,reset,otherBoardCard }) => {
    // console.log('Text change received:', value);
    // console.log('Value of row and col', pairValue);
    // console.log('Current User Name', Username);
    // console.log("Trun user",turn)
    // console.log("value of otherBoardCard is",otherBoardCard)

    socket.broadcast.to(roomId).emit('textChange', { value, pairValue,Username,turn,otherBoardCard });
});
socket.on('winner', ({currentValue}) => {
  // Broadcast the reset event to all clients in the room
  console.log("Winner is  ",currentValue)
  io.to(roomId).emit('winner',{currentValue});
});

      console.log(clients);
    //   console.log(username)
    })
})
const PORT=5000;
server.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
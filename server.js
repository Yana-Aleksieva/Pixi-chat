const cors = require('cors')
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();

const server = http.createServer(app)
const io = socketIO(server, { cors: { origin: "*" } });

const rooms = {};
app.use(cors());

app.use('/', express.static('static'));
app.get('/', (req, res) => res.send('Hello'));


io.on('connect', socket => {
    console.log('Player connected');

    socket.on('selectRoom', roomId => {
        if (rooms[roomId] == undefined) {
            rooms[roomId] = new Map();
        }
        const players = rooms[roomId];

        if (players.size >= 2) {
            socket.emit('error', 'Room is full!');
            socket.disconnect();
        } else {
            socket.join(roomId);
            initGame(roomId, players, socket);
            console.log(players)
        }
    });

});

function initGame(roomId, players, socket) {


    socket.on('player', (username) => {

        socket.on('message', data => {

            let message = `${username}: ${data}`
            io.to(roomId).emit('message', message);
        })

    });
    socket.on('disconnect', () => {
        console.log('Player left');
        players.delete(socket);
    });
}

server.listen(3000, () => console.log('Server is listening on port 3000'));
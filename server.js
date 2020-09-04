const express = require('express')
const app = express()
const path = require('path')
const PORT = 3000
const server = app.listen(PORT, () => console.log('Listening on Port: ' + PORT))
const io = require('socket.io').listen(server)

app.use(express.static(__dirname + '/public'))

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/settings', async (req, res) => {
    res.sendFile(path.join(__dirname, '/settings.html'))
})

let users = 0

io.on('connection', socket => {
    console.log('A user has connected')
    users += 1
    socket.emit('users', users)
})
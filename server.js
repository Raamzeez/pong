const express = require('express')
const app = express()
const path = require('path')

app.use(express.static(__dirname + '/public'))

const PORT = 3000

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.listen(PORT, () => {
    console.log('Listening on Port: ' + PORT)
})
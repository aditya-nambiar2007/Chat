let ws = require('ws')
let fs = require('fs')
let url = require('url')
const { error } = require('console')
const server = require('http').createServer(function (req, res) {
    fs.readFile('xx.html', function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
})




const wss = new ws.WebSocketServer({ server })
fs.appendFile('data.txt', "", (e) => { if (e) console.log(e) })
wss.on("connection", ws => {
    fs.readFile("data.txt", (err, data) => {
        if (err) console.error(error)
        ws.send(data)
    })
    ws.on('message', m => {
        require('fs').appendFile('data.txt', m, (e) => { if (e) console.log(e) })
        wss.clients.forEach(e => { e.send(m) });
    })
})
server.listen(80, () => { console.log('started'); })
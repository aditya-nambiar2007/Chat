let http = require('http');
let url = require('url');
let fs = require('fs');
let ws= require('ws')
const server = http.createServer(function (req, res) {
    let q = url.parse(req.url, true);
    let filename = "." + q.pathname;
    if (filename.endsWith("/") || filename=="./index.js"||/\.\/Room\/./.test(q.pathname)){
        filename="./index.html"
    }
    fs.readFile(filename, function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("404 Not Found");
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
})



const wss = new ws.WebSocketServer({ server })
wss.on("connection", ws => {
    ws.on('message', m => {
        let x = JSON.parse(m)
        if(x[1]=='load'){
            try{
            fs.appendFile("Rooms/"+x[0]+".txt", "", (e) => { if (e) console.log(e) })
            fs.readFile("Rooms/"+x[0]+".txt", function (err, data) {
                if (err) {console.error(err)}
                ws.send( JSON.stringify( [x[0],data] ) )
            })}
            catch (error){
                ws.send( JSON.stringify( [x[0],''] ) )
            }
        }
        else{
        require('fs').appendFile(`Rooms/${x[0]}.txt`, x[1], (e) => { if (e) console.log(e) })
        wss.clients.forEach(e => { e.send(m) });
    }})
})
server.listen(80, () => { console.log('started'); })
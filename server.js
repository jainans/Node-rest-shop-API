const http = require('http');
const app = require('./app');

const port = process.env.port || 3000;

const localhost = '127.0.0.1';

const server = http.createServer(app);

server.listen(port, localhost, ()=>{
    console.log(`The server started on http://${localhost}:${port}/`);
});


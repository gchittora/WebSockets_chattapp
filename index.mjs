// Since createServer is a named export, we use curly braces
import { createServer } from 'http';

// Since staticHandler is a default export of the serve-handler module, we don't use curly braces
import staticHandler from 'serve-handler';
import ws, { WebSocketServer } from 'ws';

const server = createServer((req, res) => {
    return staticHandler(req, res, { public: 'public' });
});

// Attach the WebSocket server to the HTTP server
const wss = new WebSocketServer({ server });

wss.on('connection', (client) => {
    console.log("Client connected");
    client.on('message', (msg) => {
        console.log(`Message received is: ${msg}`);
        broadcast(msg);
    });
});

function broadcast(msg) {
    for (const client of wss.clients) {
        if (client.readyState === ws.OPEN) {
            client.send(msg);
        }
    }
}

server.listen(8000, () => {
    console.log("Server is listening on port 8080");
});

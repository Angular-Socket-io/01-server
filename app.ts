import { Server } from "./models/server.models";
require('dotenv').config();

const server = Server.instance;

server.start( () => {
    console.log(`Servidor corriendo en el puerto ${ server.port }`);
});
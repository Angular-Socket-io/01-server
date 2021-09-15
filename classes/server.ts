import express from "express";
import { SERVER_PORT } from "../global/enviroment";
import socketIO from "socket.io";
import http from "http";
import * as socket from "../sockets/socket";

export default class Server {

  private static _instance:Server;

  public app: express.Application;
  public io: socketIO.Server;
  private httpServer: http.Server;
  public port: number;

  private constructor() {
    this.port = SERVER_PORT;
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.io = new socketIO.Server(this.httpServer,
      {
        cors: {
          origin: true,
          methods: ["GET", "POST"]
        }
      }
      );
    this.escucharSockets();
  }

  public static get instance(){
    return this._instance || ( this._instance = new this() );
  }

  private escucharSockets(){
    console.log('Escuchando conexiones - Sockets');

    this.io.on('connection', cliente =>{
        console.log('cliente conectado');
        //mensajes
        socket.mensaje(cliente,this.io);
        // desconectar
        socket.desconectar(cliente);
    })
  }

  start(callback: () => void) {
    this.httpServer.listen(this.port, callback);
  }
}

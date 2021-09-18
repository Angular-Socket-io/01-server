import express from "express";
import cors from "cors";
import http from "http";
import socketIO from "socket.io";
import router from "../routes/router";
import { socketsController } from '../sockets/sockets.controller';

export class Server {
  private static _instance: Server;
  public app: express.Application;
  private httpServer: http.Server;
  public io!: socketIO.Server;
  public port: string | undefined;

  constructor() {
    this.port = process.env.PORT;
    this.app = express();
    //declaro el http server usando express
    this.httpServer = http.createServer(this.app);

    //inyecto el httpserver al socket io
    this.io = new socketIO.Server(this.httpServer,
        {
            cors: {
              origin: true,
              methods: ["GET", "POST"]
            }
          });

    //middlewares
    this.middlewares();

    //Rutas de la aplicacion
    this.routes();

    //sockets
    this.sockets();
  }

  middlewares() {
    //cors
    this.app.use(cors({ origin: true, credentials: true }));

    // Directorio publico
    this.app.use(express.static("public"));

    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  routes() {
    this.app.use("/", router);
  }

  sockets() {
    this.io.on("connection", (cliente)=>{
      //console.log(cliente.id)
        socketsController(cliente,this.io);
    });
  }

  start(callback?: () => void) {
    this.httpServer.listen(this.port, callback);
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }
}

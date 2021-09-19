import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import {UsuariosLista} from "../classes/usuarios-lista";
import { Usuario } from '../classes/usuario';

export const usuariosConectados = UsuariosLista.instance;

export const socketsController = (cliente: Socket, io: socketIO.Server) => {
    console.log('Cliente conectado - sockets');
    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregar(usuario);


    cliente.on('disconnect', () => {
        console.log('Cliente desconectado - sockets');
        usuariosConectados.borrarUsuario(cliente.id);
        io.emit('usuarios-activos',usuariosConectados.getLista());
    });

    cliente.on('mensaje', (  payload: { de: string, cuerpo: string }  ) => {
        //console.log('Mensaje recibido', payload );
        io.emit('mensaje-nuevo', payload );
    });
    cliente.on('configurar-usuario', (  payload: { nombre:string},callback?:Function)=> {
        usuariosConectados.actualizarNombre(cliente.id,payload.nombre);
        if(callback){
            callback({
                ok:true,
                mensaje:`Usuario configurado`
            });
        }
        io.emit('usuarios-activos',usuariosConectados.getLista());
    });

    //obtener usuarios
    cliente.on('obtener-usuarios', ()=> {
        io.to(cliente.id).emit('usuarios-activos',usuariosConectados.getLista());
    });
}



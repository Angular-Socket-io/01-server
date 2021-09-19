import {Usuario} from "./usuario";
import { map, filter } from "rxjs/operators";
export class UsuariosLista {
    private static _instance: UsuariosLista;
    private  lista:Usuario[]=[];
    constructor(){}

    //agregar un usuario
    public agregar(usuario:Usuario){
        this.lista.push(usuario);
        console.log(this.lista)
        return usuario;
    }

    public actualizarNombre(id:string,nombre:string){
        this.lista.map(lista => lista.id === id? lista.nombre = nombre: lista.nombre);
        console.log('=== Usuario Actualizado ===');
        console.log(this.lista)
    }

    public getLista(){
        return this.lista.filter( usuario => usuario.nombre !== 'Sin-nombre');
    }
    public getUsuario(id:string){
        return this.lista.find( usuario => usuario.id === id);
    }

    //obtener usuarios en una sala en particular
    public getUsuariosEnSala(sala:string){
       return this.lista.filter( usuario => {
           return usuario.sala === sala;
       });
    }

    //Borrar Usuario
    public borrarUsuario(id:string){
        const tempUsuario = this.getUsuario(id);
        this.lista = this.lista.filter( usuario => usuario.id !== id);
        console.log(this.lista)
        return tempUsuario;
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }
}
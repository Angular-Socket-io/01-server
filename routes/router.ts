import { Router,Request,Response } from 'express';
import { Server } from '../models/server.models';
import {UsuariosLista} from "../classes/usuarios-lista";


const router = Router();


router.get('/mensajes', ( req: Request, res: Response  ) => {
    res.json({
        ok: true,
        mensaje: 'Todo esta bien!!'
    });

});

router.post('/mensajes', ( req: Request, res: Response  ) => {

    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;

    const payload = { cuerpo, de };

    const server = Server.instance;
    server.io.emit('mensaje-nuevo', payload );

    res.json({
        ok: true,
        cuerpo,
        de
    });

});


router.post('/mensajes/:id', ( req: Request, res: Response  ) => {

    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;
    const id     = req.params.id;
    const server = Server.instance;

    const payload = {
        de,
        cuerpo
    }

    server.io.in( id ).emit('mensaje-privado',payload);
    res.json({
        ok: true,
        cuerpo,
        de,
        id
    });
});

router.get('/usuarios',async (req: Request, res: Response) => {
    const server = Server.instance;
    await server.io.fetchSockets().then((sockets) => {
        res.json({
            ok: true,
            // clientes
            clientes: sockets.map( cliente => cliente.id)
        });
    }).catch((err) => {
        res.json({
            ok: false,
            err
        })
    });
});

// Otener usuarios y sus nombres
router.get('/usuarios/detalle',async (req: Request, res: Response) => {
    const server = Server.instance;
    const usuariosConectados =  UsuariosLista.instance;
        res.json({
            ok: true,
            // clientes
            clientes: usuariosConectados.getLista()
        });

});



export default router;
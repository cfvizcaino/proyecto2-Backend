import Usuario from "../models/usuarioModel.js";

export const crearUsuario = async(req, res) => {
    try {
        const nuevoUsuario = new Usuario(req.body);
        await nuevoUsuario.save();
        res.status(201).json({
            message: "Usuario creado correctamente", nuevoUsuario
        });
    } catch (error){
        console.error(error);
        res.status(500).json({
            message: "Error al crear usuario", error
        });
    }
}
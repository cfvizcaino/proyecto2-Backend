import Usuario from "../models/usuarioModel.js";
import jwt from "jsonwebtoken";

// Generar token JWT
const generarToken = (usuarioId) => {
  return jwt.sign(
    {
      id: usuarioId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Crear un usuario (registro)
export const crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    res.status(201).json({
      message: "Usuario creado correctamente",
      nuevoUsuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al crear usuario",
      error,
    });
  }
};

// Login
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const passwordValido = await usuario.compararPassword(password);
    if (!passwordValido) {
      return res.status(401).json({
        message: "Contraseña incorrecta",
      });
    }

    const token = generarToken(usuario._id);

    res.json({
      message: "Inicio de sesion exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error en el login",
      error,
    });
  }
};

// Obtener usuario
export const obtenerUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-password");
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener el usuario",
      error,
    });
  }
};

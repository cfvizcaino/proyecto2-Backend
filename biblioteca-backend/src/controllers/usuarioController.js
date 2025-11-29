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
        permisos: usuario.permisos,
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

// Actualizar usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const usuarioAuth = req.usuario;
    const { id } = req.params;

    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar permisos
    if (usuarioAuth._id.toString() !== id && usuarioAuth.rol !== "admin") {
      return res.status(403).json({
        message: "No tienes permiso para modificar este usuario",
      });
    }

    const camposActualizables = ["nombre", "email", "password", "rol"];

    camposActualizables.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        usuario[campo] = req.body[campo];
      }
    });

    const usuarioActualizado = await usuario.save();

    res.json({
      message: "Usuario actualizado correctamente",
      usuario: {
        id: usuarioActualizado._id,
        nombre: usuarioActualizado.nombre,
        email: usuarioActualizado.email,
        rol: usuarioActualizado.rol,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al actualizar usuario",
      error,
    });
  }
};

// Eliminar usuario (soft delete)
export const eliminarUsuario = async (req, res) => {
  try {
    const usuarioAuth = req.usuario;
    const { id } = req.params;

    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (usuarioAuth._id.toString() !== id && usuarioAuth.rol !== "admin") {
      return res.status(403).json({
        message: "No tienes permiso para eliminar este usuario",
      });
    }

    usuario.inhabilitado = true;
    await usuario.save();

    res.json({
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al eliminar usuario",
      error,
    });
  }
};

// Historial de reservas de un usuario
export const historialUsuario = async (req, res) => {
  try {
    const usuarioAuth = req.usuario;     
    const { id } = req.params;           

    if (usuarioAuth._id.toString() !== id.toString() && 
        !usuarioAuth.permisos.modificar_usuarios) {
      return res.status(403).json({
        message: "No tienes permiso para ver este historial"
      });
    }

    const reservas = await Reserva.find({ usuario: id })
      .populate("libro", "titulo autor")
      .select("fechaReserva fechaEntrega activa")
      .sort({ fechaReserva: -1 });

    return res.json({
      usuarioId: id,
      historial: reservas
    });

  } catch (error) {
    console.error("Error en historialUsuario:", error);
    res.status(500).json({
      message: "Error al obtener historial del usuario",
      error: error.message
    });
  }
};
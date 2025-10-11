import Libro from "../models/librosModel.js";
import Usuario from "../models/usuarioModel.js";

export const crearLibro = async (req, res) => {
  try {
    const { usuarioId, titulo, autor, disponible } = req.body;

    // Verificar si el usuario existe
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    // Verificar permisos
    if (usuario.rol != "admin") {
      return res.status(403).json({
        message: "No tienes permiso para crear libros",
      });
    }

    // Crear el libro
    const nuevoLibro = new Libro({ titulo, autor, disponible });
    await nuevoLibro.save();

    res.status(201).json({
      message: "Libro creado exitosamente",
      libro: nuevoLibro,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al crear el libro",
      error,
    });
  }
};

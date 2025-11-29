import Libro from "../models/librosModel.js";
import Reserva from "../models/reservaModel.js";

// Crear una reserva
export const crearReserva = async (req, res) => {
  try {
    const usuario = req.usuario;
    const { libroId } = req.body;

    const libro = await Libro.findById(libroId);

    if (!libro || libro.inhabilitado) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    if (!libro.disponible) {
      return res.status(400).json({ message: "El libro no está disponible" });
    }

    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + 3);

    const nuevaReserva = new Reserva({
      usuario: usuario._id,
      libro: libro._id,
      fechaLimite,
    });

    await nuevaReserva.save();

    libro.disponible = false;
    await libro.save();

    res.status(201).json({
      message: "Reserva realizada correctamente",
      reserva: nuevaReserva,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la reserva", error });
  }
};

// Devolver un libro (finalizar reserva)
export const devolverLibro = async (req, res) => {
  try {
    const usuario = req.usuario;
    const { id } = req.params;

    const reserva = await Reserva.findById(id).populate("libro");
    if (!reserva) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    if (!reserva.activa) {
      return res.status(400).json({ message: "La reserva ya fue devuelta" });
    }

    // Permisos:
    // - Dueño de la reserva
    // - Admin
    if (
      reserva.usuario.toString() !== usuario._id.toString() &&
      usuario.rol !== "admin"
    ) {
      return res.status(403).json({
        message: "No tienes permiso para devolver este libro",
      });
    }
    reserva.activa = false;
    await reserva.save();

    const libro = await Libro.findById(reserva.libro._id);
    libro.disponible = true;
    await libro.save();

    res.json({
      message: "Libro devuelto correctamente",
      reserva,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al devolver el libro",
      error,
    });
  }
};

// Obtener reservas del usuario autenticado
export const obtenerMisReservas = async (req, res) => {
  try {
    const usuario = req.usuario;

    const reservas = await Reserva.find({ usuario: usuario._id })
      .populate("libro", "titulo autor")
      .sort({ fechaReserva: -1 });

    // Si no hay reservas
    if (!reservas || reservas.length === 0) {
      return res.json({
        total: 0,
        reservas: [],
        message: "No tienes reservas registradas",
      });
    }

    return res.json({
      total: reservas.length,
      reservas,
    });
  } catch (error) {
    console.error("Error en obtenerMisReservas:", error);
    return res.status(500).json({
      message: "Error al obtener las reservas del usuario",
      error: error.message,
    });
  }
};

// Obtener todas las reservas (solo admin)
export const obtenerTodasLasReservas = async (req, res) => {
  try {
    const usuario = req.usuario;

    if (usuario.rol !== "admin") {
      return res.status(403).json({
        message: "No tienes permiso para ver todas las reservas",
      });
    }

    const reservas = await Reserva.find()
      .populate("usuario", "nombre email")
      .populate("libro", "titulo autor")
      .sort({ fechaReserva: -1 });

    // No hay reservas en el sistema
    if (!reservas || reservas.length === 0) {
      return res.json({
        total: 0,
        reservas: [],
        message: "No existen reservas registradas",
      });
    }

    return res.json({
      total: reservas.length,
      reservas,
    });
  } catch (error) {
    console.error("Error en obtenerTodasLasReservas:", error);
    return res.status(500).json({
      message: "Error al obtener todas las reservas",
      error: error.message,
    });
  }
};

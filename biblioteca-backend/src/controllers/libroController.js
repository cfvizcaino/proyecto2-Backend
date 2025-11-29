import Libro from "../models/librosModel.js";
import Usuario from "../models/usuarioModel.js";

export const crearLibro = async (req, res) => {
  try {
    const { titulo, autor, editorial, genero, year, disponible } = req.body;

    const usuario = req.usuario;

    // Verificar rol admin
    if (usuario.rol !== "admin") {
      return res.status(403).json({
        message: "No tienes permiso para crear libros",
      });
    }

    // Crear el libro
    const nuevoLibro = new Libro({
      titulo,
      autor,
      editorial,
      genero,
      year,
      disponible,
      creadoPor: usuario._id,
    });

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

// Buscar un libro por ID
export const obtenerLibroPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const libro = await Libro.findById(id);
    if (!libro) {
      return res.status(404).json({ msg: "Libro no encontrado" });
    }
    res.json(libro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener el libro", error });
  }
};

// Obtener todos los libros con filtros y paginación
export const obtenerLibros = async (req, res) => {
  try {
    const {
      genero,
      autor,
      editorial,
      year,
      titulo,
      disponible,
      page = 1,
      limit = 10,
    } = req.query;

    // Construir filtros dinámicos
    const filtros = { inhabilitado: false }; // excluye inhabilitados por defecto

    if (genero) filtros.genero = genero;
    if (autor) filtros.autor = autor;
    if (editorial) filtros.editorial = editorial;
    if (year) filtros.year = Number(year);
    if (titulo) filtros.titulo = { $regex: titulo, $options: "i" };
    if (disponible !== undefined) filtros.disponible = disponible === "true";

    // Paginación
    const skip = (page - 1) * limit;

    const [libros, total] = await Promise.all([
      Libro.find(filtros, "titulo").skip(skip).limit(Number(limit)),
      Libro.countDocuments(filtros),
    ]);

    return res.json({
      paginaActual: Number(page),
      librosPorPagina: Number(limit),
      paginaMaxima: Math.ceil(total / limit),
      totalLibros: total,
      resultados: libros,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener los libros" });
  }
};

// Actualizar un libro
export const actualizarLibro = async (req, res) => {
  try {
    const usuario = req.usuario;

    if (usuario.rol !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permiso para actualizar libros" });
    }

    const { id } = req.params;

    const libro = await Libro.findById(id);
    if (!libro) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    // Actualizar solo los campos enviados
    const camposActualizables = [
      "titulo",
      "autor",
      "editorial",
      "genero",
      "year",
      "disponible",
    ];
    camposActualizables.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        libro[campo] = req.body[campo];
      }
    });

    const libroActualizado = await libro.save();

    res.json({
      message: "Libro actualizado correctamente",
      libro: libroActualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el libro", error });
  }
};

// Eliminar (soft delete) un libro
export const eliminarLibro = async (req, res) => {
  try {
    const usuario = req.usuario;
    const { id } = req.params;

    if (usuario.rol !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar libros" });
    }

    const libro = await Libro.findById(id);
    if (!libro) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    libro.inhabilitado = true;
    await libro.save();

    res.json({
      message: "Libro eliminado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al eliminar libro",
      error,
    });
  }
};

export const historialLibro = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar todas las reservas del libro
    const reservas = await Reserva.find({ libro: id })
      .populate("usuario", "nombre email")
      .select("fechaReserva fechaEntrega activa")
      .sort({ fechaReserva: -1 });

    return res.json({
      libroId: id,
      historial: reservas,
    });
  } catch (error) {
    console.error("Error en historialLibro:", error);
    res.status(500).json({
      message: "Error al obtener historial del libro",
      error: error.message,
    });
  }
};
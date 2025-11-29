import express from "express";
import {
  crearLibro,
  obtenerLibroPorId,
  obtenerLibros,
  actualizarLibro,
  eliminarLibro,
  historialLibro,
} from "../controllers/libroController.js";
import { protegerRuta } from "../middleware/auth.js";

const router = express.Router();

// ----- RUTAS -----

router.post("/", protegerRuta, crearLibro); // Crear libro (AUTH)
router.get("/", obtenerLibros); // Obtener todos los libros
router.get("/:id", obtenerLibroPorId); // Obtener un libro por ID
router.put("/:id", protegerRuta, actualizarLibro); // Actualizar libro (AUTH)
router.delete("/:id", protegerRuta, eliminarLibro); // Eliminar libro (AUTH)
router.get("/:id/historial", protegerRuta, historialLibro); // Historial del libro

export default router;

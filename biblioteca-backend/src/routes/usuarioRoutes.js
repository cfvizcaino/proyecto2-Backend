import express from "express";
import {
  crearUsuario,
  loginUsuario,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
  historialUsuario,
} from "../controllers/usuarioController.js";
import { protegerRuta } from "../middleware/auth.js";

const router = express.Router();

// ----- RUTAS -----

router.post("/", crearUsuario); // Registro
router.post("/login", loginUsuario); // Login
router.get("/perfil", protegerRuta, obtenerUsuario); // Perfil
router.put("/:id", protegerRuta, actualizarUsuario); // Actualizar usuario (solo el mismo o admin)
router.delete("/:id", protegerRuta, eliminarUsuario); // Eliminar usuario (inhabilitar - solo admin o usuario)
router.get("/:id/historial", protegerRuta, historialUsuario); // Historial del usuario

export default router;

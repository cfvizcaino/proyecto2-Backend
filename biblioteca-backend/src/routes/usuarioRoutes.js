import express from "express";
import {
  crearUsuario,
  loginUsuario,
  obtenerUsuario,
} from "../controllers/usuarioController.js";
import { protegerRuta } from "../middleware/auth.js";

const router = express.Router();

// ----- RUTAS -----

router.post("/", crearUsuario); // Registro
router.post("/login", loginUsuario) // Login
router.get("/perfil", protegerRuta, obtenerUsuario) // Perfil

export default router;

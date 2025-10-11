import express from "express";
import { crearUsuario } from "../controllers/usuarioController.js";

const router = express.Router();

// Ruta para crear usuario
router.post("/", crearUsuario);

export default router;

import express from "express";
import { crearLibro } from "../controllers/libroController.js";

const router = express.Router();

// Ruta para crear usuario
router.post("/", crearLibro);

export default router;

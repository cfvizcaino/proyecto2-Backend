import express from "express";
import {
    crearReserva,
    devolverLibro,
    obtenerMisReservas,
    obtenerTodasLasReservas,
} from "../controllers/reservaController.js";
import { protegerRuta } from "../middleware/auth.js";

const router = express.Router();

// ----- RUTAS -----

router.post("/", protegerRuta, crearReserva); // Crear reserva (AUTH)
router.put("/devolver/:id", protegerRuta, devolverLibro); // Devolver libro
router.get("/mis-reservas", protegerRuta, obtenerMisReservas); // Obtener reservas del usuario actual
router.get("/", protegerRuta, obtenerTodasLasReservas); // Obtener todas las reservas (solo admin)


export default router;

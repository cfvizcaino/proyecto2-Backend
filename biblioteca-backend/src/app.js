import express from "express";
import cors from "cors";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import libroRoutes from "./routes/libroRoutes.js";
import reservaRoutes from "./routes/reservaRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// ----- RUTAS -----

// Ruta base de prueba
app.get("/", (req, res) => {
  res.send("API de Biblioteca funcionando correctamente");
});

// Crear usuarios, libros, reservas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/libros", libroRoutes);
app.use("/api/reservas", reservaRoutes);


export default app;

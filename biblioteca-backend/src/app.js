import express from "express";
import cors from "cors";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import libroRoutes from "./routes/libroRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// ----- RUTAS -----
// Ruta base de prueba
app.get("/", (req, res) => {
  res.send("📚 API de Biblioteca funcionando correctamente");
});

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/libros", libroRoutes);

export default app;

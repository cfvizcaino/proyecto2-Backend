import mongoose from "mongoose";

const libroSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  disponible: { type: Boolean, default: true },
});

const Libro = mongoose.model("Libro", libroSchema);

export default Libro;

import mongoose from "mongoose";

const reservaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  libro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Libro",
    required: true,
  },
  fechaReserva: {
    type: Date,
    default: Date.now,
  },
  fechaLimite: {
    type: Date,
    required: true,
  },
  activa: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("Reserva", reservaSchema);

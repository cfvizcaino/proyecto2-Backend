import mongoose from "mongoose";

const libroSchema = new mongoose.Schema({
  titulo: {
     type: String, 
     required: true 
    },
  autor: { 
    type: String, 
    required: true 
  },
  editorial: { 
    type: String 
  },
  genero: { 
    type: String 
  },
  year: { 
    type: Number 
  },
  disponible: { 
    type: Boolean, 
    default: true 
  },
  inhabilitado: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

const Libro = mongoose.model("Libro", libroSchema);

export default Libro;

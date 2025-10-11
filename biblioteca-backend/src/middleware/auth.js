import jwt from "jsonwebtoken";
import Usuario from "../models/usuarioModel.js";

// Protección de rutas
export const protegerRuta = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = await Usuario.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        message: "Token invalido o expirado",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "No autorizado",
    });
  }
};

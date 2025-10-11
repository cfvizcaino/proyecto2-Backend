import express from "express";
import app from "./src/app.js"
import dotenv from "dotenv";
import { connectBD } from "./src/config/db.js";

dotenv.config();
connectBD();


app.use(express.json());

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`Servidor corriendo en ${PORT}`))

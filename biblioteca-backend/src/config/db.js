import mongoose from 'mongoose';

export const connectBD = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conectado a la BD");
    } catch (error) {
        console.error("Error conectandose a la BD", error);
        process.exit(1);
    }
}
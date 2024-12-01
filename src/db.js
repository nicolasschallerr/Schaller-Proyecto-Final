const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/tuBaseDeDatos', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB conectado');
    } catch (error) {
        console.error('Error al conectar MongoDB:', error);
        process.exit(1); 
    }
};

module.exports = connectDB;

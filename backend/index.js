const express = require('express');
const cors = require('cors');

// Estas líneas están "comentadas" (apagadas) hasta que tengas tu BD
// require('dotenv').config();
// const sequelize = require('./db');
// const rutasProductos = require('./routes/productos');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// app.use('/api/productos', rutasProductos);

// Una ruta de prueba para saber que funciona
app.get('/', (req, res) => {
  res.send('¡El servidor backend está vivo! (Esperando conexión a Base de Datos)');
});

// Arrancar el servidor ignorando la base de datos por ahora
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose perfectamente en http://localhost:${PORT}`);
    console.log(`⚠️ Nota: La conexión a MySQL está desactivada temporalmente.`);
});
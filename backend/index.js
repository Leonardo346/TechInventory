const express = require('express');
const cors = require('cors');

// ¡Ahora sí le quitamos las barras y encendemos la conexión!
require('dotenv').config();
const sequelize = require('./db');
const rutasProductos = require('./routes/productos');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Activamos las rutas de tu inventario
app.use('/api/productos', rutasProductos);

// Sincronizamos con el PostgreSQL de Supabase
sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('✅ Base de datos sincronizada correctamente con Supabase.');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error de conexión a la base de datos:', err);
  });
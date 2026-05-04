const { Sequelize } = require('sequelize');
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL || process.env.DB_URI;
if (!databaseUrl) {
  throw new Error('DATABASE_URL no está definido. Añade la URI de Supabase en backend/.env.');
}

// Conexión directa a Supabase usando URI
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;
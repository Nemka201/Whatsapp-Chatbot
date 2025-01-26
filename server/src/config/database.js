const mongoose = require('mongoose');
require('dotenv').config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 27017;
const dbName = process.env.DB_NAME || 'mychatbot';

const connectionString = `mongodb://${dbHost}:${dbPort}/${dbName}`;

mongoose.connect(connectionString)
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((e) => {
    console.error('Error de conexión a la base de datos:', e.message);
    process.exit(1); // Salir si la conexión falla
  });

const db = mongoose.connection;

module.exports = db;

require('dotenv').config();
const mysql = require('mysql2/promise');

let pool = null;
let conexion;

try {
    pool = mysql.createPool({
        connectionLimit: process.env.DB_CONNECTION_LIMIT || 10, 
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
        waitForConnections: true, 
        queueLimit: 0 
    });
    pool.getConnection()
        .then(connection => {
            console.log('¡Pool de conexiones DB conectado y listo!');
            connection.release(); 
        })
        .catch(err => {
            console.error('Error al obtener conexión inicial del pool DB:', err);
        });
    console.log("Pool de conexiones creado.");
} catch (error) {
    console.error("!!! Error CRÍTICO al crear el pool de conexiones:", error);
    pool = null; 
}

module.exports = pool;
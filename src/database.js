const mysql = require('mysql');

const {promisify} = require('util');

const {database} = require('./keys');


const pool = mysql.createPool(database); 

pool.getConnection((err,connection) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('Conexion de base de datos Cerrada');
        }

        if (err.code === 'ER_CON_COUNT_ERROR'){
            console.error('Comprobacion de cuantas conexiones tiene la BD');
        }

        if(err.code === 'ECONNREFUSED'){
            console.error('Conexion a sido Rechazada');
        }
    }

    if(connection) connection.release();
    console.log('BD Conectada');
    return; 
});
 //promisify pool querys
pool.query = promisify(pool.query);

module.exports = pool;
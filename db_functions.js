let crypto = require('crypto');
const mysql = require('mysql');

process.env.RDS_HOSTNAME = ""
process.env.RDS_USERNAME = ""
process.env.RDS_PASSWORD = ""
process.env.RDS_PORT = ""
process.env.SYSTEM_TYPE = ""
process.env.DB_NAME = ""
let con;

/**
 * Creates connection with the database
 * @param {boolean} firstConnection A boolean indicating if this is the first connection. 
 */
function connect() {
  con = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.DB_NAME
  });
  con.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log("Database dropped connection. Reconnecting...")
      handleDisconnect();
    } else {
      throw err;
    }
  });

}

connect()

// Database functions that can be called from other files ...

module.exports = {
  con: con
}
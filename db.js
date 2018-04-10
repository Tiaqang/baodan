const mysql = require('mysql')
const config = require('./config')

// auto connect if is broken
function handleError (err) {
  if (err) {
    // 如果是连接断开，自动重新连接
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      connect();
    } else {
      console.error(err.stack || err);
    }
  }
}

const database = mysql.createConnection({
  host: config.db_host,
  user: config.db_user,
  port: config.db_port,
  password: config.db_password,
  database: config.db_database,
  connectionLimit: 15,
  queueLimit: 30,
  acquireTimeout: 1000000
})

function connect () {
  db = database;
  db.connect(handleError);
  db.on('error', handleError);
}
var db;
connect();

module.exports = db

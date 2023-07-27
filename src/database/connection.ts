const mysql = require('mysql')
const { default: defaultConnection, connectionLimit, connections } = require('../config/database')


const conn = (driver ?: string) => mysql.createPool({
  connectionLimit,
  ...connections[driver || defaultConnection]
})

module.exports = { conn, pool: conn() }

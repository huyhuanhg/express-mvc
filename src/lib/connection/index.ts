import mysql from 'mysql2'
const { default: defaultConnection, connections } = require('../../config/database')

const conn = (driver?: string) => mysql.createPool(connections[driver || defaultConnection])

module.exports = conn


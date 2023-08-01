import mysql from 'mysql2'
import { default_deriver, connections } from '../../config/database'

const conn = (driver?: string) => mysql.createPool(connections[driver || default_deriver])

module.exports = conn

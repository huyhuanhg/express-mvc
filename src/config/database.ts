module.exports = {
  default: process.env.DB_CONNECTION || 'mysql',
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
  connections: {
    mysql: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
    },
  }
}

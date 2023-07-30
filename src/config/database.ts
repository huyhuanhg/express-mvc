module.exports = {
  default: process.env.DB_CONNECTION || 'mysql',
  connections: {
    mysql: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
    },
  }
}

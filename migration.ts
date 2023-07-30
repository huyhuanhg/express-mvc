const mysql = require('mysql2');
const migration = require('mysql-migrations');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
})

migration.init(connection, `${__dirname}/src/database/migrations`, () => {
  console.log("Finished running migrations!");
});

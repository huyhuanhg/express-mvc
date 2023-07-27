const migration = require('mysql-migrations');
const { pool: connection } = require('./connection')

migration.init(connection, `${__dirname}/migrations`, () => {
  console.log("Finished running migrations!");
});

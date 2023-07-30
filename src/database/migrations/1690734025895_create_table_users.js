module.exports = {
  up: `CREATE TABLE \`users\` (
    \`id\` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    \`first_name\` VARCHAR(45) NOT NULL,
    \`last_name\` VARCHAR(45) NOT NULL,
    \`username\` VARCHAR(100) NOT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    \`deleted_at\` TIMESTAMP
  );`,
  down: "DROP TABLE users;"
}

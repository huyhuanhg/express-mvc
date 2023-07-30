module.exports = {
  up: `CREATE TABLE \`tasks\` (
    \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    \`name\` VARCHAR(200) NOT NULL,
    \`policy\` VARCHAR(45) COMMENT 'PolicyEnum',
    \`status\` VARCHAR(200) COMMENT 'StatusEnum',
    \`description\` VARCHAR(2000),
    \`assigned_user_id\` INT UNSIGNED,
    \`start_date\` TIMESTAMP,
    \`due_date\` TIMESTAMP,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    \`deleted_at\` TIMESTAMP,
    CONSTRAINT \`fk_tasks_users\`
      FOREIGN KEY (\`assigned_user_id\`)
      REFERENCES \`users\` (\`id\`)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  );`,
  down: "DROP TABLE tasks;"
}

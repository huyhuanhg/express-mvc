class DB {
  constructor (table: string) {

  }

  static table(table: string): DB {
    return new this(table);
  }

  select() {
    return this;
  }

  where() {
    return this;
  }

  join() {

  }

  leftJoin() {

  }

  rightJoin() {

  }

  get() {

  }

  update() {

  }

  insert() {

  }
}

module.exports = DB

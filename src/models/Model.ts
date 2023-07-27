const db = require('./builder')
const _ = require('lodash')
var pluralize = require('pluralize')

class Model {
  _tableName?: string;
  _primary: string = 'id';
  _builder?: DB;

  _init() {
    this._builder = db.table(this._tableName || _.toLower(pluralize(_.snakeCase(this.constructor.name))))
  }

  find(id: number) {
    if (!this._builder) {
      throw Error('Error!');
    }

    return this._builder.where().get();
  }
}

module.exports = Model

import _ from 'lodash';
import { MODEL_FILTER_PATH } from '../config/app';

interface ModelGetInterface {
  fields?: string[],
  filters?: Record<string, any>,
  limit?: number,
  offset?: number
}

interface ModelCountInterface {
  filters?: Record<string, any>
}

class Model {
  _tableName?: string;
  _primary: string = 'id';
  _builder: any;
  _modelFilter: any;
  #baseBuilder = require('../lib/builder')

  _init() {
    this._builder = this.#baseBuilder.table(this._tableName || this)

    if(!this._modelFilter) {
      const className = `${this.constructor.name}Filter`

      try {
        this._modelFilter = new (require(`${MODEL_FILTER_PATH}/${className}`))(this._builder);
      } catch (e) {
        console.warn('e :>> ', e);
      }
    }
  }

  count({ filters }: ModelCountInterface = {} as ModelCountInterface) {
    if (!_.isEmpty(filters)) {
      this.filters(filters);
    }

    return this._builder.count(['*']);
  }

  find(id: number) {
    return this._builder.where(this._primary, id).get();
  }

  get({ fields, filters, limit, offset }: ModelGetInterface = {} as ModelGetInterface) {
    this._builder.select(fields || ['*']);

    if (!_.isEmpty(filters)) {
      this.filters(filters);
    }

    if (limit) {
      this._builder.limit(limit);
    }

    if (offset) {
      this._builder.offset(offset);
    }

    return this._builder.get();
  }

  insert(values: Record<string, number|string> | Record<string, number|string>[]) {
    return this._builder.insert(values);
  }

  update(attribute: string | number, values: Record<string, string|number>) {
    return this._builder.where(this._primary, attribute).update(values);
  }

  delete(id: string | number) {
    return this._builder.where(this._primary, id).delete();
  }

  filters(filters: Record<string, any>) {
    for (const field in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, field)) {
        this.#addFilter(field, filters[field])
      }
    }

    return this._builder;
  }

  newQuery() {
    return this.#baseBuilder.table(this._tableName || this);
  }

  #addFilter(field: string, value: any) {
    const method = _.camelCase(field);

    if(this._modelFilter && this._modelFilter[method]) {
      return this._modelFilter[method].bind(this._builder)(value);
    }

    if (Array.isArray(value)) {
      return this._builder.where(field, ...value);
    }

    return this._builder.where(field, value);
  }
}

module.exports = Model

import _ from "lodash";
import { MODEL_FILTER_PATH } from "../config/app";
import moment from 'moment'
import { DATE_TIME_FORMAT } from "../lib/builder/config/sql";

interface ModelGetInterface {
  fields?: string[];
  filters?: Record<string, any>;
  limit?: number;
  offset?: number;
}

interface ModelCountInterface {
  filters?: Record<string, any>;
}

class Model {
  _tableName?: string;
  _primary: string = "id";
  _builder: any;
  _modelFilter: any;
  _softDelete: string | false = "deleted_at";
  _created_at: string | false = 'created_at';
  _updated_at: string | false = 'updated_at';
  #baseBuilder = require("../lib/builder");

  _init() {
    this._builder = this.#baseBuilder.table(this._tableName || this);

    if (!this._modelFilter) {
      const className = `${this.constructor.name}Filter`;

      try {
        this._modelFilter = new (require(`${MODEL_FILTER_PATH}/${className}`))(
          this._builder
        );
      } catch (e) {
        console.warn("e :>> ", e);
      }
    }
  }

  count({ filters }: ModelCountInterface = {} as ModelCountInterface) {
    if (!_.isEmpty(filters)) {
      this.filters(filters);
    }

    return this._builder.count();
  }

  async find(id: number) {
    if (this._softDelete) {
      this._builder.whereNull(this._softDelete);
    }
    const items = await this._builder.where(this._primary, id).get()
    return items[0] || null;
  }

  get(
    {
      fields,
      filters,
      limit,
      offset,
    }: ModelGetInterface = {} as ModelGetInterface,
    force: boolean = false
  ) {
    // const query = this.newQuery();
    this._builder.select(fields || ["*"]);

    if (!_.isEmpty(filters)) {
      this.filters(filters);
    }

    if (this._softDelete && !force) {
      this._builder.whereNull(this._softDelete);
    }

    if (limit) {
      this._builder.limit(limit);
    }

    if (offset) {
      this._builder.offset(offset);
    }

    return this._builder.get();
  }

  async getFilteredPaginator(requestData: any) {
    const count = await this.count(requestData);
    const limit = requestData['limit'] || 15;

    requestData = {
      ...requestData,
      limit,
      offset: ((requestData['page'] || 1) - 1) * limit,
    }

    const items = await this.get(requestData);

    return {
      resources: {
        total: count,
        total_page: Math.ceil(count / limit),
        current: requestData['page'] || 1,
        limit
      },
      items
    }
  }

  insert(
    values: Record<string, number | string> | Record<string, number | string>[]
  ) {
    if (!this._created_at && !this._updated_at) {
      return this._builder.insert(values);
    }

    return this._builder.insert(this.#prepareInsertData(values));
  }

  update(attribute: string | number, values: Record<string, string | number>) {
    return this._builder.where(this._primary, attribute).update({
      ...values,
      ...(this._updated_at && { [this._updated_at]: moment().format(DATE_TIME_FORMAT) })
    });
  }

  delete(id: string | number, force: boolean = false) {
    if (force || !this._softDelete) {
      return this._builder.where(this._primary, id).delete();
    }

    return this._builder
      .where(this._primary, id)
      .update({
        [this._softDelete]: moment().format(DATE_TIME_FORMAT),
      });
  }

  filters(filters: Record<string, any>) {
    for (const field in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, field)) {
        this.#addFilter(field, filters[field]);
      }
    }

    return this._builder;
  }

  newQuery() {
    return this.#baseBuilder.table(this._tableName || this);
  }

  #addFilter(field: string, value: any) {
    const method = _.camelCase(field);

    if (this._modelFilter && this._modelFilter[method]) {
      return this._modelFilter[method].bind(this._builder)(value);
    }

    if (Array.isArray(value)) {
      return this._builder.where(field, ...value);
    }

    return this._builder.where(field, value);
  }

  #prepareInsertData(values: Record<string, number | string> | Record<string, number | string>[]) {
    const timestamp = moment().format(DATE_TIME_FORMAT);
    if (!Array.isArray(values)) {
      return {
        ...values,
        ...(this._updated_at && { [this._updated_at]: timestamp }),
        ...(this._created_at && { [this._created_at]: timestamp }),
      };
    }

    return values.map(v => ({
      ...v,
      ...(this._updated_at && { [this._updated_at]: timestamp }),
      ...(this._created_at && { [this._created_at]: timestamp }),
    }))
  }
}

module.exports = Model;

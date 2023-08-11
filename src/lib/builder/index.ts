import _, { keys } from "lodash";
import pluralize from "pluralize";
import { WhereBuilderInterface } from "./interfaces/WhereBuilderInterface";
import BuilderHelper from "./helper/sql";
import { default_deriver, connections } from '../../config/database'

class DB implements WhereBuilderInterface {
  #mysql = require("../connection");
  #whereBuilder = require("./WhereBuilder");
  #connection = default_deriver;

  #table: string;
  #select: string[] = ["*"];
  #joins: any;
  #groups: any;
  #havings: any;
  #orders: Record<"field" | "direction", string>[] = [];
  #limit: any;
  #offset: any;

  constructor(table: string) {
    this.#table = table;
  }

  connection(connection: string) {
    if (!connections.connection) {
      throw new Error("Database connect do not support!");
    }

    this.#connection = connection;

    return this;
  }

  static table(table: any): DB {
    return new this(
      _.isObject(table)
        ? _.toLower(_.snakeCase(pluralize(table.constructor.name)))
        : table
    );
  }

  select(fields: string[] = ["*"]) {
    this.#select = fields;

    return this;
  }

  where() {
    this.#whereBuilder.where(...arguments);

    return this;
  }

  orWhere() {
    this.#whereBuilder.orWhere(...arguments);

    return this;
  }

  whereNull() {
    this.#whereBuilder.whereNull(...arguments);

    return this;
  }

  orWhereNull() {
    this.#whereBuilder.orWhereNull(...arguments);

    return this;
  }

  whereNotNull() {
    this.#whereBuilder.whereNotNull(...arguments);

    return this;
  }

  orWhereNotNull() {
    this.#whereBuilder.orWhereNotNull(...arguments);

    return this;
  }

  whereIn() {
    this.#whereBuilder.whereIn(...arguments);

    return this;
  }

  oWhereIn() {
    this.#whereBuilder.oWhereIn(...arguments);

    return this;
  }

  whereNotIn() {
    this.#whereBuilder.whereNotIn(...arguments);
  }

  oWhereNotIn() {
    this.#whereBuilder.oWhereNotIn(...arguments);

    return this;
  }

  join() {}

  leftJoin() {}

  rightJoin() {}

  order(field: string, direction: "DESC" | "ASC" = "ASC") {
    this.#orders.push({ field, direction });

    return this;
  }

  limit(limit: number) {
    this.#limit = limit;
  }

  offset(offset: number) {
    this.#offset = offset;
  }

  async count(select: string = "*") {
    const [result, field] = await this.#mysql(this.#connection).query(this.#parseGet(select));

    return result[0][`COUNT(${select})`] || null;
  }

  async get() {
    const [result, field] = await this.#mysql(this.#connection).query(this.#parseGet());

    return result;
  }

  async insert(
    values: Record<string, number | string> | Record<string, number | string>[]
  ) {
    const formatData: { keys: string[]; values: (string | number)[][] } =
      this.#formatInsertData(values);

    const query = `INSERT INTO ${
      this.#table
    } ${BuilderHelper.prepareStringValue(
      formatData.keys,
      "`"
    )} VALUES ${formatData.values
      .map((v) => BuilderHelper.prepareStringValue(v))
      .join(", ")};`;

    const [result, field] = await this.#mysql(this.#connection).query(query);

    return result;
  }

  update(values: Record<string, number | string>) {
    const formatData: string[] = this.#formatUpdateData(values);

    const whereRaw = this.#whereBuilder.parse();
    const whereSql = whereRaw ? ` WHERE ${whereRaw}` : "";

    const query = `UPDATE ${this.#table} SET ${formatData.join(", ")}${whereSql};`;

    console.log('query :>> ', query);
    // return this.#mysql(this.#connection).query(query);
  }

  delete() {
    const whereRaw = this.#whereBuilder.parse();
    const whereSql = whereRaw ? ` WHERE ${whereRaw}` : "";

    const query = `DELETE FROM ${this.#table}${whereSql};`;

    console.log('query :>> ', query);
    // return this.#mysql(this.#connection).query(query);
  }

  #parseGet(countField?: string) {
    const selectSql = countField
      ? `COUNT(${countField})`
      : this.#select.map((select) => `${select}`).join(", ");

    const whereRaw = this.#whereBuilder.parse();
    const whereSql = whereRaw ? ` WHERE ${whereRaw}` : "";

    const orderBySql = _.isEmpty(this.#orders)
      ? ""
      : ` ORDER BY ${this.#orders
          .map((orderBy) => `${orderBy.field} ${orderBy.direction}`)
          .join(", ")}`;

    const limitSql = this.#limit ? ` LIMIT ${this.#limit}` : "";
    const offsetSql = this.#offset ? ` OFFSET ${this.#offset}` : "";

    return `SELECT ${selectSql} FROM ${
      this.#table
    }${whereSql}${orderBySql}${limitSql}${offsetSql};`;
  }

  #formatInsertData(
    values: Record<string, number | string> | Record<string, number | string>[]
  ) {
    const keys: string[] = Array.isArray(values)
      ? Object.keys(values[0])
      : Object.keys(values);
    const valueResult: (string | number)[] | (string | number)[][] = Array.isArray(
      values
    )
      ? values.map((v) => Object.values(v))
      : [Object.values(values)];

    return {
      keys,
      values: valueResult,
    };
  }

  #formatUpdateData(values: Record<string, number | string>): string[] {
    return Object.keys(values).map(
      (k) =>
        `${BuilderHelper.prepareStringValue(
          k,
          "`"
        )} = ${BuilderHelper.prepareStringValue(values[k])}`
    );
  }
}

module.exports = DB;

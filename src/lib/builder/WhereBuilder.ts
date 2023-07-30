import _ from "lodash";
import { WhereBuilderInterface } from "./interfaces/WhereBuilderInterface";
import BuilderHelper from "./helper/sql";

type WhereBuilderRelation = "AND" | "OR" | "and" | "or";
type WhereBuilderValue = string | number | (number | string)[];
type WhereBuilderOperator =
  | "="
  | ">"
  | "<"
  | ">="
  | "<="
  | "<>"
  | "LIKE"
  | "IS NULL"
  | "IS NOT NULL"
  | "IN"
  | "NOT IN"
  | "EXIST";

class WhereBuilder implements WhereBuilderInterface {
  #conditions: any = {
    AND: [],
    OR: []
  };

  where() {
    this.add("AND", ...arguments);

    return this;
  }

  orWhere() {
    this.add("OR", ...arguments);

    return this;
  }

  whereNull(field: string) {
    this.#conditions.AND.push({
      operator: 'IS NULL',
      field,
    })

    return this;
  }

  orWhereNull(field: string) {
    this.#conditions.OR.push({
      operator: 'IS NULL',
      field,
    })

    return this;
  }

  whereNotNull(field: string) {
    this.#conditions.AND.push({
      operator: 'IS NOT NULL',
      field,
    })

    return this;
  }

  orWhereNotNull(field: string) {
    this.#conditions.OR.push({
      operator: 'IS NOT NULL',
      field,
    })

    return this;
  }

  whereIn(field: string, value: (string | number)[]) {
    this.#conditions.AND.push({
      operator: 'IN',
      field,
      value
    })

    return this;
  }

  oWhereIn(field: string, value: (string | number)[]) {
    this.#conditions.OR.push({
      operator: 'IN',
      field,
      value
    })

    return this;
  }

  whereNotIn(field: string, value: (string | number)[]) {
    this.#conditions.AND.push({
      operator: 'NOT IN',
      field,
      value
    })

    return this;
  }

  oWhereNotIn(field: string, value: (string | number)[]) {
    this.#conditions.OR.push({
      operator: 'NOT IN',
      field,
      value
    })

    return this;
  }

  add(relation: WhereBuilderRelation, ...args: any) {
    if (args.length === 0) {
      throw new Error("SQL where Error!");
    }

    if (args.length === 1 && typeof args[0] === "function") {
      this.#addWhereGroup(relation, args[0]);
      return;
    }

    let operator = "=";
    const value = args[2] !== undefined ?  args[2] : args[1]

    this.#addWhereGeneral(args[0], value, relation, operator as WhereBuilderOperator);
  }

  addRaw(raw: string, relation: WhereBuilderRelation = "AND") {
    this.#conditions[relation].push({
      raw,
    });
  }

  parse() {
    const andWhere = this.#conditions.AND.map((whereCondition: any) => this.#mapping(whereCondition));
    const orWhere = this.#conditions.OR.map((whereCondition: any) => this.#mapping(whereCondition));

    return `${andWhere.join(' AND ')}${_.isEmpty(orWhere) ? '' : ` OR ${orWhere.join(' OR ')}`}`.trim();
  }

  #mapping(whereCondition: any) {
    if(whereCondition.hasOwnProperty('raw')) {
      return whereCondition.raw;
    }

    if(whereCondition.hasOwnProperty('closure')) {
      return `(${whereCondition.closure.parse()})`;
    }

    if(whereCondition.hasOwnProperty('value')) {
      const value = BuilderHelper.prepareStringValue(whereCondition.value);

      return `\`${whereCondition.field}\` ${whereCondition.operator} ${value}`;
    }

    return `\`${whereCondition.field}\` ${whereCondition.operator}`;
  }

  #addWhereGeneral(
    field: string,
    value: WhereBuilderValue,
    relation: WhereBuilderRelation,
    operator: WhereBuilderOperator = "="
  ) {
    this.#conditions[relation].push({
      value,
      operator,
      field,
    });
  }

  #addWhereGroup(
    relation: WhereBuilderRelation,
    callback: Function
  ) {
    this.#conditions[relation].push({
      closure: callback(new WhereBuilder),
    });
  }
}

module.exports = new WhereBuilder();

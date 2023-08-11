import _ from "lodash";

export default class BuilderHelper {
  static prepareStringValue(value: string | number | (string | number)[], quote: '`' | '\'' = '\'')
  {
    if (value === undefined || value === null) {
      return 'NULL';
    }

    if (typeof value !== 'string' && ! _.isArray(value)) {
      return value;
    }

    if (typeof value === 'string') {
      return `${quote}${value.replace(/(`|'|\\)/, '\\$1')}${quote}`;
    }

    return `(${value.map((v) => {
      if (v === undefined || v === null) {
        return 'NULL';
      }

      if (typeof v !== 'string') {
        return v;
      }

      return `${quote}${v.replace(/(`|'|\\)/, '\\$1')}${quote}`;
    }).join(', ')})`
  }
}

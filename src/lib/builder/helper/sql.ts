import _ from "lodash";

export default class BuilderHelper {
  static prepareStringValue(value: string | number | (string | number)[], quote: '`' | '\'' = '\'')
  {
    if (typeof value === 'number') {
      return value;
    }

    if (! _.isArray(value)) {
      return `${quote}${value.replace('\'', '\\\'').replace('\`', '\\\`')}${quote}`;
    }

    return `(${value.map((v) => {
      if (typeof v === 'number') {
        return v;
      }

      return `${quote}${v.replace('\'', '\\\'')}${quote}`;
    }).join(', ')})`
  }
}

export function getRowAsInt(coordinate) {
  return parseInt(coordinate.charAt(1), 10);
}

export function isOdd(n) {
  return Math.abs(n % 2) === 1;
}

export function getColAsInt(columns, coordinate) {
  return columns[coordinate.charAt(0)];
}

export function getRowAsAlph(columns, columnInt) {
  for (let key in columns) {
    if (!columns.hasOwnProperty(key)) {
      continue;
    }

    if (columnInt === columns[key]) {
      return key;
    }
  }

  return false;
}

export function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}
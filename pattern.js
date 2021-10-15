let noMatch = Symbol(); // this ensures that `undefined` doesn't creep in if match[key] is literally undefined.

function objWithKeys(match) {
  return function(obj) {
    let doMatch = true;
    for (let key in match) {

      let matchValue = noMatch;
      let functionMatch = false;

      if (typeof match[key] === 'function') {
        functionMatch = match[key](obj[key])
      } else if (typeof match[key] === 'object') {
        functionMatch = objWithKeys(match[key])(obj[key])
      } else {
        matchValue = match[key]
      }

      if ((obj && obj.hasOwnProperty(key) && obj[key] === matchValue && matchValue !== noMatch) || functionMatch) {
        // nop, they match
      } else {
        doMatch = false
      }
    }

    return doMatch;
  }
}

const Pattern = {
  integer: (n) => Number.isInteger(n),
  number: (n) => typeof n === 'number',
  anyValue: (n) => n !== null && n !== undefined,
  string: (s) => typeof s === 'string',
  objWithKeys: objWithKeys
}

export { Pattern };
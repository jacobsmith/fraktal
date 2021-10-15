let noMatch = Symbol(); // this ensures that `undefined` doesn't creep in if match[key] is literally undefined.

function objWithKeys(match, child) {
  return function(obj) {
    if (child) {
      if (Array.isArray(obj) && Array.isArray(match)) {
        return arraysMatch(match)(obj);
      }
    }

    // short-circuit arrays because javascript arrays are technically objects
    if (Array.isArray(obj) || Array.isArray(match)) {
      return false;
    }

    let doMatch = true;
    for (let key in match) {

      let matchValue = noMatch;
      let functionMatch = false;

      if (typeof match[key] === 'function') {
        functionMatch = match[key](obj[key])
      } else if (typeof match[key] === 'object') {
        functionMatch = objWithKeys(match[key], true)(obj[key])
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

const arraysMatch = (match) => {
  return (arg) => {
    let doMatch = true;
    for (let i = 0; i < match.length; i++) {
      if (typeof match[i] === 'function') {
        doMatch = match[i](arg[i])
      } else if (typeof match[i] === 'object') {
        doMatch = objWithKeys(match[i], arg[i])
      } else if (match[i] !== arg[i]) {
        doMatch = false;
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
  objWithKeys: objWithKeys,
  arraysMatch: arraysMatch,
}

export { Pattern };
function objWithKeys(match) {
  return function(obj) {
    let doMatch = true;
    for (let key in match) {

      let matchValue;
      let functionMatch = false;

      if (typeof match[key] === 'function') {
        functionMatch = match[key](obj[key])
      } else if (typeof match[key] === 'object') {
        functionMatch = objWithKeys(match[key])(obj[key])
      } else {
        matchValue = match[key]
      }

      if ((obj && obj.hasOwnProperty(key) && obj[key] === matchValue) || functionMatch) {
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
  number: (n) => !isNaN(n) && !JPM.integer(n),
  anyValue: (n) => n !== null && n !== undefined,
  objWithKeys: objWithKeys
}


let functionProxyHandler = {
  set: (obj, prop, value) => {
    obj.functions = obj.functions || {};
    obj.functions[prop] = obj.functions[prop] || [];
    obj.functions[prop].push(value);
    return true;
  },
  get: (obj, prop, value) => {
    return (args) => {
      let handled = false;
      for (let i = 0; i < obj.functions[prop].length; i++) {
        let { match, func } = obj.functions[prop][i]
        if (match(args)) {
          handled = true;
          return func(args)
        }
      }

      if (!handled) {
        throw "Not handled! " + JSON.stringify(args)
      }
    }
  }
}

export { functionProxyHandler, objWithKeys, Pattern }
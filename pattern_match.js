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

      let matchValue;
      let functionMatch = false;

      if (typeof match[key] === 'function') {
        functionMatch = match[key](obj[key])
      } else if (typeof match[key] === 'object') {
        functionMatch = objWithKeys(match[key], true)(obj[key])
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
      if (obj.functions.initializeReactHooks) {
        obj.functions.initializeReactHooks[0](args)
      }

      let handled = false;
      for (let i = 0; i < obj.functions[prop].length; i++) {
        let { match, func } = obj.functions[prop][i]
        let matchFn = match;

        if (Array.isArray(match)) {
          matchFn = arraysMatch(match);
        } else if (typeof match == 'object') {
          matchFn = objWithKeys(match)
        }

        if (matchFn(args)) {
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
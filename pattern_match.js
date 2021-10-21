import { Pattern } from './pattern';

let functionProxyHandler = {
  set: (obj, prop, value) => {
    obj.functions = obj.functions || {};
    obj.functions[prop] = obj.functions[prop] || [];

    if (Array.isArray(value)) {
      if (Array.isArray(value[0])) {
        value.map(v => obj.functions[prop].push({ match: v[0], func: v[1] }))
      } else {
        obj.functions[prop].push({ match: value[0], func: value[1] })
      }
    } else {
      obj.functions[prop].push(value);
    }

    return true;
  },
  get: (obj, prop, value) => {
    let aritiesMatch = true;
    return function (args) {
      if (obj.functions.initializeReactHooks) {
        obj.functions.initializeReactHooks[0](args);
      }

      let handled = false;
      for (let i = 0; i < obj.functions[prop].length; i++) {
        let { match, func } = obj.functions[prop][i];
        let matchFn = match;

        if (Array.isArray(match)) {
          matchFn = Pattern.arraysMatch(match);
        } else if (typeof match == 'object') {
          matchFn = Pattern.objWithKeys(match);
        }

        if (arguments.length == 1) {
          if (matchFn.length !== arguments.length) {
            handled = false;
            aritiesMatch = false;
          } else if (matchFn(args)) {
            handled = true;
            return func(args);
          }
        } else {
          // handle a variable number of arguments, i.e., (first, second) => 'foo'
          if (matchFn.length !== arguments.length) {
            handled = false;
            aritiesMatch = false;
          } else if (matchFn(...arguments)) {
            handled = true;
            return func(...arguments);
          }
        }

      }

      if (!handled) {
        throw "Not handled! " + JSON.stringify(args);
      }
    }
  }
}

export { functionProxyHandler }
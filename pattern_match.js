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

export { functionProxyHandler }
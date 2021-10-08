import { functionProxyHandler, objWithKeys, Pattern } from "./pattern_match";
  
let func = new Proxy({}, functionProxyHandler)

beforeAll(() => {
  func.call = { match: x => x === 'obj' , func: () => {
    return 'object';
  }};

  func.call = { match: x => (typeof x === 'string'), func: () => {
    return 'any string';
  }};

  func.call = { match: objWithKeys({ admin: true }), func: () => {
    return 'admin is true';
  }};

  func.call = { match: objWithKeys({ student: Pattern.anyValue }), func: () => {
    return 'student';
  }};

  func.call = { match: 
    objWithKeys(
      { data: {
         loading: false 
      }}
    ), func: () => {
    return 'not loading'
  }};
  
  func.call = { match: objWithKeys(
    { 
      data: { loading: true }
    }), 
    func: () => { return 'loading' }
  };

  func.fibonacci = { match: n => n === 1, func: i => 1 }
  func.fibonacci = { match: n => n === 2, func: i => 1 }
  func.fibonacci = { match: Pattern.integer, func: i => {
    return (func.fibonacci(i - 1) + func.fibonacci(i - 2)) 
  }}
})

test('can match a string literal', () => {
	expect(func.call('obj')).toEqual('object')
})

test('can match any string', () => {
	expect(func.call('hello')).toEqual('any string')
	expect(func.call('hello world')).toEqual('any string')
	expect(func.call('foobar')).toEqual('any string')
	expect(func.call('')).toEqual('any string')
})

test('can match an object with a key', () => {
  expect(func.call({ admin: true })).toEqual('admin is true')
  expect(() => func.call({ admin: false })).toThrow('Not handled! {"admin":false}')
})

test('can match an object with any value', () => {
  expect(func.call({ student: true })).toEqual('student')
  expect(func.call({ student: 1 })).toEqual('student')
  expect(func.call({ student: {} })).toEqual('student')
  expect(() => func.call({ student: null })).toThrow('Not handled! {"student":null}')
})

test('can match deeply nested objects', () => {
  expect(func.call({ data: { loading: false }})).toEqual('not loading');
  expect(func.call({ data: { loading: true }})).toEqual('loading');
})

test('it can compute fibonacci sequence', () => {
  expect(func.fibonacci(1)).toEqual(1)
  expect(func.fibonacci(2)).toEqual(1)
  expect(func.fibonacci(3)).toEqual(2)
  expect(func.fibonacci(10)).toEqual(55)
})
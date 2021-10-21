import { Fraktal, Pattern } from './index';

const _ = Pattern.anyValue;

let func = Fraktal();

test('can match a string literal', () => {
  func.call = { match: x => x === 'obj' , func: () => {
    return 'object';
  }};

  expect(func.call('obj')).toEqual('object')
})

test('can match any string', () => {
  func.call = { match: x => (typeof x === 'string'), func: () => {
    return 'any string';
  }};

	expect(func.call('hello')).toEqual('any string')
	expect(func.call('hello world')).toEqual('any string')
	expect(func.call('foobar')).toEqual('any string')
	expect(func.call('')).toEqual('any string')
})

test('can match an object with a key', () => {
  func.call = { match: Pattern.objWithKeys({ admin: true }), func: () => {
    return 'admin is true';
  }};
  
  expect(func.call({ admin: true })).toEqual('admin is true')
  expect(() => func.call({ admin: false })).toThrow('Not handled! {"admin":false}')
})

test('can match an object with any value', () => {
  func.call = { match: Pattern.objWithKeys({ student: Pattern.anyValue }), func: () => {
    return 'student';
  }};

  expect(func.call({ student: true })).toEqual('student')
  expect(func.call({ student: 1 })).toEqual('student')
  expect(func.call({ student: {} })).toEqual('student')
  expect(() => func.call({ student: null })).toThrow('Not handled! {"student":null}')
})

test('can match deeply nested objects', () => {
  func.call = { match: 
    Pattern.objWithKeys(
      { data: {
         loading: false 
      }}
    ), func: () => {
    return 'not loading'
  }};
  
  func.call = { match: Pattern.objWithKeys(
    { 
      data: { loading: true }
    }), 
    func: () => { return 'loading' }
  };
  
  expect(func.call({ data: { loading: false }})).toEqual('not loading');
  expect(func.call({ data: { loading: true }})).toEqual('loading');
})

test('it can compute fibonacci sequence', () => {
  func.fibonacci = { match: n => n === 1, func: i => 1 }
  func.fibonacci = { match: n => n === 2, func: i => 1 }
  func.fibonacci = { match: Pattern.integer, func: i => {
    return (func.fibonacci(i - 1) + func.fibonacci(i - 2)) 
  }}

  expect(func.fibonacci(1)).toEqual(1)
  expect(func.fibonacci(2)).toEqual(1)
  expect(func.fibonacci(3)).toEqual(2)
  expect(func.fibonacci(10)).toEqual(55)
})

test('it can match an object with a value of null, i.e., { data: null }', () => {
  let t = Fraktal();

  t.test = { match: { data: null }, func: () => 'null data' };

  expect(t.test({ data: null })).toEqual('null data');
})

test('it can differentiate between arrays and objects', () => {
  let t = Fraktal();
  t.test = { match: {}, func: () => 'empty object' };
  t.test = { match: [], func: () => 'empty array' };

  expect(t.test({})).toEqual('empty object');
  expect(t.test([])).toEqual('empty array');
})

test('it can differentiate between nested arrays and objects', () => {
  let t = Fraktal();
  t.test = { match: { data: {} }, func: () => 'empty object' };
  t.test = { match: { data: [ Pattern.integer ] }, func: () => 'empty array' };
  t.test = { match: { data: [ {} ] }, func: () => 'obj in array' };

  expect(t.test({ data: {} })).toEqual('empty object');
  expect(t.test({ data: [1] })).toEqual('empty array');
  expect(t.test({ data: [{}] })).toEqual('obj in array');
})

test('you can optionally define matches with array syntax', () => {
  let t = Fraktal();
  t.test = [Pattern.integer, () => 'yes!'];

  expect(t.test(1)).toEqual('yes!')
})

test('you can optionally define multiple matches with array syntax', () => {
  let t = Fraktal();
  t.test = [
    [(a) => a == 4, () => 'you passed 4'],
    [Pattern.integer, () => 'yes!'],
  ];

  expect(t.test(4)).toEqual('you passed 4')
  expect(t.test(1)).toEqual('yes!')
})

test('you can accept any value with _', () => {
  let t = Fraktal();
  t.test = [
    [Pattern.integer, () => 'Integer!'],
    [_, () => 'Not an integer']
  ];

  expect(t.test(1)).toEqual('Integer!');
  expect(t.test({})).toEqual('Not an integer');
})

test('you can do arity matching with _', () => {
  let t = Fraktal();
  t.test = [
    [[1, _], () => '1'],
    [[2, _], () => '2']
  ];

  expect(t.test([1, 'foo'])).toEqual('1')
  expect(t.test([2, 3])).toEqual('2')
})

test('variable injection', () => {
  let t = Fraktal();
  t.test = [
    { name: Pattern.string, occupation: _ }, ({ name, occupation }) => [name, occupation]
  ]

  expect(t.test({name: "Jacob", occupation: 4})).toEqual(["Jacob", 4])
})

test('named entities not in object', () => {
  let t = Fraktal();
  t.test = [
    [(a, b) => Pattern.string(a) && Pattern.integer(b), (name, int) => [name, int]],
    [(a, b, _) => Pattern.string(a) && Pattern.integer(b), (name, int, _) => [name, int, _]], 
  ]

  expect(t.test("hello", 4)).toEqual(["hello", 4])
  expect(t.test("hello", 4, 5)).toEqual(["hello", 4, 5])
  expect(t.test("goodbye", 6, {})).toEqual(["goodbye", 6, {}])
})
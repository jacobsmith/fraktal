import Pipe from './pipe';

test("it passes data through", () => {
	let result = new Pipe(123)
               .pipe(n => n + 1)
               .value

  expect(result).toEqual(124)
})

test("it can perform string manipulation", () => {
	let result = new Pipe('abc')
               .pipe(n => n.toUpperCase())
               .pipe(n => n + '123')
               .value

  expect(result).toEqual('ABC123')
})
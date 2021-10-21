# Fraktal

Fraktal is a pattern-matching library for JavaScript that is inspired by Elixir. It can perform pattern-matching and includes support for nested objects.

## Installation

`npm install fraktal`

## Usage

```js
import { Fraktal } from 'fraktal';

const func = Fraktal();

func.render = {
  match: { loading: true },
  func: () => {
    return 'This data is still loading...';
  }
}

func.render = {
  match: { loading: false },
  func: (o) => {
    return 'Your data is now loaded! ' + o.data;
  }
}

let response = { loading: true }
func.render(response) // #> 'This data is still loading...'

response = { loading: false, data: 123 }
func.render(response) // #> 'Your data is now loaded! 123'
```

This can also be written as:

```js
import { Fraktal } from 'fraktal';

const func = Fraktal();

func.render = [
  [{ loading: true }, () => 'The data is still loading...'],
  [{ loading: false }], (arg) => 'Your data is now loaded! ' + arg.data]
]

let response = { loading: true }
func.render(response) // #> 'This data is still loading...'

response = { loading: false, data: 123 }
func.render(response) // #> 'Your data is now loaded! 123'
```

Both syntaxes are equivalent functionally, but one or the other may be more suited for the way you tend to work with data in your application.

Fraktal utilizes the javascript Proxy object to intercept calls and keep track of which function to execute depending on the matching of the patterns.

Each function you define takes 2 arguments: a `match` and a `func`. The `match` is a function that must return `true` if the pattern should match. Fraktal comes with some built-in matchers on the `Pattern` object, such as `Pattern.objWithKeys` for matching objects or deeply nested objects. However, you can also define custom matchers for your given domain. For example:

```js
const func = Fraktal();

func.render = {
  match: (arg) => arg.datetime < new Date(),
  func: () => {
    return 'This is in the past.';
  }
}
```

## Function Arity

In the `match` function, Fraktal will match on arity (that is, number of arguments). So:

```js
  let t = Fraktal();
  t.test = [
    [(a, b) => Pattern.string(a) && Pattern.integer(b), (name, int) => [name, int]],
    [(a, b, _) => Pattern.string(a) && Pattern.integer(b), (name, int, _) => [name, int, _]], 
  ]

  expect(t.test("hello", 4)).toEqual(["hello", 4])
  expect(t.test("hello", 4, 5)).toEqual(["hello", 4, 5])
  expect(t.test("goodbye", 6, {})).toEqual(["goodbye", 6, {}])
```

## React integration

Fraktal also works with React, including React Hooks. If there are any hooks you wish to execute, define `initializeReactHooks` on your Fraktal instance.

```js
import { Fraktal } from 'fraktal';
import { useEffect, useState } from 'react';

const pme = Fraktal({ react: true });

let counter, setCounter;
const InitializeReactHooks = (props) => {
    [counter, setCounter] = useState(0);
    useEffect(() => console.log('fires once'), [])
    useEffect(() => console.log('props changed'), [props])
}

pme.initializeReactHooks = InitializeReactHooks;

const increment = () => {
  setCounter(c => c + 1)
}

pme.render = [
  [() => counter % 2 === 0, () => (
    <div>
      { counter } is an even number
      <button onClick={ increment }>Increment</button>
    </div>
  )],
  [{ data: true }, () => (
      <div>
          Got data! { counter }
          <button onClick={ increment }>Increment</button>
      </div>
  )],
  [{ data: false }, () => (
      <div>
          <div>No data... { counter }</div>
          <button onClick={ increment }>Increment</button>
      </div>
  )],
  [{ data: null }, () => (
      <div>Null data</div>
  )]
]

export default pme.render;
```

For now, you will need to declare any hook variables outside the scope of Fraktal. This allows the hook varaibles (like `counter` and `setCounter` in the example above) to be in scope of all of the pattern-matched functions without having to destructure arguments each time. In order to prevent polluting the global scope, you can also wrap all definitions inside an IIFE (immediately invoking function expression).

```js
const pme = new Fraktal();

(function() {
  let counter, setCounter;

  const InitializeReactHooks = (props) => {
    [counter, setCounter] = useState(0);
  }

  pme.initializeReactHooks = InitializeReactHooks;

  pme.render = [Pattern.integer, (i) => (
    <>
      <div>The current value is: {i}</div>
      <button onClick={ () => setCounter(c => c + 1) }>Increment</button>
    </>
  )]
})()

export default pme.render;
```

The way hooks work is that we execute them before every function to be pattern matched, similar to how React typically fires them before every render. React still manages all state, so the normal rules of hooks apply (i.e., they can't be fired conditionally, etc.). However, by declaring them outside of the functions that perform the rendering, the "rules" of hooks should be easier to follow.

## Pipes

Inspired by Elixir, Fraktal also supports a Pipe operator, which takes a value and passes it to subsequent functions. So, instead of:

```js
let temp = 'a.b.c'
temp = temp.toUpperCase()
temp = temp.split()
temp = temp.join('-')
temp // 'A-B-C'
```

you can instead write:

```js
new Pipe('a.b.c')
    .pipe(n => n.toUpperCase())
    .pipe(n => n.split())
    .pipe(n => n.join('-'))
    .value // 'A-B-C'
```

While a Pipe for simple string manipulation like above may be overkill, they can prove very useful when doing a set of data manipulations.
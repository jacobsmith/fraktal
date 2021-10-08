# Fraktal

Fraktal is a pattern-matching library for JavaScript that is inspired by Elixir. It can perform pattern-matching and includes support for nested objects.

## Usage

```
import { Fraktal } from 'fraktal';

const func = Fraktal();

func.render = {
  match: objWithKeys({ loading: true }),
  func: () => {
    return 'This data is still loading...';
  }
}

func.render = {
  match: objWithKeys({ loading: false }),
  func: (o) => {
    return 'Your data is now loaded! ' + o.data;
  }
}

let response = { loading: true }
func.render(response) // #> 'This data is still loading...'

response = { loading: false, data: 123 }
func.render(response) // #> 'Your data is now loaded! 123'
```

Fraktal utilizes the javascript Proxy object to intercept calls and keep track of which function to execute depending on the matching of the patterns.

Each function you define takes 2 arguments: a `match` and a `func`. The `match` is a function that must return `true` if the pattern should match. Fraktal comes with some built-in matchers on the `Pattern` object, such as `Pattern.objWithKeys` for matching objects or deeply nested objects. However, you can also define custom matchers for your given domain. For example:

```
const func = Fraktal();

func.render = {
  match: (arg) => arg.datetime < new Date(),
  func: () => {
    return 'This is in the past.';
  }
}
```

## Pipes

Inspired by Elixir, Fraktal also supports a Pipe operator, which takes a value and passes it to subsequent functions. So, instead of:

```
let temp = 'a.b.c'
temp = temp.toUpperCase()
temp = temp.split()
temp = temp.join('-')
temp // 'A-B-C'
```

you can instead write:

```
new Pipe('a.b.c')
    .pipe(n => n.toUpperCase())
    .pipe(n => n.split())
    .pipe(n => n.join('-))
    .value // 'A-B-C'
```

While a Pipe for simple string manipulation like above may be overkill, they can prove very useful when doing a set of data manipulations.
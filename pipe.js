class Pipe {
  static inspect(value) {
    console.log(value);
    return value;
  }

  constructor(value) {
    this.value = value;
  }

  pipe(fn) {
    this.value = fn(this.value)
    return this;
  }
}

export default Pipe;
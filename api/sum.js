function sum(...args) {
  if (args.some(arg => typeof arg !== 'number')) {
    throw new TypeError('sum() expects only numbers.');
  }
  return args.reduce((acc, curr) => acc + curr, 0);
}

module.exports = sum;

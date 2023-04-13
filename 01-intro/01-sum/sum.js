function sum(a, b) {
  
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new TypeError('Not a number!');
  } else {
    return a + b;
  }
}

module.exports = sum;

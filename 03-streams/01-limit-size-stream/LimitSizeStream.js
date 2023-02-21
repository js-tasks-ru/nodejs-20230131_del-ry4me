const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');


class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.i = 0
  }

  _transform(chunk, encoding, callback) {
    this.i = this.i + Buffer.from(chunk).length;
    console.log(this.i);
    if (this.i <= this.limit) {
      callback(null, chunk);
    } else {
      callback(new LimitExceededError());
    }

  }
}

module.exports = LimitSizeStream;

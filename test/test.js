const enc = require('../index');
const assert = require('assert');

function median(values) {
  if (values.length === 0) throw new Error("No inputs");

  values.sort(function (a, b) {
    return a - b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2)
    return values[half];

  return (values[half - 1] + values[half]) / 2.0;
}

describe('Valid seed hash', function () {
  it('Should make sure that the seed hash matches', function () {
    let seed = enc.generateSeed();
    assert.equal(enc.verifyHash(seed.seed, seed.h_seed), true)
  });
});

describe('Even distribution', function () {
  this.timeout(240000)
  it('Should generate 10M dice rolls and check that median is within range', function (done) {
    let counter = 0;
    let results = [];
    let server_seed = enc.generateSeed();
    let client_seed = enc.generateSeed();

    function run() {
      let result = enc.roll(server_seed.seed, client_seed.seed, counter);
      results.push(result.result_short_int);
      if (counter < 10000000) {
        counter++;
        setImmediate(function () {
          run();
        })
      } else {
        let med = median(results);
        if (med > 49.95 && med < 50.05) {
          return done();
        } else {
          return done(new Error(med));
        }
      }
    }
    run();
  });
})
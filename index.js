const crypto = require('crypto');

function generateSeed() {
  let seed = crypto.createHash('sha512').update(crypto.randomBytes(128).toString('hex')).digest('hex');
  return {
    seed,
    h_seed: crypto.createHash('sha512').update(seed).digest('hex'),
  }
}

function findPrefix(hex) {
  let arr = hex.split("");
  let prefix = arr.splice(0, 5).join("");
  let prefix_long_int = parseInt(prefix, 16);
  let prefix_short_int = (prefix_long_int % 10000) / 100;

  if (prefix_long_int > 999999) {
    return findPrefix(arr.join(""));
  } else {
    return {
      prefix,
      prefix_long_int,
      prefix_short_int
    }
  }
}

function roll(server_seed, client_seed, nonce) {
  let h_server_seed = crypto.createHash('sha512').update(server_seed).digest('hex');
  let result_hash = crypto.createHmac('sha512', `${server_seed}`).update(`${client_seed}|${nonce}`).digest('hex');
  let prefix = findPrefix(result_hash);
  let output = {
    server_seed,
    client_seed,
    nonce,
    h_server_seed,
    result_hash,
    result_prefix: prefix.prefix,
    result_long_int: prefix.prefix_long_int,
    result_short_int: prefix.prefix_short_int
  }
  return output
}

function verifyHash(seed, hash) {
  return crypto.createHash('sha512').update(seed).digest('hex') == hash
}

module.exports = {
  generateSeed,
  roll,
  verifyHash
}
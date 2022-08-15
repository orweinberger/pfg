## PFG (Provably Fair Gambling)

This is a small library that allows you to generate a random seed and along with a client seed and a nonce create a 'roll' and get a random number between 0 - 99.99.

1. The server generates a seed using the `generateSeed` function, the function returns a random SHA512 hash and a SHA512 hash of the result hash.
2. The user selects a `client_seed` and a `nonce`.
3. The `roll` function will take the `server_seed`, `client_seed` and `nonce` and will generate a SHA512-HMAC hash, then the first 5 characters of the result hash will be converted to decimal. If the result is over 999,999 we will use the next 5 characters of the result hash. We will then calculate the following `(num % 10000)/100` to get a number between 0 and 99.99.

### Notes

1. The idea is to display the `server_h_seed` to the user, but only show `server_seed` when we complete the session. The user can verify the bets by comparing the `server_h_seed` that was displayed before the session ended to the actual SHA512 hash of the `server_seed` once the session completed and you discard that seed.

2. If the user knows the `server_seed` before we end the session he can calculate results before placing the bets, using only winning nonces for example.

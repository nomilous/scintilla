var Account = require('./account');
var Keystore = require('./keystore');
var EthereumTx = require('ethereumjs-tx');

module.exports = Signer;

function Signer(opts) {
  this.dataDir = opts.dataDir;
  this.passPhrase = opts.passPhrase; // if supplied on commandline
};

Signer.prototype.hasAddress = function(address, callback) {
  Account.getAccount({dataDir: this.dataDir, address: address.replace('0x', '')})
    .then(function(account) {
      callback(null, account.Exists);
    })
    .catch(callback)
};


Signer.prototype.signTransaction = function(rawTx, callback) {
  var sender = rawTx.from.replace('0x', '');
  Keystore.showKey({dataDir: this.dataDir, passPhrase: this.passPhrase, address: sender})
    .then(function(privateKey) {
      var secret, tx, serializedTx;
      secret = new Buffer(privateKey, 'hex');
      tx = new EthereumTx(rawTx);
      tx.sign(secret);
      serializedTx = '0x' + tx.serialize().toString('hex');
      callback(null, serializedTx);
    })
    .catch(callback);
};

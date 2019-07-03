'use strict';

var _ = require('lodash');
var chai = chai || require('chai');
var sinon = sinon || require('sinon');
var should = chai.should();

var Constants = require('../lib/common/constants');
var Credentials = require('../lib/credentials');
var TestData = require('./testdata');

describe('Credentials', function() {

  describe('#create', function() {
    it('Should create', function() {
      var c = Credentials.create('livenet');
      should.exist(c.xPrivKey);
      should.exist(c.copayerId);
    });

    it('Should create random credentials', function() {
      var all = {};
      for (var i = 0; i < 10; i++) {
        var c = Credentials.create('livenet');
        var exist = all[c.xPrivKey];
        should.not.exist(exist);
        all[c.xPrivKey] = 1;
      }
    });
  });

  describe('#getBaseAddressDerivationPath', function() {
    it('should return path for livenet', function() {
      var c = Credentials.create('livenet');
      var path = c.getBaseAddressDerivationPath();
      path.should.equal("m/44'/0'/0'");
    });
    it('should return path for testnet account 2', function() {
      var c = Credentials.create('testnet');
      c.account = 2;
      var path = c.getBaseAddressDerivationPath();
      path.should.equal("m/44'/1'/2'");
    });
    it('should return path for BIP45', function() {
      var c = Credentials.create('livenet');
      c.derivationStrategy = Constants.DERIVATION_STRATEGIES.BIP45;
      var path = c.getBaseAddressDerivationPath();
      path.should.equal("m/45'");
    });
  });

  describe('#getDerivedXPrivKey', function() {
    it('should derive extended private key from master livenet', function() {
      var c = Credentials.fromExtendedPrivateKey('xprv9s21ZrQH143K3zLpjtB4J4yrRfDTEfbrMa9vLZaTAv5BzASwBmA16mdBmZKpMLssw1AzTnm31HAD2pk2bsnZ9dccxaLD48mRdhtw82XoiBi', 0, 'BIP44');
      var xpk = c.getDerivedXPrivKey().toString();
      xpk.should.equal('xprv9xud2WztGSSBPDPDL9RQ3rG3vucRA4BmEnfAdP76bTqtkGCK8VzWjevLw9LsdqwH1PEWiwcjymf1T2FLp12XjwjuCRvcSBJvxDgv1BDTbWY');
    });
    it('should derive extended private key from master testnet', function() {
      var c = Credentials.fromExtendedPrivateKey('tprv8ZgxMBicQKsPfPX8avSJXY1tZYJJESNg8vR88i8rJFkQJm6HgPPtDEmD36NLVSJWV5ieejVCK62NdggXmfMEHog598PxvXuLEsWgE6tKdwz', 0, 'BIP44');
      var xpk = c.getDerivedXPrivKey().toString();
      xpk.should.equal('tprv8gBu8N7JbHZs7MsW4kgE8LAYMhGJES9JP6DHsj2gw9Tc5PrF5Grr9ynAZkH1LyWsxjaAyCuEMFKTKhzdSaykpqzUnmEhpLsxfujWHA66N93');
    });
    it('should derive extended private key from master BIP48 livenet', function() {
      var c = Credentials.fromExtendedPrivateKey('xprv9s21ZrQH143K3zLpjtB4J4yrRfDTEfbrMa9vLZaTAv5BzASwBmA16mdBmZKpMLssw1AzTnm31HAD2pk2bsnZ9dccxaLD48mRdhtw82XoiBi', 0, 'BIP48');
      var xpk = c.getDerivedXPrivKey().toString();
      xpk.should.equal('xprv9yaGCLKPS2ovEGw987MZr4DCkfZHGh518ndVk3Jb6eiUdPwCQu7nYru59WoNkTEQvmhnv5sPbYxeuee5k8QASWRnGV2iFX4RmKXEQse8KnQ');
    });
    it('should derive extended private key from master livenet (BIP45)', function() {
      var c = Credentials.fromExtendedPrivateKey('xprv9s21ZrQH143K3zLpjtB4J4yrRfDTEfbrMa9vLZaTAv5BzASwBmA16mdBmZKpMLssw1AzTnm31HAD2pk2bsnZ9dccxaLD48mRdhtw82XoiBi', 0, 'BIP45');
      var xpk = c.getDerivedXPrivKey().toString();
      xpk.should.equal('xprv9vDaAbbvT8LHKr8v5A2JeFJrnbQk6ZrMDGWuiv2vZgSyugeV4RE7Z9QjBNYsdafdhwEGb6Y48DRrXFVKvYRAub9ExzcmJHt6Js6ybJCSssm');
    });
    it('should set addressType & BIP45', function() {
      var c = Credentials.fromExtendedPrivateKey('xprv9s21ZrQH143K3zLpjtB4J4yrRfDTEfbrMa9vLZaTAv5BzASwBmA16mdBmZKpMLssw1AzTnm31HAD2pk2bsnZ9dccxaLD48mRdhtw82XoiBi', 8, 'BIP45');
      c.addWalletInfo(1, 'name', 1, 1, 'juan');
      c.account.should.equal(8);
    });
    it('should derive compliant child', function() {
      var c = Credentials.fromExtendedPrivateKey('tprv8ZgxMBicQKsPd8U9aBBJ5J2v8XMwKwZvf8qcu2gLK5FRrsrPeSgkEcNHqKx4zwv6cP536m68q2UD7wVM24zdSCpaJRmpowaeJTeVMXL5v5k', 0, 'BIP44');
      c.compliantDerivation.should.be.true;
      var xpk = c.getDerivedXPrivKey().toString();
      xpk.should.equal('tprv8gXvQvjGt7oYCTRD3d4oeQr9B7JLuC2B6S854F4XWCQ4pr9NcjokH9kouWMAp1MJKy4Y8QLBgbmPtk3i7RegVzaWhWsnVPi4ZmykJXt4HeV');
    });
    it('should derive non-compliant child', function() {
      var c = Credentials.fromExtendedPrivateKey('tprv8ZgxMBicQKsPd8U9aBBJ5J2v8XMwKwZvf8qcu2gLK5FRrsrPeSgkEcNHqKx4zwv6cP536m68q2UD7wVM24zdSCpaJRmpowaeJTeVMXL5v5k', 0, 'BIP44', {
        nonCompliantDerivation: true
      });
      c.compliantDerivation.should.be.false;
      var xpk = c.getDerivedXPrivKey().toString();
      xpk.should.equal('tprv8gSy16H5hQ1MKNHzZDzsktr4aaGQSHg4XYVEbfsEiGSBcgw4J8dEm8uf19FH4L9h6W47VBKtc3bbYyjb6HAm6QdyRLpB6fsA7bW19RZnby2');
    });
  });

  describe('#fromExtendedPrivateKey', function() {
    it('Should create credentials from seed', function() {
      var xPriv = 'xprv9s21ZrQH143K2TjT3rF4m5AJcMvCetfQbVjFEx1Rped8qzcMJwbqxv21k3ftL69z7n3gqvvHthkdzbW14gxEFDYQdrRQMub3XdkJyt3GGGc';
      var c = Credentials.fromExtendedPrivateKey(xPriv, 0, 'BIP44');

      c.xPrivKey.should.equal('xprv9s21ZrQH143K2TjT3rF4m5AJcMvCetfQbVjFEx1Rped8qzcMJwbqxv21k3ftL69z7n3gqvvHthkdzbW14gxEFDYQdrRQMub3XdkJyt3GGGc');
      c.xPubKey.should.equal('xpub6DUean44k773kxbUq8QpSmAPFaNCpk5AzrxbFRAMsNCZBGD15XQVnRJCgNd8GtJVmDyDZh89NPZz1XPQeX5w6bAdLGfSTUuPDEQwBgKxfh1');
      c.copayerId.should.equal('bad66ef88ad8dec08e36d576c29b4f091d30197f04e166871e64bf969d08a958');
      c.network.should.equal('livenet');
      c.personalEncryptingKey.should.equal('M4MTmfRZaTtX6izAAxTpJg==');
      should.not.exist(c.walletPrivKey);
    });

    it('Should create credentials from seed and walletPrivateKey', function() {
      var xPriv = 'xprv9s21ZrQH143K2TjT3rF4m5AJcMvCetfQbVjFEx1Rped8qzcMJwbqxv21k3ftL69z7n3gqvvHthkdzbW14gxEFDYQdrRQMub3XdkJyt3GGGc';

      var wKey = 'a28840e18650b1de8cb83bcd2213672a728be38a63e70680b0c2be9c452e2d4d';
      var c = Credentials.fromExtendedPrivateKey(xPriv, 0, 'BIP44', { walletPrivKey: 'a28840e18650b1de8cb83bcd2213672a728be38a63e70680b0c2be9c452e2d4d'});

      c.xPrivKey.should.equal('xprv9s21ZrQH143K2TjT3rF4m5AJcMvCetfQbVjFEx1Rped8qzcMJwbqxv21k3ftL69z7n3gqvvHthkdzbW14gxEFDYQdrRQMub3XdkJyt3GGGc');
      c.walletPrivKey.should.equal(wKey);
    });




    describe('Compliant derivation', function() {
      it('Should create compliant base address derivation key', function() {
        var xPriv = 'xprv9s21ZrQH143K4HHBKb6APEoa5i58fxeFWP1x5AGMfr6zXB3A6Hjt7f9LrPXp9P7CiTCA3Hk66cS4g8enUHWpYHpNhtufxSrSpcbaQyVX163';
        var c = Credentials.fromExtendedPrivateKey(xPriv, 0, 'BIP44');
        c.xPubKey.should.equal('xpub6CUtFEwZKBEyX6xF4ECdJdfRBBo69ufVgmRpy7oqzWJBSadSZ3vaqvCPNFsarga4UWcgTuoDQL7ZnpgWkUVUAX3oc7ej8qfLEuhMALGvFwX');
      });

      it('Should create compliant request key', function() {
        var xPriv = 'xprv9s21ZrQH143K3xMCR1BNaUrTuh1XJnsj8KjEL5VpQty3NY8ufgbR8SjZS8B4offHq6Jj5WhgFpM2dcYxeqLLCuj1wgMnSfmZuPUtGk8rWT7';
        var c = Credentials.fromExtendedPrivateKey(xPriv, 0, 'BIP44');
        c.requestPrivKey.should.equal('559371263eb0b2fd9cd2aa773ca5fea69ed1f9d9bdb8a094db321f02e9d53cec');
      });

      it('should accept non-compliant derivation as a parameter when importing', function() {
        var c = Credentials.fromExtendedPrivateKey('tprv8ZgxMBicQKsPd8U9aBBJ5J2v8XMwKwZvf8qcu2gLK5FRrsrPeSgkEcNHqKx4zwv6cP536m68q2UD7wVM24zdSCpaJRmpowaeJTeVMXL5v5k', 0, 'BIP44', {
          nonCompliantDerivation: true
        });
        c.xPrivKey.should.equal('tprv8ZgxMBicQKsPd8U9aBBJ5J2v8XMwKwZvf8qcu2gLK5FRrsrPeSgkEcNHqKx4zwv6cP536m68q2UD7wVM24zdSCpaJRmpowaeJTeVMXL5v5k');
        c.compliantDerivation.should.be.false;
        c.xPubKey.should.equal('tpubDD919WKKqmh2CqKnSsfUAJWB9bnLbcry6r61tBuY8YEaTBBpvXSpwdXXBGAB1n4JRFDC7ebo7if3psUAMpvQJUBe3LcjuMNA6Y4nP8U9SNg');
        c.getDerivedXPrivKey().toString().should.equal("tprv8gSy16H5hQ1MKNHzZDzsktr4aaGQSHg4XYVEbfsEiGSBcgw4J8dEm8uf19FH4L9h6W47VBKtc3bbYyjb6HAm6QdyRLpB6fsA7bW19RZnby2");
      });
    });
    describe('Compliant derivation', function() {
      it('Should create compliant base address derivation key', function() {
        var xPriv = 'xprv9s21ZrQH143K4HHBKb6APEoa5i58fxeFWP1x5AGMfr6zXB3A6Hjt7f9LrPXp9P7CiTCA3Hk66cS4g8enUHWpYHpNhtufxSrSpcbaQyVX163';
        var c = Credentials.fromExtendedPrivateKey(xPriv, 0, 'BIP44');
        c.xPubKey.should.equal('xpub6CUtFEwZKBEyX6xF4ECdJdfRBBo69ufVgmRpy7oqzWJBSadSZ3vaqvCPNFsarga4UWcgTuoDQL7ZnpgWkUVUAX3oc7ej8qfLEuhMALGvFwX');
      });

      it('Should create compliant request key', function() {
        var xPriv = 'xprv9s21ZrQH143K3xMCR1BNaUrTuh1XJnsj8KjEL5VpQty3NY8ufgbR8SjZS8B4offHq6Jj5WhgFpM2dcYxeqLLCuj1wgMnSfmZuPUtGk8rWT7';
        var c = Credentials.fromExtendedPrivateKey(xPriv, 0, 'BIP44');
        c.requestPrivKey.should.equal('559371263eb0b2fd9cd2aa773ca5fea69ed1f9d9bdb8a094db321f02e9d53cec');
      });

      it('should accept non-compliant derivation as a parameter when importing', function() {
        var c = Credentials.fromExtendedPrivateKey('tprv8ZgxMBicQKsPd8U9aBBJ5J2v8XMwKwZvf8qcu2gLK5FRrsrPeSgkEcNHqKx4zwv6cP536m68q2UD7wVM24zdSCpaJRmpowaeJTeVMXL5v5k', 0, 'BIP44', {
          nonCompliantDerivation: true
        });
        c.xPrivKey.should.equal('tprv8ZgxMBicQKsPd8U9aBBJ5J2v8XMwKwZvf8qcu2gLK5FRrsrPeSgkEcNHqKx4zwv6cP536m68q2UD7wVM24zdSCpaJRmpowaeJTeVMXL5v5k');
        c.compliantDerivation.should.be.false;
        c.xPubKey.should.equal('tpubDD919WKKqmh2CqKnSsfUAJWB9bnLbcry6r61tBuY8YEaTBBpvXSpwdXXBGAB1n4JRFDC7ebo7if3psUAMpvQJUBe3LcjuMNA6Y4nP8U9SNg');
        c.getDerivedXPrivKey().toString().should.equal("tprv8gSy16H5hQ1MKNHzZDzsktr4aaGQSHg4XYVEbfsEiGSBcgw4J8dEm8uf19FH4L9h6W47VBKtc3bbYyjb6HAm6QdyRLpB6fsA7bW19RZnby2");
      });
    });
  });

  describe('#fromMnemonic', function() {
    it('Should create credentials from mnemonic BIP44', function() {
      var words = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
      var c = Credentials.fromMnemonic('livenet', words, '', 0, 'BIP44');
      c.xPrivKey.should.equal('xprv9s21ZrQH143K2jpBAheq1PqPKvLoDm88txWMNNFsBqHYJBr7oMGxctuJJzyk7XoALHeJJvrWdGWuqAnVewQXdcZh6n5nwAzWA2LZKAJDcPS');
      c.network.should.equal('livenet');
      c.account.should.equal(0);
      c.derivationStrategy.should.equal('BIP44');
      c.xPubKey.should.equal('xpub6DRvEMU5iPXHkqPJwM3WKLQmZvB4Ncs79ikjRgDwHpYPnw1mN4Pkv18QxkV54BtRZyJv9964BEMckK4JLfKjhdqtfceUREHjm7H5Th1k735');
      c.getBaseAddressDerivationPath().should.equal("m/44'/0'/0'");
    });

    it('Should create credentials from mnemonic BIP48', function() {
      var words = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
      var c = Credentials.fromMnemonic('livenet', words, '', 0, 'BIP48');
      c.xPrivKey.should.equal('xprv9s21ZrQH143K2jpBAheq1PqPKvLoDm88txWMNNFsBqHYJBr7oMGxctuJJzyk7XoALHeJJvrWdGWuqAnVewQXdcZh6n5nwAzWA2LZKAJDcPS');
      c.network.should.equal('livenet');
      c.account.should.equal(0);
      c.derivationStrategy.should.equal('BIP48');
      c.xPubKey.should.equal('xpub6DGCC2KaJvYuRWiJHqMJ8isM69ee9HNceDDDP8NG2d4zVVu7ke6ypF7MJSA987vusSBv7KU3dTKxq2JTyoHJiKJeN8eEfzpYX2P2WPLEQAG');
      c.getBaseAddressDerivationPath().should.equal("m/48'/0'/0'");
    });

    it('Should create credentials from mnemonic account 1', function() {
      var words = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
      var c = Credentials.fromMnemonic('livenet', words, '', 1, 'BIP44');
      c.xPrivKey.should.equal('xprv9s21ZrQH143K2jpBAheq1PqPKvLoDm88txWMNNFsBqHYJBr7oMGxctuJJzyk7XoALHeJJvrWdGWuqAnVewQXdcZh6n5nwAzWA2LZKAJDcPS');
      c.account.should.equal(1);
      c.xPubKey.should.equal('xpub6DRvEMU5iPXHoztdKBDtaveKMU9UswgkF68dqbqZp6a1fN2tKTFL7woKXbpY9usYLcuvjnc9H47tBvks4YSVdYf6GYqvjcEayrpusKeKDcm');
      c.getBaseAddressDerivationPath().should.equal("m/44'/0'/1'");
    });

    it('Should create credentials from mnemonic with undefined/null passphrase', function() {
      var words = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
      var c = Credentials.fromMnemonic('livenet', words, undefined, 0, 'BIP44');
      c.xPrivKey.should.equal('xprv9s21ZrQH143K2jpBAheq1PqPKvLoDm88txWMNNFsBqHYJBr7oMGxctuJJzyk7XoALHeJJvrWdGWuqAnVewQXdcZh6n5nwAzWA2LZKAJDcPS');
      c = Credentials.fromMnemonic('livenet', words, null, 0, 'BIP44');
      c.xPrivKey.should.equal('xprv9s21ZrQH143K2jpBAheq1PqPKvLoDm88txWMNNFsBqHYJBr7oMGxctuJJzyk7XoALHeJJvrWdGWuqAnVewQXdcZh6n5nwAzWA2LZKAJDcPS');
    });

    it('Should create credentials from mnemonic and passphrase', function() {
      var words = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
      var c = Credentials.fromMnemonic('livenet', words, 'húngaro', 0, 'BIP44');
      c.xPrivKey.should.equal('xprv9s21ZrQH143K2KQAv63Z16w9Rdo6ymvN2hWTgNAcbPcrzv4d2ij7EDxCpa7xmdjgoUUBYB1HrCt6JtMXkWtZ1zoxTNR1QU2GmbiTgstvqdW');
    });

    it('Should create credentials from mnemonic and passphrase for testnet account 2', function() {
      var words = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
      var c = Credentials.fromMnemonic('testnet', words, 'húngaro', 2, 'BIP44');
      c.xPrivKey.should.equal('tprv8ZgxMBicQKsPd8dhaeu4AkZ8jmDKDHxNNFRaYnb55N7LnWoi264rjyKejkHcn181AuzxYGd41ZTtmjuGsjEVq45Yz1dK4pkKghTt8dKqhok');
      c.network.should.equal('testnet');
      c.xPubKey.should.equal('tpubDCNKtKiwKHjRdPLWn1stHwataeAQB9QChnbT2PxtmnLTzvD6ytTgjawKJbVyQUrNiscx4cc9MsNCoQvbxF5ZjwmxeYkq65pX2FdEiSKVwpy');
      c.getBaseAddressDerivationPath().should.equal("m/44'/1'/2'");
    });

    it('Should create credentials from mnemonic (ES)', function() {
      var words = 'afirmar diseño hielo fideo etapa ogro cambio fideo toalla pomelo número buscar';
      var c = Credentials.fromMnemonic('livenet', words, '', 0, 'BIP44');
      c.xPrivKey.should.equal('xprv9s21ZrQH143K3cWFqAXx7TvvpAX2sT5zZETydaxUoeTb97sdRr22ZWh8BvTR6rKKqcMDbCYX97mg2TboYL6bxsyfEBTAY9tEJtVYyz9pS5z');
      c.network.should.equal('livenet');
    });

    describe('Compliant derivation', function() {
      it('Should create compliant base address derivation key from mnemonic', function() {
        var words = "shoulder sphere pull seven top much black copy labor dress depth unit";
        var c = Credentials.fromMnemonic('livenet', words, '', 0, 'BIP44');
        c.xPrivKey.should.equal('xprv9s21ZrQH143K2fj52rUb4zWLmKTEsEi8B23U55BCTRby4x9UoFLYDyaqYB2Pn7XA52TteWV3MtH4DVpwcws2BqQMQnKM5ZqbGkbFxH83Cpy');
        c.xPubKey.should.equal('xpub6CNCWarbhT9o93H54W4krJ2GZ5kte6eTU6WbmRURdhaSrfgvMXNstShwoTYDzNCTTL3zd8tfVTQvH8gaiZDcswzm7Q3moqffEooTXKKVeA1');
      });

      it('Should create compliant request key from mnemonic', function() {
        var words = "pool stomach bridge series powder mammal betray slogan pass roast neglect reunion";
        var c = Credentials.fromMnemonic('livenet', words, '', 0, 'BIP44');
        c.xPrivKey.should.equal('xprv9s21ZrQH143K4389zb4eEoLVbVqVXHnAZY3QdkBcjLrNz2nTdsvkcSrSoqEdyZ7phcHX8fobfzd82U18TomLtBCZihXC4xmW5qbsUJT1R73');
        c.requestPrivKey.should.equal('6e479301b134acbc7821cfd18267343b591b8722be9d712033a3133aaf4a19af');
      });
      it('should accept non-compliant derivation as a parameter when importing', function() {
        var c = Credentials.fromMnemonic('testnet', 'level unusual burger hole call main basic flee drama diary argue legal', '', 0, 'BIP44', {
          nonCompliantDerivation: true
        });
        c.xPrivKey.should.equal('tprv8ZgxMBicQKsPeHzXhchQtwJEgsnvMnt15WYPPhGj1Mg49gMrhw97wBf4muT4wzV6Ve1RAit2fn1r4d7XJHFfqftNTS4istyquWmZFUao2ab');
        c.compliantDerivation.should.be.false;
        c.xPubKey.should.equal('tpubDCqskPrjo7PJYK11w69Zd9EW98t5HrDD4efBtP6Z4qtePa6MPPJvMMJ3pfTh3tHaKLHQZjJDhKBHnkvCneHUpJGVgC8u5rnvPxTFqPD352R');
        c.getDerivedXPrivKey().toString().should.equal("tprv8g9qbypVejhdeqyE3SUyDjaPa7N98X2JVM4Qbs4Fea6FZ5qakzVLArgBeYXf1HYfXSmGrKSvDJZQnq4pQ4qpKkXKERA5Y3Vd3nMH2NnkGzi");
      });
    });
  });

  describe('#createWithMnemonic', function() {
    it('Should create credentials with mnemonic', function() {
      var c = Credentials.createWithMnemonic('livenet', '', 'en', 0);
      should.exist(c.mnemonic);
      c.mnemonic.split(' ').length.should.equal(12);
      c.network.should.equal('livenet');
      c.account.should.equal(0);
    });

    it('should assume derivation compliance on new credentials', function() {
      var c = Credentials.createWithMnemonic('livenet', '', 'en', 0);
      c.compliantDerivation.should.be.true;
      var xPrivKey = c.getDerivedXPrivKey();
      should.exist(xPrivKey);
    });

    it('Should create credentials with mnemonic (testnet)', function() {
      var c = Credentials.createWithMnemonic('testnet', '', 'en', 0);
      should.exist(c.mnemonic);
      c.mnemonic.split(' ').length.should.equal(12);
      c.network.should.equal('testnet');
    });

    it('Should return and clear mnemonic', function() {
      var c = Credentials.createWithMnemonic('testnet', '', 'en', 0);
      should.exist(c.mnemonic);
      c.getMnemonic().split(' ').length.should.equal(12);
      c.clearMnemonic();
      should.not.exist(c.getMnemonic());
    });
  });

  describe('#createWithMnemonic #fromMnemonic roundtrip', function() {
    _.each(['en', 'es', 'ja', 'zh', 'fr'], function(lang) {
      it('Should verify roundtrip create/from with ' + lang + '/passphrase', function() {
        var c = Credentials.createWithMnemonic('testnet', 'holamundo', lang, 0);
        should.exist(c.mnemonic);
        var words = c.mnemonic;
        var xPriv = c.xPrivKey;
        var path = c.getBaseAddressDerivationPath();

        var c2 = Credentials.fromMnemonic('testnet', words, 'holamundo', 0, 'BIP44');
        should.exist(c2.mnemonic);
        words.should.be.equal(c2.mnemonic);
        c2.xPrivKey.should.equal(c.xPrivKey);
        c2.network.should.equal(c.network);
        c2.getBaseAddressDerivationPath().should.equal(path);
      });
    });

    it('Should fail roundtrip create/from with ES/passphrase with wrong passphrase', function() {
      var c = Credentials.createWithMnemonic('testnet', 'holamundo', 'es', 0);
      should.exist(c.mnemonic);
      var words = c.mnemonic;
      var xPriv = c.xPrivKey;
      var path = c.getBaseAddressDerivationPath();

      var c2 = Credentials.fromMnemonic('testnet', words, 'chaumundo', 0, 'BIP44');
      c2.network.should.equal(c.network);
      c2.getBaseAddressDerivationPath().should.equal(path);
      c2.xPrivKey.should.not.equal(c.xPrivKey);
    });
  });

  describe('Private key encryption', function() {
    describe('#encryptPrivateKey', function() {
      it('should encrypt private key and remove cleartext', function() {
        var c = Credentials.createWithMnemonic('livenet', '', 'en', 0);
        c.encryptPrivateKey('password');
        c.isPrivKeyEncrypted().should.be.true;
        should.exist(c.xPrivKeyEncrypted);
        should.exist(c.mnemonicEncrypted);
        should.not.exist(c.xPrivKey);
        should.not.exist(c.mnemonic);
      });
      it('should fail to encrypt private key if already encrypted', function() {
        var c = Credentials.create('livenet');
        c.encryptPrivateKey('password');
        var err;
        try {
          c.encryptPrivateKey('password');
        } catch (ex) {
          err = ex;
        }
        should.exist(err);
      });
    });
    describe('#decryptPrivateKey', function() {
      it('should decrypt private key', function() {
        var c = Credentials.createWithMnemonic('livenet', '', 'en', 0);
        c.encryptPrivateKey('password');
        c.isPrivKeyEncrypted().should.be.true;
        c.decryptPrivateKey('password');
        c.isPrivKeyEncrypted().should.be.false;
        should.exist(c.xPrivKey);
        should.exist(c.mnemonic);
        should.not.exist(c.xPrivKeyEncrypted);
        should.not.exist(c.mnemonicEncrypted);
      });
      it('should fail to decrypt private key with wrong password', function() {
        var c = Credentials.createWithMnemonic('livenet', '', 'en', 0);
        c.encryptPrivateKey('password');

        var err;
        try {
          c.decryptPrivateKey('wrong');
        } catch (ex) {
          err = ex;
        }
        should.exist(err);
        c.isPrivKeyEncrypted().should.be.true;
        should.exist(c.mnemonicEncrypted);
        should.not.exist(c.mnemonic);
      });
      it('should fail to decrypt private key when not encrypted', function() {
        var c = Credentials.create('livenet');

        var err;
        try {
          c.decryptPrivateKey('password');
        } catch (ex) {
          err = ex;
        }
        should.exist(err);
        c.isPrivKeyEncrypted().should.be.false;
      });
    });
    describe('#getKeys', function() {
      it('should get keys regardless of encryption', function() {
        var c = Credentials.createWithMnemonic('livenet', '', 'en', 0);
        var keys = c.getKeys();
        should.exist(keys);
        should.exist(keys.xPrivKey);
        should.exist(keys.mnemonic);
        keys.xPrivKey.should.equal(c.xPrivKey);
        keys.mnemonic.should.equal(c.mnemonic);

        c.encryptPrivateKey('password');
        c.isPrivKeyEncrypted().should.be.true;
        var keys2 = c.getKeys('password');
        should.exist(keys2);
        keys2.should.deep.equal(keys);

        c.decryptPrivateKey('password');
        c.isPrivKeyEncrypted().should.be.false;
        var keys3 = c.getKeys();
        should.exist(keys3);
        keys3.should.deep.equal(keys);
      });
      it('should get derived keys regardless of encryption', function() {
        var c = Credentials.createWithMnemonic('livenet', '', 'en', 0);
        var xPrivKey = c.getDerivedXPrivKey();
        should.exist(xPrivKey);

        c.encryptPrivateKey('password');
        c.isPrivKeyEncrypted().should.be.true;
        var xPrivKey2 = c.getDerivedXPrivKey('password');
        should.exist(xPrivKey2);

        xPrivKey2.toString('hex').should.equal(xPrivKey.toString('hex'));

        c.decryptPrivateKey('password');
        c.isPrivKeyEncrypted().should.be.false;
        var xPrivKey3 = c.getDerivedXPrivKey();
        should.exist(xPrivKey3);
        xPrivKey3.toString('hex').should.equal(xPrivKey.toString('hex'));
      });
    });
  });
});

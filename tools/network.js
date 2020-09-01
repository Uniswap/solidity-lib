'use strict';

require("dotenv").config();
const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");

module.exports = class Network {
  constructor(network) {
    this.hmy = null;
    this.privateKeys = {deployer: null, tester: null};
    this.setNetwork(network);
    this.gasPrice = process.env.GAS_PRICE;
    this.gasLimit = process.env.GAS_LIMIT;
  }

  setNetwork(network) {
    this.network = network.toLowerCase();
    var url, chainType, chainId;

    switch (this.network) {
      case 'testnet':
        console.log('Using the testnet network...\n');
        url = "https://api.s0.b.hmny.io";
        chainType = ChainType.Harmony;
        chainId = ChainID.HmyTestnet;
        break;
      
      case 'mainnet':
        console.log('Using the mainnet network...\n');
        url = "https://api.s0.t.hmny.io";
        chainType = ChainType.Harmony;
        chainId = ChainID.HmyMainnet;
        break;
      
      default:
        console.log('Please enter a valid network - testnet or mainnet.');
        throw new Error('NetworkRequired');
    }

    this.hmy = new Harmony(
      url,
      {
        chainType: chainType,
        chainId: chainId,
      }
    );

    this.privateKeys = {
      deployer: process.env[`${this.network.toUpperCase()}_PRIVATE_KEY`],
      tester: process.env[`${this.network.toUpperCase()}_TEST_ACCOUNT_PRIVATE_KEY`],
    }
  }

  gasOptions() {
    return {
      gasPrice: this.gasPrice,
      gasLimit: this.gasLimit,
    }
  }

  loadContract(path, address, privateKeyType) {
    let contract = null;
    let privateKey = null;

    switch (privateKeyType) {
      case 'deployer', 'tester':
        this.privateKeys[privateKeyType]
        break;
      
      default:
        privateKey = privateKeyType;
    }

    if (privateKey != null && privateKey != '') {
      const contractJson = require(path);
      contract = this.hmy.contracts.createContract(contractJson.abi, address);
      contract.wallet.addByPrivateKey(privateKey);
    }

    return contract;
  }

};

const UniswapV2ERC20 = artifacts.require("UniswapV2ERC20");
const UniswapV2Factory = artifacts.require("UniswapV2Factory");
const UniswapV2Pair = artifacts.require("UniswapV2Pair");

const { getAddress } = require("@harmony-js/crypto");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(UniswapV2ERC20).then(function () {
    return deployer.deploy(UniswapV2Pair).then(function () {

      console.log(`   UniswapV2ERC20 address: ${UniswapV2ERC20.address} - ${getAddress(UniswapV2ERC20.address).bech32}`);
      console.log(`   UniswapV2Pair address: ${UniswapV2Pair.address} - ${getAddress(UniswapV2Pair.address).bech32}`);
      console.log(`   export NETWORK=${network}; export UNISWAPV2ERC20=${UniswapV2ERC20.address}; export UNISWAPV2PAIR=${UniswapV2Pair.address};\n`);
      console.log(`   addresses: {"uniswapV2ERC20": "${UniswapV2ERC20.address}", "uniswapV2Pair": "${UniswapV2Pair.address}"}`);

    }); // End UniswapV2ERC20 deployment
  }); // End UniswapV2Pair deployment
}

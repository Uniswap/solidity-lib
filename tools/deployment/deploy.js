// Args
const yargs = require('yargs');
const argv = yargs
    .option('network', {
        alias: 'n',
        description: 'Which network to use',
        type: 'string',
        default: 'testnet'
    })
    .help()
    .alias('help', 'h')
    .argv;

// Libs
const Network = require("../network.js");
const { getAddress } = require("@harmony-js/crypto");

// Vars
const network = new Network(argv.network);
network.hmy.wallet.addByPrivateKey(network.privateKeys.deployer);

const contracts = [
    'AddressStringUtil', 'Babylonian', 'FixedPoint', 'PairNamer', 'SafeERC20Namer', 'TransferHelper'
];

async function deploy() {
  for (let i = 0; i < contracts.length; i++) {
    const contract = contracts[i];
    const addr = await deployContract(contract);
	console.log(`    Deployed contract ${contract}: ${addr} (${getAddress(addr).bech32})`);
  }
}

async function deployContract(contractName) {
  let contractJson = require(`../../build/contracts/${contractName}.json`);
  let contract = network.hmy.contracts.createContract(contractJson.abi);
  contract.wallet.addByPrivateKey(network.privateKeys.deployer);
  //contract.wallet.setSigner(network.privateKeys.deployer);
  let deployOptions = { data: contractJson.bytecode };
  let response = await contract.methods.contractConstructor(deployOptions).send(network.gasOptions());
  const contractAddress = response.transaction.receipt.contractAddress;
  return contractAddress
}

deploy()
  .then(() => {
    process.exit(0);
  })
  .catch(function(err){
    console.log(err);
    process.exit(0);
  });

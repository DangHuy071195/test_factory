const fs = require('fs');
const path = require('path');

const hre = require('hardhat');

const pathAddress = path.resolve(__dirname, '../data.json');

const getDataFromFile = async (p) => {
  const fsPromises = fs.promises;

  const data = await fsPromises
    .readFile(p)
    .catch((err) => console.error('Failed to read file', err));

  return JSON.parse(data.toString());
};

async function main() {
  let addressErc2917Impl, addressProveOfState, addressBasicToken;
  const data = await getDataFromFile(pathAddress);
  addressErc2917Impl = data.addressErc2917Impl.toString();
  addressProveOfState = data.addressProveOfState.toString();
  addressBasicToken = data.addressBasicToken.toString();
  await hre.run('verify', {
    address: addressErc2917Impl,
    constructorArgs: 'arguments_erc2917_verify.js',
  });
  await hre.run('verify', {
    address: addressProveOfState,
    constructorArgs: addressErc2917Impl.toString(),
  });
  await hre.run('verify', {
    address: addressBasicToken,
    constructorArgs: 'arguments_basic_verify.js',
    contract: 'contracts/BasicToken.sol:BasicToken'
  });
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

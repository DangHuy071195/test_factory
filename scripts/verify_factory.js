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
  let addressFactory, addressChild;
  const data = await getDataFromFile(pathAddress);
  addressFactory = data.addressFactory.toString();
  addressChild = data.addressChild.toString();
 
  // await hre.run('verify', {
  //   address: addressChild,
  //   constructorArgs: 'arguments_child.js',
  // });

  await hre.run('verify', {
    address: addressFactory,
    constructorArgs: 'arguments_factory.js',
  });
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const hre = require('hardhat');

const fs = require('fs');
const path = require('path');

const writeData = async (p, data) => {
  const fsPromises = fs.promises;
  await fsPromises
    .writeFile(p, JSON.stringify(data))
    .catch((err) => console.log('Failed to write file', err));
};

async function deployErc() {
  const ERC2917Impl = await hre.ethers.getContractFactory('ERC2917Impl');
  const BasicToken = await hre.ethers.getContractFactory('BasicToken');
  const ProveOfStake = await hre.ethers.getContractFactory('ProveOfStake');

  const erc2917Impl = await ERC2917Impl.deploy(100);
  const proveOfState = await ProveOfStake.deploy(
    erc2917Impl.address.toString()
  );
  const basicToken = await BasicToken.deploy(100);

  const addressErc2917Impl = erc2917Impl.address;

  const addressProveOfState = proveOfState.address;


  const addressBasicToken = basicToken.address;

  await erc2917Impl.deployed();
  await proveOfState.deployed();
  await basicToken.deployed();

  console.log('ProveOfStake deployed to:', addressProveOfState);
  console.log('ERC2917Impl deployed to:', addressErc2917Impl);
  console.log('BasicToken deployed to:', addressBasicToken);

  const data = { addressErc2917Impl, addressProveOfState, addressBasicToken };
  return data;
}

deployErc()
  .then(async (data) => {
    const pathAddress = path.resolve(__dirname, '../data.json');
    console.log(pathAddress);
    await writeData(pathAddress, data);
    // process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

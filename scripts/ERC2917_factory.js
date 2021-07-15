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
  const Child = await hre.ethers.getContractFactory('Child');
  const Factory = await hre.ethers.getContractFactory('Factory');

  const child = await Child.deploy();
  const factory = await Factory.deploy(child.address.toString());

  const addressChild = child.address;

  const addressFactory = factory.address;


  // const addressBasicToken = basicToken.address;

  await child.deployed();
  await factory.deployed();

  console.log('Child deployed to:', addressChild);
  console.log('Factory deployed to:', addressFactory);

  const data = { addressChild, addressFactory };
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


import { ethers } from "hardhat";
const toWei = (value: number) => ethers.utils.parseEther(value.toString());

async function main() {
  const Factory = await ethers.getContractFactory("Factory");
  const masterCopy = "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552";
  const proxyFactory =  "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2";
  const factory = await Factory.deploy(proxyFactory, masterCopy);
  console.log(factory.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

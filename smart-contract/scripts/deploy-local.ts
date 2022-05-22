
import { ethers } from "hardhat";
const toWei = (value: number) => ethers.utils.parseEther(value.toString());

async function main() {
  const Factory = await ethers.getContractFactory("Factory");
  const GnosisSafeProxyMock = await ethers.getContractFactory("GnosisSafeProxyMock");
  const gnosisSafeProxyMock = await GnosisSafeProxyMock.deploy();
  const randomWalletAddress = '0xe0AdBa7f31f79df6C75D5B156AD80615FfdAd9Be'
  const factory = await Factory.deploy(gnosisSafeProxyMock.address, randomWalletAddress);
  console.log(factory.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

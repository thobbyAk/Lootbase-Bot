import { ethers } from "hardhat";
const toWei = (value: number) => ethers.utils.parseEther(value.toString());


async function main() {
 const [owner, user1, user3] = await ethers.getSigners();
  const GroupManagement = await ethers.getContractFactory("GroupManagement");
  const groupManagement = await GroupManagement.attach(
    "0xa16e02e87b7454126e5e10d957a927a7f5b5d2be"
  );


  const tx = await groupManagement.connect(user1).addDeposit(0, { value: toWei(10) });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

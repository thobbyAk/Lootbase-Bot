import { ethers } from "hardhat";
const toWei = (value: number) => ethers.utils.parseEther(value.toString());

async function main() {
  const groupName = "My super group";
  const groupSymbol = "MSP";

  const today = new Date();
  today.setHours(today.getHours() + 4);
  const depositEndDate = Math.round(today.getTime() / 1000);

  const depostiLimit = toWei(100);

  const Factory = await ethers.getContractFactory("Factory");
  const factory = await Factory.attach(
    "0x4dF367EE319E4AC07F0d3087f72955B0d2e50498"
  );
  const botAddress = "0xac9122168d18e28Ef181406533583A3486D9FA4B";
  const adminAddress = "0xF99Ef997364537B331E3FB77fe5D8622f5a16296";
  const address = [
    botAddress,
    adminAddress,
  ];

  const tx = await factory.createGroup(
    address,
    groupName,
    groupSymbol,
    "0x0000000000000000000000000000000000000000",
    depositEndDate,
    depostiLimit,
    99
  );

  console.log("done");
  let receipt = await tx.wait();

  console.log(
    receipt.events?.filter((x) => {
      return x.event == "NewGroup";
    })
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

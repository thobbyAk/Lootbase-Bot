import { expect } from "chai";
import { ethers } from "hardhat";
const fromWei = (value: number) =>
  ethers.utils.formatEther(
    typeof value === "string" ? value : value.toString()
  );
const toWei = (value: number) => ethers.utils.parseEther(value.toString());
describe("Group", function () {
  let groupName = "Dispay";
  let groupSymbol = "DSP";
  let depositToken: any;
  let depostiLimit: any;
  let depositEndDate: number;
  let owner: any;
  let user: any;
  let maxMembers: number = 99;
  let factory: any;
  let gnosisSafeProxyMock;
  let gnosisOwners = [
    "0xCcb5C0A3Dc4FdF10e52b8534EFDAB1e9F331495D",
    "0x40834F278FeaD256c9D38f1f162183e28b545409",
  ];

  before(async function () {
    [owner, user] = await ethers.getSigners();

    const DepositToken = await ethers.getContractFactory("Token");
    depositToken = await DepositToken.deploy("test token", "test", toWei(10));

    const GnosisSafeProxyMock = await ethers.getContractFactory(
      "GnosisSafeProxyMock"
    );
    gnosisSafeProxyMock = await GnosisSafeProxyMock.deploy();

    const Factory = await ethers.getContractFactory("Factory");
    const randomWalletAddress = "0xe0AdBa7f31f79df6C75D5B156AD80615FfdAd9Be";
    factory = await Factory.deploy(
      gnosisSafeProxyMock.address,
      randomWalletAddress
    );

    const today = new Date();
    today.setHours(today.getHours() + 4);
    depositEndDate = Math.round(today.getTime() / 1000);

    depostiLimit = toWei(100);
  });

  it("Should create a group", async function () {
    const GroupManagement = await ethers.getContractFactory("GroupManagement");
    const tx = await factory.createGroup(
      gnosisOwners,
      groupName,
      groupSymbol,
      depositToken.address,
      depositEndDate,
      depostiLimit,
      maxMembers
    );

    const rc = await tx.wait();
    const event = rc.events.find(
      (ev: { event: string }) => ev.event === "NewGroup"
    );
    const [groupAddress] = event.args;

    const groupManagement = await GroupManagement.attach(groupAddress);
    expect(await groupManagement.name()).to.equal(groupName);
  });

  it("Should add a deposit in ERC20 token", async function () {
    const GroupManagement = await ethers.getContractFactory("GroupManagement");
    const tx = await factory.createGroup(
      gnosisOwners,
      groupName,
      groupSymbol,
      depositToken.address,
      depositEndDate,
      depostiLimit,
      maxMembers
    );

    const rc = await tx.wait();
    const event = rc.events.find(
      (ev: { event: string }) => ev.event === "NewGroup"
    );
    const [groupAddress] = event.args;

    const groupManagement = await GroupManagement.attach(groupAddress);

    await depositToken.approve(groupManagement.address, toWei(10));

    await groupManagement.addDeposit(toWei(10));

    const treasureAddress = groupManagement.treasureAddress();
    expect(await depositToken.balanceOf(treasureAddress)).to.equal(toWei(10));
    expect(await groupManagement.balanceOf(owner.address)).to.equal(toWei(10));
  });

  it("Should add a deposit in ETH", async function () {
    const GroupManagement = await ethers.getContractFactory("GroupManagement");
    const tx = await factory.createGroup(
      gnosisOwners,
      groupName,
      groupSymbol,
      "0x0000000000000000000000000000000000000000",
      depositEndDate,
      depostiLimit,
      maxMembers
    );

    const rc = await tx.wait();
    const event = rc.events.find(
      (ev: { event: string }) => ev.event === "NewGroup"
    );
    const [groupAddress] = event.args;

    const groupManagement = await GroupManagement.attach(groupAddress);

    await groupManagement.addDeposit(0, { value: toWei(10) });

    expect(await groupManagement.balanceOf(owner.address)).to.equal(toWei(10));
  });

  it("Should set deposit endDate", async function () {
    const GroupManagement = await ethers.getContractFactory("GroupManagement");
    const tx = await factory.createGroup(
      gnosisOwners,
      groupName,
      groupSymbol,
      "0x0000000000000000000000000000000000000000",
      depositEndDate,
      depostiLimit,
      maxMembers
    );

    const rc = await tx.wait();
    const event = rc.events.find(
      (ev: { event: string }) => ev.event === "NewGroup"
    );
    const [groupAddress] = event.args;
    const groupManagement = await GroupManagement.attach(groupAddress);

    const today = new Date();
    let depositEndDateModify = Math.round(today.getTime() / 1000);

    await groupManagement.setDepositEnDate(depositEndDateModify);

    expect(await groupManagement.depositEndDate()).to.equal(
      depositEndDateModify
    );
  });

  it("Should set deposit limit", async function () {
    const GroupManagement = await ethers.getContractFactory("GroupManagement");
    const tx = await factory.createGroup(
      gnosisOwners,
      groupName,
      groupSymbol,
      "0x0000000000000000000000000000000000000000",
      depositEndDate,
      depostiLimit,
      maxMembers
    );

    const rc = await tx.wait();
    const event = rc.events.find(
      (ev: { event: string }) => ev.event === "NewGroup"
    );
    const [groupAddress] = event.args;
    const groupManagement = await GroupManagement.attach(groupAddress);

    await groupManagement.setDepositLimit(10);

    expect(await groupManagement.depositLimit()).to.equal(10);
  });

  it("Should burn token to user", async function () {
    const GroupManagement = await ethers.getContractFactory("GroupManagement");
    const tx = await factory.createGroup(
      gnosisOwners,
      groupName,
      groupSymbol,
      "0x0000000000000000000000000000000000000000",
      depositEndDate,
      depostiLimit,
      maxMembers
    );

    const rc = await tx.wait();
    const event = rc.events.find(
      (ev: { event: string }) => ev.event === "NewGroup"
    );
    const [groupAddress] = event.args;
    const groupManagement = await GroupManagement.attach(groupAddress);

    await groupManagement.connect(user).addDeposit(0, { value: toWei(10) });

    expect(await groupManagement.balanceOf(user.address)).to.equal(toWei(10));

    await groupManagement.burnTokenTo(user.address, toWei(10));

    expect(await groupManagement.balanceOf(user.address)).to.equal(toWei(0));
  });

  it("Should mint token to user", async function () {
    const GroupManagement = await ethers.getContractFactory("GroupManagement");
    const tx = await factory.createGroup(
      gnosisOwners,
      groupName,
      groupSymbol,
      "0x0000000000000000000000000000000000000000",
      depositEndDate,
      depostiLimit,
      maxMembers
    );

    const rc = await tx.wait();
    const event = rc.events.find(
      (ev: { event: string }) => ev.event === "NewGroup"
    );
    const [groupAddress] = event.args;
    const groupManagement = await GroupManagement.attach(groupAddress);

    await groupManagement.connect(user).addDeposit(0, { value: toWei(10) });

    expect(await groupManagement.balanceOf(user.address)).to.equal(toWei(10));

    await groupManagement.mintTokenTo(user.address, toWei(10));

    expect(await groupManagement.balanceOf(user.address)).to.equal(toWei(20));
  });
});

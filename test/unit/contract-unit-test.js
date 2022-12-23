const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");
const { Contract } = require("ethers");
describe("Crown Fund", async () => {
  let crowdFundContract, deployer;
  const twoEth = ethers.utils.parseEther("2");
  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["crowdcontract"]);
    crowdFundContract = await ethers.getContract("CrowdFund", deployer);
    console.log("Testing...");
  });
  describe("Fund Contract", async () => {
    beforeEach(async () => {
      await crowdFundContract.fund({ value: twoEth });
    });
    it("should be able to fund our wallet", async () => {
      const contractBalance = await ethers.provider.getBalance(
        crowdFundContract.address
      );
      //   assert(contractBalance.toString(), twoEth.toString());
      await expect(contractBalance.toString()).to.equal(twoEth.toString());
    });
    it("should get the funder address and return amount funded", async () => {
      const funderArray = await crowdFundContract.listOfFunders(0);
      await expect(funderArray).to.equal(deployer);

      const amountPaid = await crowdFundContract.getAmountPaid(deployer);
      await expect(amountPaid.toString()).to.equal(twoEth.toString());
    });
  });

  describe("withdraw", async () => {
    beforeEach(async () => {
      await crowdFundContract.fund({ value: twoEth });
    });

    it("should withdraw successfully", async () => {
      await crowdFundContract.withdraw();
      const contractBalance = await ethers.provider.getBalance(
        crowdFundContract.address
      );

      await expect(contractBalance.toString()).to.equal("0");
    });
    it("should set the value of funders to 0", async () => {
      await crowdFundContract.withdraw();
      const value = await crowdFundContract.getAmountPaid(deployer);
      await expect(value.toString()).to.equal("0");
    });

    it("should not have a funder in the array", async () => {
      await crowdFundContract.withdraw();

      await expect(crowdFundContract.listOfFunders(1)).to.be.reverted;
    });

    it("should not allow withdraw from another address other than the deployers address", async () => {
      const accounts = await ethers.getSigners();
      const fakeAccount = accounts[3];
      //   console.log(fakeAccount);

      const crowdFundContractNew = await crowdFundContract.connect(fakeAccount);
      await expect(crowdFundContractNew.withdraw()).to.be.reverted;
    });
  });

  describe("multiple Users", async () => {
    beforeEach(async () => {
      const accounts = await ethers.getSigners();
      for (let i = 1; i <= 5; i++) {
        let eachAccount = accounts[i];
        const mainContract = await crowdFundContract.connect(eachAccount);
        await mainContract.fund({ value: twoEth });
      }
    });

    it("should withdraw fund", async () => {
      const contractStartBal = await ethers.provider.getBalance(
        crowdFundContract.address
      );
      const deployerStartBal = await ethers.provider.getBalance(deployer);

      const transactionRes = await crowdFundContract.withdraw();
      const withdrawTxReceipt = await transactionRes.wait(1);

      const { effectiveGasPrice, gasUsed } = withdrawTxReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);
      const contractEndingBalance = await ethers.provider.getBalance(
        crowdFundContract.address
      );

      const deployerEndingBalance = await ethers.provider.getBalance(deployer);

      await expect(contractStartBal.add(deployerStartBal).toString()).to.equal(
        deployerEndingBalance.add(gasCost).toString()
      );
    });
  });
});

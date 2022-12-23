const { getNamedAccounts, deployments, ethers } = require("hardhat");

const fund = async () => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log, get } = deployments;
  const oneEth = ethers.utils.parseEther("2");
  const crowdFundContract = await ethers.get("CrowdFund", deployer);

  console.log("Funding Contract...");

  const fundTxResponse = await crowdFundContract.fund({ value: oneEth });
  await fundTxResponse.wait(1);
  const contractBalance = await ethers.provider.getBalance(
    crowdFundContract.address
  );

  console.log(`Contract Balance: ${contractBalance.toString()}`);
  console.log("Done Funding Contract");
};

const { getNamedAccounts, deployments, ethers } = require("hardhat");
// we are assuming the contract as already been deployed, we are just getting the contract and using it

const withdraw = async () => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log, get } = deployments;

  console.log("withdrawing balance....");
  const crowdcontract = await ethers.getContract("CrowdFund", deployer);
  const withdrawTxRes = await crowdcontract.withdraw();
  await withdrawTxRes.wait(1);
  console.log(`Balance Successfully withdrawed to ${deployer}....`);
};

withdraw().catch((e) => {
  console.log(e);
  process.exit(1);
});

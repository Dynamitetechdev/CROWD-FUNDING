// install hardhat-deploy and @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  console.log("Contract Deploying.....");
  const crowdFundContract = await deploy("CrowdFund", {
    from: deployer,
    args: [],
    logs: true,
  });

  log(`Contract Address: ${crowdFundContract.address}`);
  log("Deploment done....");
  log("-----------------------------");
};

module.exports.tags = ["all", "crowdcontract"];

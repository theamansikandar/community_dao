const hre = require("hardhat");

async function main() {
  console.log("Deploying CommunityDAO contract...");
  const CommunityDAO = await hre.ethers.getContractFactory("CommunityDAO");
  const communityDAO = await CommunityDAO.deploy();
  await communityDAO.waitForDeployment();
  console.log(` CommunityDAO deployed to address: ${communityDAO.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
const hre = require("hardhat");
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
        console.error("Error: CONTRACT_ADDRESS not found in your server/.env file");
        process.exit(1);
    }

    const contract = await hre.ethers.getContractAt("CommunityDAO", contractAddress);
    console.log(`Attached to contract at ${contractAddress}`);

    const [proposer, recipient] = await hre.ethers.getSigners();

    const description = "Demo Proposal: Repair the local park's playground swings";
    const amount = hre.ethers.parseEther("1.25"); 

    console.log(`Submitting proposal from account: ${proposer.address}...`);
    
    const tx = await contract.createProposal(description, "", recipient.address, amount);
    await tx.wait();

    console.log(" Demo proposal created successfully!");
    console.log(" Refresh your website now to see it.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
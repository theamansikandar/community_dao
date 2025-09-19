const express = require('express');
const cors = require('cors');
const { ethers } = require("ethers");

const app = express();
app.use(cors());
app.use(express.json());

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS; // USE YOUR OWN ADDRESS HERE
const CONTRACT_ABI = require('./artifacts/contracts/CommunityDAO.sol/CommunityDAO.json').abi;

// Connect to the Hardhat local node
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

// API ENDPOINT
app.get('/api/proposals', async (req, res) => {
    try {
        console.log("Fetching proposals from the blockchain...");
        const proposals = await contract.getAllProposals();

        // Format the data to be more frontend-friendly
        const formattedProposals = proposals.map(p => ({
            id: Number(p.id),
            proposer: p.proposer,
            description: p.description,
            ipfsHash: p.ipfsHash,
            voteCount: Number(p.voteCount),
            deadline: new Date(Number(p.deadline) * 1000).toLocaleString(),
            executed: p.executed,
            recipient: p.recipient,
            amount: ethers.formatEther(p.amount) 
        }));

        res.json(formattedProposals);
    } catch (error) {
        console.error("Error fetching proposals:", error);
        res.status(500).send("Error fetching proposals from the blockchain.");
    }
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});

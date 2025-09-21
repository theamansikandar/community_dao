require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require("ethers");

const app = express();
app.use(cors());
app.use(express.json());

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const CONTRACT_ABI = require('./artifacts/contracts/CommunityDAO.sol/CommunityDAO.json').abi;

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

const ETH_USD_PRICE = 4500; 

app.get('/api/proposals', async (req, res) => {
    try {
        const proposalsFromChain = await contract.getAllProposals();
        
        const formattedProposals = proposalsFromChain.map(p => {
            const deadline = new Date(Number(p.deadline) * 1000);
            let status = p.executed ? "passed" : (deadline < new Date() ? "rejected" : "pending");

            return {
                id: p.id.toString(),
                title: p.description,
                description: p.ipfsHash,
                amountUsd: Number(ethers.formatEther(p.amount)) * ETH_USD_PRICE,
                payoutAddress: p.recipient,
                votesFor: Number(p.voteCount),
                votesAgainst: 0,
                status: status
            };
        }).sort((a, b) => b.id - a.id);

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
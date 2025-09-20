require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

const proposalSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    amountUsd: { type: Number, required: true },
    payoutAddress: { type: String, required: true },
    votesFor: { type: Number, default: 0 },
    votesAgainst: { type: Number, default: 0 },
    status: { type: String, default: 'pending' }
});

const Proposal = mongoose.model('Proposal', proposalSchema);

app.get('/api/proposals', async (req, res) => {
    try {
        const proposals = await Proposal.find().sort({ id: -1 });
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ message: "Error fetching proposals from database." });
    }
});

app.post('/api/proposals', async (req, res) => {
    try {
        const newProposal = new Proposal({
            id: String(Date.now()),
            title: req.body.title,
            description: req.body.description,
            amountUsd: Number(req.body.amount),
            payoutAddress: req.body.address,
        });
        await newProposal.save();
        res.status(201).json(newProposal);
    } catch (error) {
        res.status(500).json({ message: "Error saving proposal to database." });
    }
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
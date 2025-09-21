import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';
import axios from 'axios';

import ContractABI from './CommunityDAO.json';
import { short } from './utils/helpers';
import Hero from './components/Hero';
import ProposalCard from './components/ProposalCard';
import SubmitProposal from './components/SubmitProposal';
import TreasuryWidget from './components/TreasuryWidget';
import WhyTransparent from './components/WhyTransparent';

import './index.css';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const API_URL = 'http://localhost:5001/api';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [route, setRoute] = useState("home");

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 4000);
  };

  const fetchProposals = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/proposals`);
      setProposals(response.data);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        setAccount(accounts[0]);
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, ContractABI.abi, signer);
        setContract(contractInstance);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert('Please install MetaMask.');
    }
  };
  
  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          connectWallet();
        }
      }
    };
    checkIfWalletIsConnected();
    if(window.ethereum) {
      window.ethereum.on('accountsChanged', () => window.location.reload());
    }
    fetchProposals();
  }, []);

  const handleVote = async (id) => {
    if (!contract) return alert("Please connect your wallet first.");
    setIsLoading(true);
    showNotification("Submitting your vote to the blockchain...");
    try {
      const tx = await contract.vote(id);
      await tx.wait();
      showNotification("Vote submitted successfully!");
      fetchProposals(); 
    } catch(error) {
      console.error("Voting failed:", error);
      showNotification("Voting failed. You may have already voted.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProposal = async (draft) => {
    if (!contract) return alert("Please connect your wallet first.");
    setIsLoading(true);
    showNotification("Submitting your proposal to the blockchain...");
    try {
      const ETH_USD_PRICE = 4500;
      const WEI_PER_ETH = 10n ** 18n;
      // eslint-disable-next-line no-undef
      const amountInWei = (BigInt(Math.floor(draft.amount)) * WEI_PER_ETH) / BigInt(ETH_USD_PRICE);
      
      const tx = await contract.createProposal(draft.title, draft.description, draft.address, amountInWei);
      await tx.wait();
      showNotification("Proposal created successfully!");
      fetchProposals();
      setRoute("home");
    } catch (error) {
      console.error("Proposal creation failed:", error);
      showNotification("Proposal submission failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container row spread">
          <div className="row gap brand"> <span className="brand-name">PublicDAO</span> </div>
          <nav className="nav">
            <button className={`nav-btn ${route === "home" ? "active" : ""}`} onClick={() => setRoute("home")}> Home </button>
            <button className={`nav-btn ${route === "submit" ? "active" : ""}`} onClick={() => setRoute("submit")}> Submit </button>
          </nav>
          <div className="row gap">
            <button className="btn primary" onClick={connectWallet} disabled={!!account}>
              {account ? `${short(account)}` : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </header>
      
      {notification && <div className="notification">{notification}</div>}

      <main className="container main">
        {route === "home" && (
          <>
            <Hero onCreate={() => setRoute("submit")} />
            <section className="grid-3" id="proposals">
              <div className="col-span-2 col">
                <div className="row spread mb-2">
                  <h2 className="h2">Active Proposals</h2>
                  <button className="btn primary" onClick={() => setRoute("submit")}> Submit Proposal </button>
                </div>
                <div className="grid-2">
                  {isLoading && <p>Loading proposals...</p>}
                  {!isLoading && proposals.map((p) => (
                    <ProposalCard key={p.id} proposal={p} onVote={handleVote} disabled={isLoading || !account} />
                  ))}
                </div>
              </div>
              <aside className="col gap">
                <TreasuryWidget usd={125000} />
                <WhyTransparent />
              </aside>
            </section>
          </>
        )}
        {route === "submit" && <SubmitProposal onSubmitted={handleCreateProposal} />}
      </main>
    </div>
  );
}

export default App;
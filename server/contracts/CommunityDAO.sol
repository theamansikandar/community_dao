// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Counters.sol";

contract CommunityDAO {
    using Counters for Counters.Counter;
    Counters.Counter private _proposalIds;

    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        string ipfsHash; // For related documents/media
        uint256 voteCount;
        uint256 deadline;
        bool executed;
        address payable recipient;
        uint256 amount;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(
        uint256 id,
        address proposer,
        string description,
        uint256 deadline
    );

    event Voted(uint256 proposalId, address voter);

    modifier proposalIsActive(uint256 _proposalId) {
        require(proposals[_proposalId].deadline > block.timestamp, "Proposal deadline has passed");
        _;
    }

    function createProposal(
        string memory _description,
        string memory _ipfsHash,
        address payable _recipient,
        uint256 _amount
    ) public {
        _proposalIds.increment();
        uint256 newProposalId = _proposalIds.current();

        proposals[newProposalId] = Proposal({
            id: newProposalId,
            proposer: msg.sender,
            description: _description,
            ipfsHash: _ipfsHash,
            voteCount: 0,
            deadline: block.timestamp + 7 days, // Proposal is active for 7 days
            executed: false,
            recipient: _recipient,
            amount: _amount
        });

        emit ProposalCreated(newProposalId, msg.sender, _description, proposals[newProposalId].deadline);
    }

    function vote(uint256 _proposalId) public proposalIsActive(_proposalId) {
        require(proposals[_proposalId].id != 0, "Proposal does not exist");
        require(!hasVoted[_proposalId][msg.sender], "Already voted");

        proposals[_proposalId].voteCount++;
        hasVoted[_proposalId][msg.sender] = true;

        emit Voted(_proposalId, msg.sender);
    }

    function executeProposal(uint256 _proposalId) public payable {
        Proposal storage p = proposals[_proposalId];

        require(block.timestamp >= p.deadline, "Proposal is still active");
        require(!p.executed, "Proposal already executed");
        require(p.voteCount > 10, "Not enough votes to pass"); // Example threshold: 10 votes
        require(address(this).balance >= p.amount, "Insufficient contract balance");

        p.executed = true;
        (bool success, ) = p.recipient.call{value: p.amount}("");
        require(success, "Failed to send funds");
    }

    function getAllProposals() public view returns (Proposal[] memory) {
        uint256 totalProposals = _proposalIds.current();
        Proposal[] memory allProposals = new Proposal[](totalProposals);

        for (uint i = 0; i < totalProposals; i++) {
            allProposals[i] = proposals[i + 1];
        }
        return allProposals;
    }

    receive() external payable {}
}

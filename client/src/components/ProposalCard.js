import React from 'react';
import { fmt, badgeColor } from '../utils/helpers';

function ProposalCard({ proposal, onVote, disabled }) {
  const total = proposal.votesFor + proposal.votesAgainst || 1;
  const supportPct = Math.round((proposal.votesFor / total) * 100);
  return (
    <div className="card col">
      <div className="p-6 pb-2 row spread">
        <div>
          <div className="h4">{proposal.title}</div>
          <div className="muted">Requested: ${fmt(proposal.amountUsd, 0)}</div>
        </div>
        <span className={`badge ${badgeColor(proposal.status)}`}>{proposal.status}</span>
      </div>
      <div className="p-6 pt-0 col gap">
        <p className="muted">{proposal.description}</p>
        <div>
          <div className="row spread xs mb-1">
            <span>Support ({proposal.votesFor} votes)</span>
            <span>{supportPct}%</span>
          </div>
          <div className="bar sm">
            <div className="bar-fill" style={{ width: `${supportPct}%` }} />
          </div>
        </div>
      </div>
      <div className="p-6 pt-0 row gap">
        <button className="btn primary" onClick={() => onVote?.(proposal.id)} disabled={disabled}> Vote For </button>
        <button className="btn" disabled={true}> Vote Against </button>
      </div>
    </div>
  );
}

export default ProposalCard;
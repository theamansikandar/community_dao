import React from 'react';
import { fmt } from '../utils/helpers';

function TreasuryWidget({ usd }) {
  return (
    <div className="card col">
      <div className="row spread p-6 pb-2">
        <div className="col">
          <div className="h3">Treasury</div>
          <div className="muted">On-chain community funds</div>
        </div>
      </div>
      <div className="p-6 pt-0 col gap">
        <div className="row gap end">
          <div className="h2">${fmt(usd, 0)}</div>
          <span className="muted xs">USD</span>
        </div>
      </div>
    </div>
  );
}

export default TreasuryWidget;
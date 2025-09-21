import React, { useState } from 'react';

function SubmitProposal({ onSubmitted }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const valid = title && description.length > 20 && /^0x[a-fA-F0-9]{40}$/.test(address) && Number(amount) > 0;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!valid) return;
    onSubmitted({ title, description, amount, address });
  };

  return (
    <section className="grid-3">
      <div className="col-span-2 card">
        <div className="p-6"> <div className="h3">Submit a Proposal</div> </div>
        <form className="p-6 pt-0 col gap" onSubmit={onSubmit}>
          <label className="col gap"> <span className="label">Title</span> <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required /> </label>
          <label className="col gap"> <span className="label">Description</span> <textarea className="textarea" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} required /> </label>
          <div className="grid-2 sm">
            <label className="col gap"> <span className="label">Requested Amount (USD)</span> <input className="input" type="number" min="1" step="1" value={amount} onChange={(e) => setAmount(e.target.value)} required /> </label>
            <label className="col gap"> <span className="label">Payout Address</span> <input className="input mono" value={address} onChange={(e) => setAddress(e.target.value)} pattern="^0x[a-fA-F0-9]{40}$" required /> </label>
          </div>
          <div className="row gap">
            <button className="btn primary" type="submit" disabled={!valid}> Submit </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default SubmitProposal;
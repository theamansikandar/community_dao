import React from 'react';

function Hero({ onCreate }) {
  return (
    <section className="hero">
      <div className="glow" />
      <div className="col gap maxw">
        <span className="badge">On chain governance</span>
        <h1 className="title"> Solve local problems together with a transparent, citizen run Treasury. </h1>
        <p className="lead"> Propose, vote, and fund community initiatives fully recorded on the blockchain. </p>
        <div className="row gap wrap">
          <button className="btn primary lg" onClick={onCreate}> Create a Proposal </button>
          <a className="btn lg" href="#proposals"> Browse Proposals </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
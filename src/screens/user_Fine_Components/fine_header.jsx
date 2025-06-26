import React from 'react';
import '../../styling/fine.css';

const FineHeader = ({ fines }) => {
  return (
    <div className="fine-header">
      <div className="fine-header-left">
        <h4 className="fine-title">
          Remaining <br /> Fines
        </h4>
        <h5 className="fine-total">
          {fines <= 0 ? 'Rs. 0.00' : `Rs. ${fines}`}
        </h5>
      </div>
      <div className="fine-header-right">
        <p>Due Date: 2000 / 12 / 08</p>
      </div>
    </div>
  );
};

export default FineHeader;

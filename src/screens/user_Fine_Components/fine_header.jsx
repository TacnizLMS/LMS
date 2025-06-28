import React from 'react';
import '../../styling/fine.css';

const FineHeader = ({ fines }) => {
  return (
    <div className="fine-header">
      <div className="fine-header-left">
        <h4 className="fine-title">
          Remaining Fines: 
        </h4>
        <h4 className="fine-total">
          {fines <= 0 ? 'Rs. 0.00' : `Rs. ${fines}`}
        </h4>
      </div>
      <div className="fine-header-right">
      </div>
    </div>
  );
};

export default FineHeader;

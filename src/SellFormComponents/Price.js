import React from 'react';
import { MDBIcon, MDBInput } from 'mdb-react-ui-kit';

export default function Price({ onPriceSelect}) {

  const handleInputChange = (event) => {
    onPriceSelect(event.target.value)
  };

  return (
    <div className='mt-3 mb-2' style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{
        border: '1px solid gray',
        borderRight: 'none',
        borderRadius: '5px 0 0 5px',
        padding: '5px'
      }}>
        <MDBIcon fas icon="rupee-sign" />
      </div>
      <MDBInput label='Enter Price*' id='typeNumber' type='number' onChange={handleInputChange} />
    </div> 
  );
}
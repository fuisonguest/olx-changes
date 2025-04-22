import React, { useState } from 'react';
import { MDBBtn, MDBIcon, MDBInputGroup } from 'mdb-react-ui-kit';

export default function Searchbar() {
  const [input, setInput] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
  };
  
  const onSubmit = (e) => {
    e.preventDefault();
    const newUrl = `/results?query=${encodeURIComponent(input)}`;
    window.location.href = newUrl;
  }

  return (
    <div className="search-container w-100">
      <MDBInputGroup tag='form' onSubmit={onSubmit} className="mx-3 my-1">
        <input
          className="form-control"
          placeholder="Search..."
          aria-label="Search"
          type="search"
          value={input}
          onChange={handleChange}
          style={{ 
            borderRadius: "20px", 
            padding: "10px 15px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
          }}
        />
        <MDBBtn 
          rippleColor='dark' 
          className="search-button"
          style={{
            borderTopRightRadius: "20px",
            borderBottomRightRadius: "20px",
            padding: "10px 15px"
          }}
        >
          <MDBIcon icon='search' />
        </MDBBtn>
      </MDBInputGroup>
    </div>
  );
}

import React, { useState } from "react";
import { MDBInput, MDBTextArea } from "mdb-react-ui-kit";

export default function Details({ onTitleSelect, onDescriptionSelect }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleInputChange = (event) => {
    if (event.target.id === "title") {
      setTitle(event.target.value);
      onTitleSelect(event.target.value);
    }
    if (event.target.id === "description") {
      setDescription(event.target.value);
      onDescriptionSelect(event.target.value);
    }
  };

  return (
    <div className="mt-3 mb-1">
      <div className="mt-3 custom-file-input" style={{ alignItems: "center" }}>
        <div className="mb-4">
          <MDBInput label="Ad title*" id="title" type="text" onChange={handleInputChange} />
        </div>
        <div className="mb-4">
          <MDBTextArea label="Description*" id="description" rows={4} onChange={handleInputChange} />
        </div>
      </div>
    </div>
  );
}
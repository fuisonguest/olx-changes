import React, { useState, useEffect, useRef } from "react";
import { MDBCard, MDBCardBody, MDBCardImage, MDBInput, MDBIcon } from "mdb-react-ui-kit";

const authname = localStorage.getItem("authname");
const authpicture = localStorage.getItem("authpicture");

export default function Addetails({ onNameSelect, onImageSelect }) {
  const [name, setName] = useState(authname || "");
  const [img, setImg] = useState(authpicture || "");
  const [imageSrc, setImageSrc] = useState(null);
  const picture = localStorage.getItem("authpicture");
  const phone = localStorage.getItem("authphone");
  const fileInputRef = useRef(null);

  useEffect(() => {
    onNameSelect(name);
    onImageSelect(img);
  }, [name, img, onNameSelect, onImageSelect]);

  function handleInputChange(event) {
    setName(event.target.value);
  }

  function handleFileSelect(event) {
    const file = event.target.files[0];
    setImg(event.target.files[0]);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleUploadClick() {
    fileInputRef.current.click();
  }

  return (
    <div className="mt-3 mb-2">
      <MDBCard className="custom-card">
        <MDBCardBody className="p-4">
          <div className="d-flex text-black">
            <div className="position-relative">
              <label htmlFor="imageInput">
                <MDBCardImage
                  className="img-fluid rounded-circle border border-dark border-3"
                  style={{ width: "100px", height: "100px", borderRadius: "10px" }}
                  src={imageSrc || picture}
                  alt="Profile"
                  fluid
                />
              </label>
              <MDBIcon
                style={{ color: "deepskyblue" }}
                className="mx-auto position-absolute bottom-0 start-50 translate-middle-x mb-2"
                fas
                icon="cloud-upload-alt"
                onClick={handleUploadClick}
              />
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
            </div>
            <div className="flex-grow-1 ms-3">
              <div className="custom-file-input">
                <MDBInput
                  label="Name"
                  id="name"
                  value={name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="custom-file-input mt-4">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <small style={{ color: "darkslategray" }}>Phone number</small>
                  <small style={{ color: "slategray" }}>{phone}</small>
                </div>
              </div>
            </div>
          </div>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}

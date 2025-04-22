import React from "react";
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";

export default function Footer() {
  return (
    <MDBFooter
      className="text-center text-lg-start text-muted"
      style={{ backgroundColor: "rgba(235, 238, 239, 1)" }}
    >
      <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        <div className="me-5 d-none d-lg-block">
          <span>Get connected with us on social networks:</span>
        </div>

        <div className="text-dark">
          <a href="#" className="me-4 text-reset">
            <MDBIcon fa icon="globe" />
          </a>
          <a href="#" className="me-4 text-reset">
            <MDBIcon fab icon="instagram" />
          </a>
          <a href="#" className="me-4 text-reset">
            <MDBIcon fab icon="linkedin" />
          </a>
          <a href="#" className="me-4 text-reset">
            <MDBIcon fab icon="github" />
          </a>
        </div>
      </section>

      <section className="text-dark">
        <MDBContainer className="text-center text-md-start mt-5">
          <MDBRow className="mt-3">
            <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                <MDBIcon icon="gem" className="me-3" />
                RetreND
              </h6>
              <p>
                "Retrend is an online platform that facilitates the buying and
                selling of second-hand items. It provides a user-friendly
                interface for individuals to list their used goods and connect
                with potential buyers across various categories."
              </p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">About Us</h6>
              <p><a href="#" className="text-reset">About RetreND</a></p>
              <p><a href="#" className="text-reset">Careers</a></p>
              <p><a href="#" className="text-reset">Contact Us</a></p>
              <p><a href="#" className="text-reset">Our Team</a></p>
              <p><a href="#" className="text-reset">Blog</a></p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Support</h6>
              <p><a href="#" className="text-reset">Help Center</a></p>
              <p><a href="#" className="text-reset">Sitemap</a></p>
              <p><a href="#" className="text-reset">Privacy Policy</a></p>
              <p><a href="#" className="text-reset">Terms & Conditions</a></p>
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
              <p><MDBIcon icon="home" className="me-2" /> tolichawki, India</p>
              <p><MDBIcon icon="envelope" className="me-3" /> retrend@gmail.com</p>
              <p><MDBIcon icon="phone" className="me-3" /> +91 8897220069</p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className="text-center text-white p-4" style={{ backgroundColor: "rgba(0, 47, 52, 1)" }}>
        © {new Date().getFullYear()} Copyright:
        <a className="fw-bold text-white" href="#"> RetreND.com</a>
      </div>
    </MDBFooter>
  );
}

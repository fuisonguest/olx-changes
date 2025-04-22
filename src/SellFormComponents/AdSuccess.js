import React from "react";
import {
  MDBContainer as Container,
  MDBRow as Row,
  MDBCol as Col,
} from "mdb-react-ui-kit";
import myImage from "../resources/adsuccess.jpg";
import { Link } from "react-router-dom";

const AdSuccess = () => {
  return (
    <Container>
      <Row className="mt-5">
        <Col md="12" className="text-center">
          <i className="fas fa-check-circle fa-5x text-info mb-2"></i>
          <h2>Congratulations!</h2>
          <p>Your Ad will go live shortly.</p>
        </Col>
      </Row>
      <Row className="my-5">
        <Col md="12" className="text-center">
          <div className="d-flex justify-content-center">
            <img src={myImage} alt="Congratulations!" />
          </div>
          <p className="mt-2">
            <strong>Reach more buyers and sell faster.</strong>
            <p className="mt-1">Upgrade your Ad to a top position.</p>
          </p>
          <button className="btn btn-primary mt-4 mb-2">
            {" "}
            Sell Faster Now.
          </button>
          <br></br>
          <Link to="/myads" className="btn btn-primary">View Your Ads</Link>
        </Col>
      </Row>
    </Container>
  );
};

export default AdSuccess;

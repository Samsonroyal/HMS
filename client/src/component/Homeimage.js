import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import { MDBContainer } from "mdbreact";
import Img from "../photos/hospital.jpg";

class Homeimage extends Component {
  render() {
    return (
      <div>
        <Card>
          <Card.Img src={Img} alt="Card image" height="500" style={{ opacity: "0.6" }} />
          <Card.ImgOverlay>
            <Card.Title>
              <MDBContainer>
                <h1 className="font-weight-bold text-danger">
                  Kiruddu National Referral Hospital
                </h1>
                <br />
                <p className="font-weight-bold text-danger">
                  Curing Generations for Ages
                </p>
              </MDBContainer>
            </Card.Title>
          </Card.ImgOverlay>
        </Card>
        <br />
        <br />
      </div>
    );
  }
}

export default Homeimage;

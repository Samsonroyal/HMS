import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Img1 from "../photos/kiruddu/mandate1.jpg";
import Img2 from "../photos/kiruddu/mandate2.jpg";
import Img3 from "../photos/kiruddu/mandate3.jpg";

class Mandate extends Component {
  render() {
    return (
      <div className="container">
        <h1 className="head text-white" align="center">
          Our Mandate
        </h1>
        <br />
        <div className="card-deck">
          <Card className="bg-dark">
            <Card.Img src={Img1} alt="Clinical Services" height="250" />
            <Card.Body>
              <Card.Title className="text-warning" align="center">
                Clinical Services
              </Card.Title>
              <Card.Text className="text-white">
                Provision of comprehensive diagnostic, therapeutic and
                specialist clinical care to the community.
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="bg-dark">
            <Card.Img src={Img2} alt="Education and Training" height="250" />
            <Card.Body>
              <Card.Title className="text-warning" align="center">
                Education and Training
              </Card.Title>
              <Card.Text className="text-white">
                A teaching hospital for medical and healthcare professionals,
                including the Makerere University College of Health Sciences.
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="bg-dark">
            <Card.Img src={Img3} alt="Research" height="250" />
            <Card.Body>
              <Card.Title className="text-warning" align="center">
                Research
              </Card.Title>
              <Card.Text className="text-white">
                Active participation in clinical research to advance healthcare
                delivery in Uganda and beyond.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}

export default Mandate;

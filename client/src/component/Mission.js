import React, { Component } from "react";
import Card from "react-bootstrap/Card";

class Mission extends Component {
  render() {
    return (
      <div className="container">
        <Card>
          <Card.Body>
            <Card.Title align="center" className="text-black">
              Our Vision and Mission Statements
            </Card.Title>
            <Card.Text className="text-black">
              The Mission of Lifescape Hospital is to provide compassionate,
              accessible, high quality, cost effective healthcare to the
              community; to promote health; to educate healthcare professionals;
              and to participate in appropriate clinical research.
            </Card.Text>
          </Card.Body>
        </Card>
        <br />
        <Card>
          <Card.Body>
            <Card.Text className="text-grey">
              Lifescape Hospital will be an innovative, leading regional health
              system dedicated to advancing the health and transforming the lives
              of the people we serve through excellent clinical quality;
              accessible, patient-centered, caring service; and unmatched
              physician and employee commitment.
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Mission;

import React from "react";
import { Accordion, Card, Button } from "react-bootstrap";

const HomeQuote = () => {
  return (
    <div className="container">
      <Accordion>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              New Section Added
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <Card.Title>Inauguration of New Section</Card.Title>
              <Card.Text>
                A Section containing facilities such as a new Research and
                Development Cell, Operation Theater and a Check-Up center.
              </Card.Text>
            </Card.Body>
          </Accordion.Collapse>
        </Card>

        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="1">
              Best Hospital Award
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="1">
            <Card.Body>
              <Card.Title>Awarded to be Best Hospital in Kolkata</Card.Title>
              <Card.Text>
                We are overwhelmed by the support our patients provide us and
                you made us the best in Kolkata!
              </Card.Text>
            </Card.Body>
          </Accordion.Collapse>
        </Card>

        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="2">
              RnD Update
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="2">
            <Card.Body>
              <Card.Title>Medicinal Contribution</Card.Title>
              <Card.Text>
                Researcher Dr. Subhashish Karmakar found a new cure for microbes
                growing on skin.
              </Card.Text>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
};

export default HomeQuote;
import React from "react";
import { Accordion, Card, Button } from "react-bootstrap";

const HomeQuote = () => {
  return (
    <div className="container">
      <Accordion>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              An interview with Dr. Kabugo Charles about kidney diseases on NTV
              Uganda
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <Card.Text>
                The Executive Director of Kiruddu National Referral Hospital,
                Dr. Kabugo Charles, discusses kidney disease treatment at the
                hospital.
              </Card.Text>
              <a
                href="https://www.kiruddu.hosp.go.ug/news/an-interview-with-dr.-kabugo-charles-about-kidney-diseases-on-ntv-uganda"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more on the official website
              </a>
            </Card.Body>
          </Accordion.Collapse>
        </Card>

        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="1">
              Kiruddu Hospital sets up systems for low shelf life medicines
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="1">
            <Card.Body>
              <Card.Text>
                The hospital has put in place systems to safely manage medicines
                with a low shelf life.
              </Card.Text>
              <a
                href="https://www.kiruddu.hosp.go.ug/news/kiruddu-hospital-sets-up-systems-for-low-shelf-life-medicines"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more on the official website
              </a>
            </Card.Body>
          </Accordion.Collapse>
        </Card>

        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="2">
              Health ministry takes over Kiruddu, Kawempe hospitals
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="2">
            <Card.Body>
              <Card.Text>
                The Ministry of Health has taken over the management of Kiruddu
                and Kawempe hospitals.
              </Card.Text>
              <a
                href="https://www.kiruddu.hosp.go.ug/news/health-ministry-takes-over-kiruddu--kawempe-hospitals"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more on the official website
              </a>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
};

export default HomeQuote;

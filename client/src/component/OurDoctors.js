import React, { Component } from "react";
import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import Img1 from "../photos/doctor4.jpg";
import Img2 from "../photos/doctor2.jpg";
import Img3 from "../photos/doctor6.jpg";

class OurDoctors extends Component {
render() {
return (
<div>
<Carousel className="container" style={{ padding: "0 100px" }}>
<Carousel.Item>
<Card border="secondary">
<Card.Img variant="top" height="500" src={Img1} />
<Card.Body>
<Card.Title className="text-warning">
Dr. Debashish Majumder
</Card.Title>
<Card.Subtitle className="mb-2 text-muted">
Oncologist
</Card.Subtitle>
<Card.Text>Specialist in chemotherapy.</Card.Text>
</Card.Body>
</Card>
</Carousel.Item>
<Carousel.Item>
<Card border="secondary">
<Card.Img variant="top" height="300" src={Img2} />
<Card.Body>
<Card.Title className="text-warning">Dr. Disha Dey</Card.Title>
<Card.Subtitle className="mb-2 text-muted">
Psychiatrist
</Card.Subtitle>
<Card.Text>
Specialist in the treatment of schizophrenia.
</Card.Text>
</Card.Body>
</Card>
</Carousel.Item>
<Carousel.Item>
<Card border="secondary">
<Card.Img variant="top" height="300" src={Img3} />
<Card.Body>
<Card.Title className="text-warning">
Dr. Silajit Deb
</Card.Title>
<Card.Subtitle className="mb-2 text-muted">
Heart Specialist
</Card.Subtitle>
<Card.Text>
Specialist in the treatment of heart strokes.
</Card.Text>
</Card.Body>
</Card>
</Carousel.Item>
</Carousel>
<br />
<br />
</div>
);
}
}

export default OurDoctors;
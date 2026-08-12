import React, { Component } from "react";
import Carousel from "react-bootstrap/Carousel";
import Img1 from "../photos/kiruddu/hero1.jpg";
import Img2 from "../photos/kiruddu/hero2.jpg";
import Img3 from "../photos/kiruddu/hero3.jpg";
import Img4 from "../photos/kiruddu/hero4.jpg";

class Homeimage extends Component {
  render() {
    return (
      <div>
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={Img1}
              alt="Welcome to Kiruddu National Referral Hospital"
              height="500"
            />
            <Carousel.Caption>
              <h3>Welcome to Kiruddu National Referral Hospital</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={Img2}
              alt="Recently concluded Eye Camp"
              height="500"
            />
            <Carousel.Caption>
              <h3>Recently Concluded Eye Camp</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={Img3}
              alt="Cardiology Camp"
              height="500"
            />
            <Carousel.Caption>
              <h3>Cardiology Camp</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={Img4}
              alt="Burns Camp Recently Concluded"
              height="500"
            />
            <Carousel.Caption>
              <h3>Burns Camp Recently Concluded</h3>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    );
  }
}

export default Homeimage;

import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Img1 from '../photos/kiruddu/gallery1.png';
import Img2 from '../photos/kiruddu/gallery2.png';
import Img3 from '../photos/kiruddu/gallery3.jpg';
import Img4 from '../photos/kiruddu/gallery4.png';
import Img5 from '../photos/kiruddu/gallery5.png';
import Img6 from '../photos/kiruddu/gallery6.jpg';
import Img7 from '../photos/kiruddu/gallery7.jpg';
import Img8 from '../photos/kiruddu/gallery8.jpg';
import Mandate from './Mandate';
import Footer from './Footer';

class Gallery extends Component {
  render() {
    return (
      <div className="container">
        <h2 className="head text-white" align="center">
          Our Gallery
        </h2>
        <br />
        <div className="card-deck">
          <Card className="bg-dark">
            <Card.Img src={Img1} alt="Cleft lip repair" height="250" />
            <Card.Body>
              <Card.Text className="text-white">
                A baby with cleft lip had his lip repaired
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="bg-dark">
            <Card.Img src={Img2} alt="Recovered burn patient" height="250" />
            <Card.Body>
              <Card.Text className="text-white">
                Patient who recovered from severe flame burns
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="bg-dark">
            <Card.Img src={Img3} alt="Theatre staff at work" height="250" />
            <Card.Body>
              <Card.Text className="text-white">
                Theatre staff operating on a Burns patient
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="bg-dark">
            <Card.Img src={Img4} alt="Breast reconstruction" height="250" />
            <Card.Body>
              <Card.Text className="text-white">
                Breast reduction and reconstruction surgery
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <br />
        <div className="card-deck">
          <Card className="bg-dark">
            <Card.Img src={Img5} alt="Abdominal aesthetics" height="250" />
            <Card.Body>
              <Card.Text className="text-white">
                Abdominal Aesthetics
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="bg-dark">
            <Card.Img src={Img6} alt="ICU care" height="250" />
            <Card.Body>
              <Card.Text className="text-white">
                Staff attending to severely burnt patients in the ICU
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="bg-dark">
            <Card.Img src={Img7} alt="OPD partitions" height="250" />
            <Card.Body>
              <Card.Text className="text-white">
                OPD partitioned into admission, consultation and dressing rooms
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="bg-dark">
            <Card.Img src={Img8} alt="Burns and Plastic Surgery staff" height="250" />
            <Card.Body>
              <Card.Text className="text-white">
                Some of the Burns and Plastic Surgery department staff
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <br />
        <br />
        <Mandate />
        <Footer />
      </div>
    );
  }
}

export default Gallery;

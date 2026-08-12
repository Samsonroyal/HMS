import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Img1 from "../photos/kiruddu/service1.jpg";
import Img2 from "../photos/kiruddu/service8.jpg";
import Img3 from "../photos/kiruddu/service9.jpg";
import Img4 from "../photos/kiruddu/service7.jpg";
import Img5 from "../photos/kiruddu/service10.jpg";
import Img6 from "../photos/kiruddu/service3.jpg";
import Img7 from "../photos/kiruddu/service2.jpg";
import Img8 from "../photos/kiruddu/service4.jpg";
import Img9 from "../photos/kiruddu/service5.jpg";
import Img10 from "../photos/kiruddu/service6.jpg";

class Services extends Component {
  render() {
    return (
      <div className="container">
        <h1 className="head text-white" align="center">
          Our Services
        </h1>
        <br />
        <div className="card-deck">
          <Card className="bg-dark">
            <Card.Img src={Img1} alt="Diagnostic Services" height="200" />
            <Card.Body>
              <Card.Title className="text-warning">
                Diagnostic Services
              </Card.Title>
              <Card.Text className="text-white">
                Radiology (CT scans, X-ray, Fluoroscopy, Ultrasound),
                Laboratory, ECG and ECHO, Endoscopy and Bronchoscopy services.
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="bg-dark">
            <Card.Img src={Img2} alt="Cardiology Department" height="200" />
            <Card.Body>
              <Card.Title className="text-warning">
                Cardiology Department
              </Card.Title>
              <Card.Text className="text-white">
                Cardiology services handled every Friday.
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="bg-dark">
            <Card.Img src={Img3} alt="Dental Services" height="200" />
            <Card.Body>
              <Card.Title className="text-warning">Dental Services</Card.Title>
              <Card.Text className="text-white">
                Dental services handled on a daily basis.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <br />
        <div className="card-deck">
          <Card className="bg-dark">
            <Card.Img src={Img4} alt="Immunization Services" height="200" />
            <Card.Body>
              <Card.Title className="text-warning">
                Immunization Services
              </Card.Title>
              <Card.Text className="text-white">
                Immunization services handled nearly every day.
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="bg-dark">
            <Card.Img src={Img5} alt="Psychiatric Services" height="200" />
            <Card.Body>
              <Card.Title className="text-warning">
                Psychiatric Services
              </Card.Title>
              <Card.Text className="text-white">
                Psychiatric services handled every Tuesday.
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="bg-dark">
            <Card.Img src={Img6} alt="Burns and Plastic Surgery" height="200" />
            <Card.Body>
              <Card.Title className="text-warning">
                Burns and Plastic Surgery
              </Card.Title>
              <Card.Text className="text-white">
                Cosmetic surgery including surgical and nonsurgical procedures.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <br />
        <div className="card-deck">
          <Card className="bg-dark">
            <Card.Img src={Img7} alt="Nephrology Dialysis Services" height="200" />
            <Card.Body>
              <Card.Title className="text-warning">
                Nephrology - Dialysis Therapy
              </Card.Title>
              <Card.Text className="text-white">
                Preserving the health and wellbeing of patients with kidney
                diseases.
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="bg-dark">
            <Card.Img src={Img8} alt="Ophthalmology" height="200" />
            <Card.Body>
              <Card.Title className="text-warning">Ophthalmology</Card.Title>
              <Card.Text className="text-white">
                Eye care and treatment services.
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="bg-dark">
            <Card.Img src={Img9} alt="Lung Health Services" height="200" />
            <Card.Body>
              <Card.Title className="text-warning">
                Lung Health Services
              </Card.Title>
              <Card.Text className="text-white">
                Respiratory and lung health services at Kiruddu NRH.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <br />
        <div className="card-deck">
          <Card className="bg-dark">
            <Card.Img src={Img10} alt="Ear, Nose and Throat" height="200" />
            <Card.Body>
              <Card.Title className="text-warning">
                Ear, Nose and Throat (Otolaryngology)
              </Card.Title>
              <Card.Text className="text-white">
                ENT services for children and adults.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}

export default Services;

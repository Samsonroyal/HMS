import React, { Component } from "react";
import Card from "react-bootstrap/Card";

class Mission extends Component {
  render() {
    return (
      <div className="container">
        <br />
        <h1 className="head text-white" align="center">
          Welcome to Kiruddu National Referral Hospital
        </h1>
        <p className="text-center text-white font-italic">
          "Leading with innovation and serving with compassion in health care
          delivery"
        </p>
        <br />
        <Card>
          <Card.Body>
            <Card.Title align="center" className="text-black">
              About Us
            </Card.Title>
            <Card.Text className="text-black">
              Kiruddu National Referral Hospital is in the neighborhood of
              Kiruddu, on Buziga Hill, in Makindye Division, one of the five
              administrative units of the Kampala Capital City Authority. The
              hospital opened to the public on 16 May 2016.
            </Card.Text>
          </Card.Body>
        </Card>
        <br />
        <Card>
          <Card.Body>
            <Card.Title align="center" className="text-black">
              Our Key Specializations
            </Card.Title>
            <Card.Text className="text-grey">
              The hospital is highly regarded for Nephrology &amp; Dialysis,
              with a kidney disease unit equipped with 30 functional dialysis
              machines executing 45-60 life-saving sessions daily; Burns and
              Plastic Surgery, home to Uganda's only specialized national ward
              dedicated explicitly to burn treatments; Infectious Diseases,
              housing the largest dedicated infectious disease ward in the
              nation; and Diagnostics &amp; Imaging, offering automated lab
              processing, CT scans, X-rays, fluoroscopy, ultrasound, and
              endoscopy services. As a public national facility, general
              consultations, treatments, and select medications are provided
              free of charge or at a very low subsidized cost for Ugandan
              citizens. The hospital is open 24 hours, 7 days a week, serving
              300 to 500 patients daily across 200 inpatient beds and 14
              specialized outpatient clinics.
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Mission;

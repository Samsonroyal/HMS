import React, { Component } from 'react';
import Navber from './PatientNavbar';
import Footer from '../Footer';
import axios from 'axios';

class PatientPrescription extends Component {
  constructor() {
    super();
    this.state = {
      prescriptions: []
    };
  }

  componentDidMount() {
    axios.get('/prescription/patient', {
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(res => {
        this.setState({ prescriptions: res.data });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { prescriptions } = this.state;
    return (
      <div className="bg-dark">
        <Navber />
        <h2 className="text-white my-3" align="center">My Prescriptions</h2>

        <div className="container">
          <div className="jumbotron mt-5" style={{ backgroundColor: "#e0e0e0" }}>
            {prescriptions.length !== 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Doctor</th>
                    <th>Medicine</th>
                    <th>Dosage</th>
                    <th>Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map(prescription => (
                    <tr key={prescription.prescription_id}>
                      <td>{prescription.date}</td>
                      <td>
                        Dr. {prescription.doctor_firstname} {prescription.doctor_lastname}
                        <br />
                        <small>{prescription.specialisation}</small>
                      </td>
                      <td>{prescription.medicine_name}</td>
                      <td>{prescription.dosage}</td>
                      <td>{prescription.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No prescriptions yet.</p>
            )}
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default PatientPrescription;

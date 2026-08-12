import React, { Component } from 'react';
import Navber from './DocNavbar';
import Footer from '../Footer';
import axios from 'axios';

class DocPrescription extends Component {
  constructor() {
    super();
    this.state = {
      patients: [],
      patient_id: '',
      medicine_name: '',
      dosage: '',
      instructions: '',
      prescriptions: [],
      message: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const prescription = {
      patient_id: this.state.patient_id,
      medicine_name: this.state.medicine_name,
      dosage: this.state.dosage,
      instructions: this.state.instructions
    };

    axios.post('/prescription/create', prescription, {
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(res => {
        this.setState({ message: res.data, medicine_name: '', dosage: '', instructions: '' });
        this.fetchPrescriptions();
      })
      .catch(err => {
        console.log(err);
        this.setState({ message: 'Could not save prescription' });
      });
  }

  fetchPrescriptions() {
    axios.get('/prescription/doctor', {
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(res => {
        this.setState({ prescriptions: res.data });
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    axios.get('/doctor/patient', {
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(res => {
        this.setState({ patients: res.data });
      })
      .catch(err => console.log(err));

    this.fetchPrescriptions();
  }

  render() {
    const { patients, prescriptions } = this.state;
    return (
      <div className="bg-dark">
        <Navber />
        <h2 className="text-white my-3" align="center">Write Prescription</h2>

        <div className="row">
          <div className="col">
            <div className="container ml-3">
              <div className="jumbotron mt-5" style={{ backgroundColor: "#e0e0e0" }}>
                <div className="col-sm-8">
                  <h2 className="text-primary">New Prescription</h2>
                </div>
                <br />
                <form noValidate onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <label htmlFor="patient">Patient</label>
                    <select
                      className="form-control"
                      name="patient_id"
                      value={this.state.patient_id}
                      onChange={this.onChange}
                      required
                    >
                      <option value="">Select Assigned Patient</option>
                      {patients.map(patient => (
                        <option key={patient.patient_id} value={patient.patient_id}>
                          {patient.first_name} {patient.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="medicine_name">Medicine</label>
                    <input
                      type="text"
                      className="form-control"
                      name="medicine_name"
                      placeholder="Enter Medicine Name"
                      value={this.state.medicine_name}
                      onChange={this.onChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dosage">Dosage</label>
                    <input
                      type="text"
                      className="form-control"
                      name="dosage"
                      placeholder="e.g. 500mg twice daily"
                      value={this.state.dosage}
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="instructions">Instructions</label>
                    <textarea
                      className="form-control"
                      name="instructions"
                      placeholder="Additional instructions"
                      value={this.state.instructions}
                      onChange={this.onChange}
                    />
                  </div>
                  {this.state.message !== '' && (
                    <div className="alert alert-info">{this.state.message}</div>
                  )}
                  <button type="submit" className="btn btn-lg btn-primary btn-block">
                    Save Prescription
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="container mr-3">
              <div className="jumbotron mt-5" style={{ backgroundColor: "#e0e0e0" }}>
                <div className="col-sm-8">
                  <h2 className="text-primary">Prescriptions Written</h2>
                </div>
                <br />
                {prescriptions.length !== 0 ? (
                  <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Patient</th>
                        <th>Medicine</th>
                        <th>Dosage</th>
                        <th>Instructions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptions.map(prescription => (
                        <tr key={prescription.prescription_id}>
                          <td>{prescription.date}</td>
                          <td>{prescription.first_name} {prescription.last_name}</td>
                          <td>{prescription.medicine_name}</td>
                          <td>{prescription.dosage}</td>
                          <td>{prescription.instructions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                ) : (
                  <p>No prescriptions written yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default DocPrescription;

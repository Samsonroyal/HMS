import React, { Component } from 'react';
import DashboardLayout from '../DashboardLayout';
import { doctorNav } from '../dashboardNav';
import axios from 'axios';
import FormField from '../Login/FormField';

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
      message: '',
      messageType: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDelete = this.onDelete.bind(this);
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
        this.setState({
          message: res.data.message || 'Prescription saved',
          messageType: 'success',
          medicine_name: '',
          dosage: '',
          instructions: '',
          patient_id: ''
        });
        this.fetchPrescriptions();
      })
      .catch(err => {
        const message = err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : 'Could not save prescription. Please try again.';
        this.setState({ message, messageType: 'danger' });
      });
  }

  onDelete(prescription_id) {
    const ok = window.confirm('Delete this prescription? This cannot be undone.');
    if (!ok) return;

    axios.post('/prescription/delete', { prescription_id }, {
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(res => {
        this.setState({ message: res.data.message || 'Prescription deleted', messageType: 'success' });
        this.fetchPrescriptions();
      })
      .catch(err => {
        const message = err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : 'Could not delete prescription. Please try again.';
        this.setState({ message, messageType: 'danger' });
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
      <DashboardLayout title="Doctor" items={doctorNav}>
      <div className="dash-role-page">
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
                  <FormField
                    label="Patient"
                    name="patient_id"
                    as="select"
                    options={patients.map(patient => ({
                      value: patient.patient_id,
                      label: `${patient.first_name} ${patient.last_name}`
                    }))}
                    placeholder="Choose an assigned patient"
                    value={this.state.patient_id}
                    onChange={this.onChange}
                    help="Only patients assigned to you appear here."
                    required
                  />
                  <FormField
                    label="Medicine"
                    name="medicine_name"
                    value={this.state.medicine_name}
                    onChange={this.onChange}
                    placeholder="e.g. Paracetamol"
                    required
                  />
                  <FormField
                    label="Dosage"
                    name="dosage"
                    value={this.state.dosage}
                    onChange={this.onChange}
                    placeholder="e.g. 500mg twice daily"
                    help="How much and how often."
                  />
                  <FormField
                    label="Instructions (optional)"
                    name="instructions"
                    as="textarea"
                    rows={3}
                    placeholder="Additional instructions"
                    value={this.state.instructions}
                    onChange={this.onChange}
                  />
                  {this.state.message !== '' && (
                    <div className={`alert alert-${this.state.messageType || 'info'} auth-alert`} role="alert">
                      {this.state.message}
                    </div>
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
                        <th></th>
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
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => this.onDelete(prescription.prescription_id)}
                            >
                              Delete
                            </button>
                          </td>
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

      </div>
      </DashboardLayout>
    );
  }
}

export default DocPrescription;

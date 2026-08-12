import React, { Component } from 'react';
import Navber from './DocNavbar';
import Footer from '../Footer';
import axios from 'axios';

class DocAppointment extends Component {
  constructor() {
    super();
    this.state = {
      appointments: []
    };

    this.updateStatus = this.updateStatus.bind(this);
  }

  fetchAppointments() {
    axios.get('/appointment/doctor', {
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(res => {
        this.setState({ appointments: res.data });
      })
      .catch(err => console.log(err));
  }

  updateStatus(appointment_id, status) {
    axios.post('/appointment/update', { appointment_id, status }, {
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(() => this.fetchAppointments())
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.fetchAppointments();
  }

  render() {
    const { appointments } = this.state;
    return (
      <div className="bg-dark">
        <Navber />
        <h2 className="text-white my-3" align="center">Patient Appointments</h2>

        <div className="container">
          <div className="jumbotron mt-5" style={{ backgroundColor: "#e0e0e0" }}>
            {appointments.length !== 0 ? (
              <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Patient</th>
                    <th>Contact</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(appointment => (
                    <tr key={appointment.appointment_id}>
                      <td>{appointment.appointment_date}</td>
                      <td>{appointment.appointment_time}</td>
                      <td>{appointment.first_name} {appointment.last_name}</td>
                      <td>{appointment.email}<br />{appointment.phone_no}</td>
                      <td>{appointment.reason}</td>
                      <td>{appointment.status}</td>
                      <td>
                        {appointment.status === 'pending' && (
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-success"
                              onClick={() => this.updateStatus(appointment.appointment_id, 'confirmed')}
                            >
                              Confirm
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => this.updateStatus(appointment.appointment_id, 'cancelled')}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                        {appointment.status === 'confirmed' && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => this.updateStatus(appointment.appointment_id, 'completed')}
                          >
                            Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            ) : (
              <p>No appointments yet.</p>
            )}
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default DocAppointment;

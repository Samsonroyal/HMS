import React, { Component } from 'react';
import Navber from './PatientNavbar';
import Footer from '../Footer';
import axios from 'axios';

class PatientAppointment extends Component {
  constructor() {
    super();
    this.state = {
      doctors: [],
      doctor_id: '',
      appointment_date: '',
      appointment_time: '',
      reason: '',
      appointments: [],
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

    const appointment = {
      doctor_id: this.state.doctor_id,
      appointment_date: this.state.appointment_date,
      appointment_time: this.state.appointment_time,
      reason: this.state.reason
    };

    axios.post('/appointment/book', appointment, {
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(res => {
        this.setState({ message: res.data, reason: '', appointment_date: '', appointment_time: '' });
        this.fetchAppointments();
      })
      .catch(err => {
        console.log(err);
        this.setState({ message: 'Could not book appointment' });
      });
  }

  fetchAppointments() {
    axios.get('/appointment/patient', {
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(res => {
        this.setState({ appointments: res.data });
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    axios.get('/api/doctors')
      .then(res => {
        this.setState({ doctors: res.data });
      })
      .catch(err => console.log(err));

    this.fetchAppointments();
  }

  render() {
    const { doctors, appointments } = this.state;
    return (
      <div className="bg-dark">
        <Navber />
        <h2 className="text-white my-3" align="center">Book Appointment</h2>

        <div className="row">
          <div className="col">
            <div className="container ml-3">
              <div className="jumbotron mt-5" style={{ backgroundColor: "#e0e0e0" }}>
                <div className="col-sm-8">
                  <h2 className="text-primary">New Appointment</h2>
                </div>
                <br />
                <form noValidate onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <label htmlFor="doctor">Doctor</label>
                    <select
                      className="form-control"
                      name="doctor_id"
                      value={this.state.doctor_id}
                      onChange={this.onChange}
                      required
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map(doctor => (
                        <option key={doctor.doctor_id} value={doctor.doctor_id}>
                          Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialisation}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="appointment_date">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="appointment_date"
                      value={this.state.appointment_date}
                      onChange={this.onChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="appointment_time">Time</label>
                    <input
                      type="time"
                      className="form-control"
                      name="appointment_time"
                      value={this.state.appointment_time}
                      onChange={this.onChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="reason">Reason</label>
                    <textarea
                      className="form-control"
                      name="reason"
                      placeholder="Briefly describe your condition"
                      value={this.state.reason}
                      onChange={this.onChange}
                    />
                  </div>
                  {this.state.message !== '' && (
                    <div className="alert alert-info">{this.state.message}</div>
                  )}
                  <button type="submit" className="btn btn-lg btn-primary btn-block">
                    Book Appointment
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="container mr-3">
              <div className="jumbotron mt-5" style={{ backgroundColor: "#e0e0e0" }}>
                <div className="col-sm-8">
                  <h2 className="text-primary">My Appointments</h2>
                </div>
                <br />
                {appointments.length !== 0 ? (
                  <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Doctor</th>
                        <th>Reason</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map(appointment => (
                        <tr key={appointment.appointment_id}>
                          <td>{appointment.appointment_date}</td>
                          <td>{appointment.appointment_time}</td>
                          <td>
                            Dr. {appointment.doctor_firstname} {appointment.doctor_lastname}
                            <br />
                            <small>{appointment.specialisation}</small>
                          </td>
                          <td>{appointment.reason}</td>
                          <td>{appointment.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                ) : (
                  <p>No appointments booked yet.</p>
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

export default PatientAppointment;

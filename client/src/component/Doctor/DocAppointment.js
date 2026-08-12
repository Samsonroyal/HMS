import React, { Component } from 'react';
import DashboardLayout from '../DashboardLayout';
import { doctorNav } from '../dashboardNav';
import axios from 'axios';

class DocAppointment extends Component {
  constructor() {
    super();
    this.state = { appointments: [] };
    this.updateStatus = this.updateStatus.bind(this);
  }

  fetchAppointments() {
    axios.get('/appointment/doctor', { headers: { authorization: sessionStorage.getItem('usertoken') } })
      .then(res => this.setState({ appointments: res.data }))
      .catch(err => console.log(err));
  }

  updateStatus(appointment_id, status) {
    axios.post('/appointment/update', { appointment_id, status }, { headers: { authorization: sessionStorage.getItem('usertoken') } })
      .then(() => this.fetchAppointments())
      .catch(err => console.log(err));
  }

  componentDidMount() { this.fetchAppointments(); }

  render() {
    const { appointments } = this.state;
    return (
      <DashboardLayout title="Doctor" items={doctorNav}>
        <div className="dash-role-page">
          <header className="dash-role-header">
            <div>
              <p className="dash-eyebrow">Appointments</p>
              <h1 className="dash-role-title">Patient appointments</h1>
              <p className="dash-role-subtitle">Review requests and keep today’s patient schedule moving.</p>
            </div>
            <span className="dash-status-pill">Doctor workspace</span>
          </header>

          <article className="dash-card dash-appointment-list dash-appointment-list-wide">
            <div className="dash-card-heading">
              <div><p className="dash-eyebrow">Schedule</p><h2 className="dash-card-title">Appointment requests</h2></div>
              <span className="dash-count-pill">{appointments.length}</span>
            </div>
            {appointments.length !== 0 ? (
              <div className="table-responsive">
                <table className="table dash-table">
                  <thead><tr><th>Date</th><th>Time</th><th>Patient</th><th>Contact</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>{appointments.map(appointment => (
                    <tr key={appointment.appointment_id}>
                      <td>{appointment.appointment_date}</td>
                      <td>{appointment.appointment_time}</td>
                      <td>{appointment.first_name} {appointment.last_name}</td>
                      <td>{appointment.email}<br />{appointment.phone_no}</td>
                      <td>{appointment.reason || '—'}</td>
                      <td><span className={`dash-badge ${appointment.status}`}>{appointment.status}</span></td>
                      <td>
                        {appointment.status === 'pending' && <div className="btn-group btn-group-sm"><button className="btn btn-success" onClick={() => this.updateStatus(appointment.appointment_id, 'confirmed')}>Confirm</button><button className="btn btn-danger" onClick={() => this.updateStatus(appointment.appointment_id, 'cancelled')}>Cancel</button></div>}
                        {appointment.status === 'confirmed' && <button className="btn btn-sm btn-primary" onClick={() => this.updateStatus(appointment.appointment_id, 'completed')}>Complete</button>}
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            ) : (
              <div className="dash-empty-state"><span>◎</span><p>No appointments yet.</p><small>New patient requests will appear here.</small></div>
            )}
          </article>
        </div>
      </DashboardLayout>
    );
  }
}

export default DocAppointment;

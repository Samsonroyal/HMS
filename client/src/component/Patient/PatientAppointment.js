import React, { Component } from 'react';
import DashboardLayout from '../DashboardLayout';
import { patientNav } from '../dashboardNav';
import axios from 'axios';
import FormField from '../Login/FormField';

class PatientAppointment extends Component {
  constructor() {
    super();
    this.state = {
      doctors: [], doctor_id: '', appointment_date: '', appointment_time: '', reason: '',
      appointments: [], message: '', messageType: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onChange(e) { this.setState({ [e.target.name]: e.target.value }); }

  onSubmit(e) {
    e.preventDefault();
    const appointment = {
      doctor_id: this.state.doctor_id,
      appointment_date: this.state.appointment_date,
      appointment_time: this.state.appointment_time,
      reason: this.state.reason
    };
    axios.post('/appointment/book', appointment, { headers: { authorization: sessionStorage.getItem('usertoken') } })
      .then(res => {
        this.setState({ message: res.data.message || 'Appointment booked successfully', messageType: 'success', reason: '', appointment_date: '', appointment_time: '', doctor_id: '' });
        this.fetchAppointments();
      })
      .catch(err => this.setState({ message: err.response && err.response.data && err.response.data.error ? err.response.data.error : 'Could not book appointment. Please try again.', messageType: 'danger' }));
  }

  fetchAppointments() {
    axios.get('/appointment/patient', { headers: { authorization: sessionStorage.getItem('usertoken') } })
      .then(res => this.setState({ appointments: res.data }))
      .catch(err => console.log(err));
  }

  onCancel(appointment_id) {
    if (!window.confirm('Cancel this appointment? This cannot be undone.')) return;
    axios.post('/appointment/delete', { appointment_id }, { headers: { authorization: sessionStorage.getItem('usertoken') } })
      .then(res => { this.setState({ message: res.data.message || 'Appointment cancelled', messageType: 'success' }); this.fetchAppointments(); })
      .catch(err => this.setState({ message: err.response && err.response.data && err.response.data.error ? err.response.data.error : 'Could not cancel appointment. Please try again.', messageType: 'danger' }));
  }

  componentDidMount() {
    axios.get('/api/doctors', { headers: { authorization: sessionStorage.getItem('usertoken') } })
      .then(res => this.setState({ doctors: res.data }))
      .catch(err => console.log(err));
    this.fetchAppointments();
  }

  render() {
    const { doctors, appointments } = this.state;
    return (
      <DashboardLayout title="Patient" items={patientNav}>
        <div className="dash-role-page">
          <header className="dash-role-header">
            <div>
              <p className="dash-eyebrow">Appointments</p>
              <h1 className="dash-role-title">Book an appointment</h1>
              <p className="dash-role-subtitle">Choose a doctor and a convenient time for your next visit.</p>
            </div>
            <span className="dash-status-pill">Patient portal</span>
          </header>

          <section className="dash-appointment-grid">
            <article className="dash-card dash-appointment-form">
              <div className="dash-card-heading">
                <div><p className="dash-eyebrow">New request</p><h2 className="dash-card-title">Appointment details</h2></div>
                <span className="dash-card-icon">+</span>
              </div>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="dash-form-grid">
                  <div className="dash-form-full"><FormField label="Doctor" name="doctor_id" as="select" options={doctors.map(doctor => ({ value: doctor.doctor_id, label: `Dr. ${doctor.first_name} ${doctor.last_name} - ${doctor.specialisation}` }))} placeholder="Choose a doctor" value={this.state.doctor_id} onChange={this.onChange} help="Select the specialist you'd like to see." required /></div>
                  <FormField label="Date" name="appointment_date" type="date" min={new Date().toISOString().split('T')[0]} value={this.state.appointment_date} onChange={this.onChange} required />
                  <FormField label="Time" name="appointment_time" type="time" value={this.state.appointment_time} onChange={this.onChange} help="Clinic hours are 8:00 am – 5:00 pm." required />
                  <div className="dash-form-full"><FormField label="Reason (optional)" name="reason" as="textarea" rows={3} placeholder="Briefly describe your condition" value={this.state.reason} onChange={this.onChange} /></div>
                </div>
                {this.state.message !== '' && <div className={`alert alert-${this.state.messageType || 'info'} auth-alert`} role="alert">{this.state.message}</div>}
                <div className="dash-form-actions"><button type="submit" className="btn btn-primary">Book appointment</button></div>
              </form>
            </article>

            <article className="dash-card dash-appointment-list">
              <div className="dash-card-heading">
                <div><p className="dash-eyebrow">Your schedule</p><h2 className="dash-card-title">My appointments</h2></div>
                <span className="dash-count-pill">{appointments.length}</span>
              </div>
              {appointments.length !== 0 ? (
                <div className="table-responsive">
                  <table className="table dash-table">
                    <thead><tr><th>Date</th><th>Time</th><th>Doctor</th><th>Reason</th><th>Status</th><th aria-label="Actions" /></tr></thead>
                    <tbody>{appointments.map(appointment => (
                      <tr key={appointment.appointment_id}>
                        <td>{appointment.appointment_date}</td>
                        <td>{appointment.appointment_time}</td>
                        <td>Dr. {appointment.doctor_firstname} {appointment.doctor_lastname}<br /><small>{appointment.specialisation}</small></td>
                        <td>{appointment.reason || '—'}</td>
                        <td><span className={`dash-badge ${appointment.status}`}>{appointment.status}</span></td>
                        <td>{appointment.status !== 'cancelled' && <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => this.onCancel(appointment.appointment_id)}>Cancel</button>}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              ) : (
                <div className="dash-empty-state"><span>◎</span><p>No appointments booked yet.</p><small>Your upcoming visits will appear here.</small></div>
              )}
            </article>
          </section>
        </div>
      </DashboardLayout>
    );
  }
}

export default PatientAppointment;

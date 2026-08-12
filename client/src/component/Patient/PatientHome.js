import React, { Component } from 'react';
import doc_img from '../../photos/kiruddu/gallery8.jpg';
import 'mdbreact';
import Image from 'react-bootstrap/Image';
import axios from 'axios';
import FormField from '../Login/FormField';
import DashboardLayout from '../DashboardLayout';
import { patientNav } from '../dashboardNav';

class PatientHome extends Component {

    constructor(){
      super();
      this.state = {
        first_name: "",
        last_name: "",
        email: "",
        address: "",
        phone_no: "",
        disease: "",
        doctor_firstname: "",
        doctor_lastname: "",
        specialist: "",

        medicine_cost: 0,
        misc_charge: 0,
        room_charge: 0,
        operation_charge: 0,


        bill: [],

        appointments: [],
        prescriptions: [],

        edit_first_name: "",
        edit_last_name: "",
        edit_phone_no: "",
        edit_address: "",
        edit_disease: "",
        editMessage: '',
        editMessageType: '',

        current_password: '',
        new_password: '',
        confirm_new_password: '',
        passMessage: '',
        passMessageType: ''
      }

      this.onChange = this.onChange.bind(this);
      this.onSubmitEdit = this.onSubmitEdit.bind(this);
      this.onSubmitPassword = this.onSubmitPassword.bind(this);
    }

    componentDidMount(){
      this.fetchDetails();
      
      axios.get('/patient/doctor',{
        headers: {
          authorization: sessionStorage.getItem('usertoken')
        }
      })
        .then(res => {
          if(res.data.length !== 0) {
            const details = res.data[0];
            this.setState({
              doctor_firstname: details.doctor_firstname,
              doctor_lastname: details.doctor_lastname,
              specialist: details.specialisation
            })
          }
          else {
            this.setState({
              doctor_firstname: 'No Doctor Assigned'
            })
          } 
        });

      axios.get('/patient/bill', {
          headers: {
            authorization: sessionStorage.getItem('usertoken')
          }
        })
        .then(res => {
          if (res.data.length !== 0) {
            this.setState({
              medicine_cost: res.data[0].medicine_cost,
              misc_charge: res.data[0].misc_charge,
              room_charge: res.data[0].room_charge,
              operation_charge: res.data[0].operation_charge
            });
          }
        })
    }

    fetchDetails() {
      axios.get('/patient/details',{
        headers: {
          authorization: sessionStorage.getItem('usertoken')
        }
      })
        .then(res => {
          const details = res.data[0];
          this.setState({
            first_name: details.first_name,
            last_name: details.last_name,
            address: details.address,
            email: details.email,
            phone_no: details.phone_no,
            disease: details.disease,
            edit_first_name: details.first_name,
            edit_last_name: details.last_name,
            edit_address: details.address,
            edit_phone_no: details.phone_no,
            edit_disease: details.disease
          })
        });
    }

    onChange(e) {
      this.setState({ [e.target.name]: e.target.value })
    }

    onSubmitEdit(e) {
      e.preventDefault();

      const updates = {
        first_name: this.state.edit_first_name,
        last_name: this.state.edit_last_name,
        address: this.state.edit_address,
        phone_no: this.state.edit_phone_no,
        disease: this.state.edit_disease
      };

      axios.patch('/patient/update', updates, {
        headers: {
          authorization: sessionStorage.getItem('usertoken')
        }
      })
        .then(res => {
          this.setState({
            editMessage: res.data.message || 'Profile updated',
            editMessageType: 'success'
          });
          this.fetchDetails();
        })
        .catch(err => {
          const message = err.response && err.response.data && err.response.data.error
            ? err.response.data.error
            : 'Unable to update profile. Please try again.';
          this.setState({ editMessage: message, editMessageType: 'danger' });
        });
    }

    onSubmitPassword(e) {
      e.preventDefault();

      const { current_password, new_password, confirm_new_password } = this.state;

      if (!current_password || !new_password || !confirm_new_password) {
        this.setState({ passMessage: 'Please fill in all password fields', passMessageType: 'warning' });
        return;
      }
      if (new_password.length < 8) {
        this.setState({ passMessage: 'New password must be at least 8 characters long', passMessageType: 'warning' });
        return;
      }
      if (new_password !== confirm_new_password) {
        this.setState({ passMessage: 'New passwords do not match', passMessageType: 'warning' });
        return;
      }

      axios.post('/patient/change_password', { current_password, new_password }, {
        headers: {
          authorization: sessionStorage.getItem('usertoken')
        }
      })
        .then(res => {
          this.setState({
            passMessage: res.data.message || 'Password changed',
            passMessageType: 'success',
            current_password: '',
            new_password: '',
            confirm_new_password: ''
          });
        })
        .catch(err => {
          const message = err.response && err.response.data && err.response.data.error
            ? err.response.data.error
            : 'Unable to change password. Please try again.';
          this.setState({ passMessage: message, passMessageType: 'danger' });
        });
    }


    render() {
      const total = Number(this.state.misc_charge) + Number(this.state.room_charge)
        + Number(this.state.operation_charge) + Number(this.state.medicine_cost);

      return (
        <DashboardLayout title="Patient" items={patientNav}>
          <div className="dash-role-page">
            <header className="dash-role-header">
              <div>
                <p className="dash-eyebrow">Patient portal</p>
                <h1 className="dash-role-title">My profile</h1>
                <p className="dash-role-subtitle">Manage your details and review your care information.</p>
              </div>
              <span className="dash-status-pill">Account active</span>
            </header>

            <section className="dash-profile-grid" aria-label="Patient overview">
              <article className="dash-card dash-info-card">
                <div className="dash-card-heading">
                  <div><p className="dash-eyebrow">Account</p><h2 className="dash-card-title">Patient information</h2></div>
                  <span className="dash-card-icon">◎</span>
                </div>
                <dl className="dash-definition-list">
                  <div><dt>Name</dt><dd>{this.state.first_name} {this.state.last_name}</dd></div>
                  <div><dt>Email</dt><dd>{this.state.email || '—'}</dd></div>
                  <div><dt>Phone</dt><dd>{this.state.phone_no || '—'}</dd></div>
                  <div><dt>Address</dt><dd>{this.state.address || '—'}</dd></div>
                  <div><dt>Condition</dt><dd>{this.state.disease || 'Not specified'}</dd></div>
                </dl>
              </article>

              <article className="dash-card dash-doctor-card">
                <div className="dash-card-heading">
                  <div><p className="dash-eyebrow">Care team</p><h2 className="dash-card-title">Assigned doctor</h2></div>
                  <span className="dash-card-icon blue">+</span>
                </div>
                <div className="dash-doctor-summary">
                  <Image src={doc_img} alt="Assigned doctor" className="dash-doctor-image" thumbnail />
                  <div>
                    <h3>{this.state.doctor_firstname} {this.state.doctor_lastname}</h3>
                    <p>{this.state.specialist || 'No specialty recorded'}</p>
                    <span>The doctor currently assigned to your care.</span>
                  </div>
                </div>
              </article>

              <article className="dash-card dash-bill-card">
                <div className="dash-card-heading">
                  <div><p className="dash-eyebrow">Billing</p><h2 className="dash-card-title">Current bill</h2></div>
                  <span className="dash-total-value">UGX {total.toLocaleString()}</span>
                </div>
                <dl className="dash-definition-list dash-bill-list">
                  <div><dt>Medicine cost</dt><dd>UGX {Number(this.state.medicine_cost).toLocaleString()}</dd></div>
                  <div><dt>Operation charge</dt><dd>UGX {Number(this.state.operation_charge).toLocaleString()}</dd></div>
                  <div><dt>Room charge</dt><dd>UGX {Number(this.state.room_charge).toLocaleString()}</dd></div>
                  <div><dt>Miscellaneous</dt><dd>UGX {Number(this.state.misc_charge).toLocaleString()}</dd></div>
                </dl>
              </article>
            </section>

            <section className="dash-card dash-form-card">
              <div className="dash-card-heading">
                <div><p className="dash-eyebrow">Profile settings</p><h2 className="dash-card-title">Edit your details</h2></div>
                <span className="dash-card-note">Changes are saved securely</span>
              </div>
              {this.state.editMessage !== '' && <div className={`alert alert-${this.state.editMessageType} auth-alert`} role="alert">{this.state.editMessage}</div>}
              <form noValidate onSubmit={this.onSubmitEdit}>
                <div className="dash-form-grid">
                  <FormField label="First name" name="edit_first_name" value={this.state.edit_first_name} onChange={this.onChange} required />
                  <FormField label="Last name" name="edit_last_name" value={this.state.edit_last_name} onChange={this.onChange} required />
                  <FormField label="Phone number" name="edit_phone_no" type="tel" value={this.state.edit_phone_no} onChange={this.onChange} required />
                  <FormField label="Condition" name="edit_disease" value={this.state.edit_disease} onChange={this.onChange} help="The condition you are being treated for." />
                  <div className="dash-form-full"><FormField label="Address" name="edit_address" value={this.state.edit_address} onChange={this.onChange} /></div>
                </div>
                <div className="dash-form-actions"><button type="submit" className="btn btn-primary">Save changes</button></div>
              </form>
            </section>

            <details className="dash-disclosure">
              <summary><span>Security</span><small>Change your password</small></summary>
              <div className="dash-card dash-form-card dash-disclosure-content">
                {this.state.passMessage !== '' && <div className={`alert alert-${this.state.passMessageType} auth-alert`} role="alert">{this.state.passMessage}</div>}
                <form noValidate onSubmit={this.onSubmitPassword}>
                  <div className="dash-form-grid">
                    <FormField label="Current password" name="current_password" type="password" value={this.state.current_password} onChange={this.onChange} autoComplete="current-password" required />
                    <FormField label="New password" name="new_password" type="password" value={this.state.new_password} onChange={this.onChange} autoComplete="new-password" help="At least 8 characters." required />
                    <FormField label="Confirm new password" name="confirm_new_password" type="password" value={this.state.confirm_new_password} onChange={this.onChange} autoComplete="new-password" required />
                  </div>
                  <div className="dash-form-actions"><button type="submit" className="btn btn-primary">Update password</button></div>
                </form>
              </div>
            </details>

          </div>
        </DashboardLayout>
      );



    }
}
 
export default PatientHome;

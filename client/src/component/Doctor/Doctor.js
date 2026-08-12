import React, { Component } from 'react';
import axios from 'axios';

import DashboardLayout from '../DashboardLayout';
import { doctorNav } from '../dashboardNav';
import 'mdbreact';
import FormField from '../Login/FormField';

class Doctor extends Component {
  constructor(){
    super();
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      address: "",
      phone_no: "",
      salary: '',
      shift_time: '',
      specialisation: '',

      isLoading: true,

      patients: [],

      edit_first_name: "",
      edit_last_name: "",
      edit_address: "",
      edit_specialisation: "",
      edit_shift_time: "",
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
    axios.get('/doctor/profile',{
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(res => {
        const details = res.data[0];
        this.setState({
          first_name: details.first_name,
          last_name: details.last_name,
          email: details.email,
          address: details.address,
          salary: details.salary,
          shift_time: details.shift_time,
          specialisation: details.specialisation,
          edit_first_name: details.first_name,
          edit_last_name: details.last_name,
          edit_address: details.address,
          edit_specialisation: details.specialisation,
          edit_shift_time: details.shift_time
        })
      });
    
    axios.get('/doctor/patient',{
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(res => {
        this.setState({patients: res.data});
        this.setState({isLoading: false});
      })

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
      specialisation: this.state.edit_specialisation,
      shift_time: this.state.edit_shift_time
    };

    axios.patch('/doctor/profile', updates, {
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(res => {
        this.setState({
          editMessage: res.data.message || 'Profile updated',
          editMessageType: 'success',
          first_name: this.state.edit_first_name,
          last_name: this.state.edit_last_name,
          address: this.state.edit_address,
          specialisation: this.state.edit_specialisation,
          shift_time: this.state.edit_shift_time
        });
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

    axios.post('/doctor/change_password', { current_password, new_password }, {
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

      const { patients, isLoading} = this.state;
        return ( 
        <DashboardLayout title="Doctor" items={doctorNav}>
        <div className ="dash-role-page">
            <header className="dash-role-header">
              <div>
                <p className="dash-eyebrow">Settings</p>
                <h1 className="dash-role-title">Your profile</h1>
                <p className="dash-role-subtitle">Keep your professional details and account security up to date.</p>
              </div>
              <span className="dash-status-pill">Doctor workspace</span>
            </header>
                 
        <div className="row">
        <div className="col-lg-6">
        <div className="container ml-3">
    <div className="jumbotron mt-5" style ={{backgroundColor:"#e0e0e0"}}>
      <div className="col-sm-6">
        <h2 className="text-primary">Doctor Information</h2>
      </div>
      <br/>

      <div className="table-responsive">
      <table className="table col-md-6" >
        <tbody>
          <tr>
            <td> Name</td>
            <td>
              {this.state.first_name} {this.state.last_name}
            </td>
          </tr>
          <tr>
          <td>Specialization</td>
              <td>{this.state.specialisation}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{this.state.email}</td>
          </tr>
          <tr>
          <td>Address</td>
          <td>{this.state.address}</td>
        </tr>
        <tr>
        <td>Phone Number</td>
            <td>{this.state.phone_no}</td>
        </tr>
        <tr>
        <td>Salary Information</td>
            <td>{this.state.salary}</td>
        </tr>

        <tr>
        <td>Shift Time</td>
            <td>{this.state.shift_time}</td>
        </tr>
        </tbody>
      </table>
      </div>
    </div>
  </div>
  </div>
  <div className="col-lg-6 mr-3">
  <div className="jumbotron mt-5" style ={{backgroundColor:"#e0e0e0"}}>
  <h2 className="text-primary">Patients Assigned</h2>
  <br />
  <div className="list-group-flush" style ={{backgroundColor:"#e0e0e0"}}>
  
    
  {!isLoading ? patients.map(patient => {
    return (
      <div key={patient.patient_id} className="list-group-item"  style ={{backgroundColor:"#e0e0e0"}}>
        <p  className="mb-0" style ={{backgroundColor:"#e0e0e0"}}><i className="fab fa-slack-hash fa-2x mr-4 purple p-3 white-text rounded " aria-hidden="true"></i> {patient.first_name} {patient.last_name} </p>
        </div>
    )
    }) : <h4>Loading</h4>}
  </div>
    
  </div>
</div>
</div>

<div className="row">
  <div className="col-lg-8 mx-auto">
    <div className="jumbotron mt-5" style={{ backgroundColor: "#e0e0e0" }}>
      <div className="col-sm-10">
        <h2 className="text-primary">Edit Your Details</h2>
      </div>
      <br />
      {this.state.editMessage !== '' && (
        <div className={`alert alert-${this.state.editMessageType} auth-alert`} role="alert">
          {this.state.editMessage}
        </div>
      )}
      <form noValidate onSubmit={this.onSubmitEdit}>
        <div className="row">
          <div className="col-sm-6">
            <FormField
              label="First name"
              name="edit_first_name"
              value={this.state.edit_first_name}
              onChange={this.onChange}
              required
            />
          </div>
          <div className="col-sm-6">
            <FormField
              label="Last name"
              name="edit_last_name"
              value={this.state.edit_last_name}
              onChange={this.onChange}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <FormField
              label="Specialization"
              name="edit_specialisation"
              value={this.state.edit_specialisation}
              onChange={this.onChange}
              placeholder="e.g. Cardiologist"
            />
          </div>
          <div className="col-sm-6">
            <FormField
              label="Shift time"
              name="edit_shift_time"
              value={this.state.edit_shift_time}
              onChange={this.onChange}
              placeholder="e.g. 08:00 - 14:00"
            />
          </div>
        </div>
        <FormField
          label="Address"
          name="edit_address"
          value={this.state.edit_address}
          onChange={this.onChange}
        />
        <button type="submit" className="btn btn-lg btn-primary btn-block">
          Save Changes
        </button>
      </form>
    </div>
  </div>
</div>
<details className="dash-disclosure">
  <summary><span>Security</span><small>Change your password</small></summary>
<div className="row dash-disclosure-content">
  <div className="col-lg-8 mx-auto">
    <div className="jumbotron mt-5" style={{ backgroundColor: "#e0e0e0" }}>
      <div className="col-sm-10">
        <h2 className="text-primary">Change Password</h2>
      </div>
      <br />
      {this.state.passMessage !== '' && (
        <div className={`alert alert-${this.state.passMessageType} auth-alert`} role="alert">
          {this.state.passMessage}
        </div>
      )}
      <form noValidate onSubmit={this.onSubmitPassword}>
        <FormField
          label="Current password"
          name="current_password"
          type="password"
          value={this.state.current_password}
          onChange={this.onChange}
          autoComplete="current-password"
          required
        />
        <div className="row">
          <div className="col-sm-6">
            <FormField
              label="New password"
              name="new_password"
              type="password"
              value={this.state.new_password}
              onChange={this.onChange}
              autoComplete="new-password"
              help="At least 8 characters."
              required
            />
          </div>
          <div className="col-sm-6">
            <FormField
              label="Confirm new password"
              name="confirm_new_password"
              type="password"
              value={this.state.confirm_new_password}
              onChange={this.onChange}
              autoComplete="new-password"
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-lg btn-primary btn-block">
          Change Password
        </button>
      </form>
    </div>
  </div>
 </div>
</details>

  </div>
  </DashboardLayout>
    

           
        );
    }
}
 
export default Doctor;

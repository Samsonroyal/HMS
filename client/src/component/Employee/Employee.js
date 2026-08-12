import React, { Component } from 'react';
import Axios from 'axios';
import FormField from '../Login/FormField';
import DashboardLayout from '../DashboardLayout';
import { employeeNav } from '../dashboardNav';

class Employee extends Component {
  constructor() {
    super();
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      address: '',
      phone_no: '',
      designation: '',
      salary: '',

      patient_id: '',
      doctor_id: '',

      doctor_first_name: '',
      doctor_address: '',
      doctor_last_name: '',
      doctor_email: '',
      doctor_password: '',
      doctor_salary: '',
      doctor_specialization: '',

      bill_patient_email: '',
      medicine_cost: '0',
      room_charge: '0',
      misc_charge: '0',
      operation_charge: '0',

      del_doctor_id: '',

      new_salary: '',
      update_doctor_id: '',

      unassign_patient_id: '',

      edit_first_name: '',
      edit_last_name: '',
      edit_address: '',
      edit_phone_no: '',

      current_password: '',
      new_password: '',
      confirm_new_password: '',
      passMessage: '',
      passMessageType: '',

      errors: {},
      message: '',
      messageType: '',
      editMessage: '',
      editMessageType: ''
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit1 = this.onSubmit1.bind(this)
    this.onSubmit2 = this.onSubmit2.bind(this)
    this.onSubmit3 = this.onSubmit3.bind(this)
    this.onSubmit4 = this.onSubmit4.bind(this)
    this.onSubmit5 = this.onSubmit5.bind(this)
    this.onSubmitEdit = this.onSubmitEdit.bind(this)
    this.onSubmitUnassign = this.onSubmitUnassign.bind(this)
    this.onSubmitPassword = this.onSubmitPassword.bind(this)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit1(e) {
    e.preventDefault();

    if (!this.state.patient_id || !this.state.doctor_id) {
      this.setState({ message: 'Please provide both patient ID and doctor ID to assign', messageType: 'warning' });
      return;
    }

    const ass_doc = {
      patient_id: this.state.patient_id,
      doctor_id: this.state.doctor_id
    }

    Axios.post('/admin/assign_doctor', ass_doc, {
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(response => {
        this.setState({ message: response.data.message || 'Doctor assigned successfully', messageType: 'success', patient_id: '', doctor_id: '' });
      })
      .catch(err => {
        const message = err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : 'Unable to assign doctor. Please try again.';
        this.setState({ message, messageType: 'danger' });
      });
  }

  onSubmit2(e) {
    e.preventDefault();

    if (!this.state.doctor_first_name || !this.state.doctor_last_name || !this.state.doctor_email || !this.state.doctor_password) {
      this.setState({ message: 'Please fill in the doctor name, email and password', messageType: 'warning' });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(this.state.doctor_email)) {
      this.setState({ message: 'Please enter a valid email address for the doctor', messageType: 'warning' });
      return;
    }

    const ass_doc = {
      first_name: this.state.doctor_first_name,
      address: this.state.doctor_address,
      last_name: this.state.doctor_last_name,
      email: this.state.doctor_email,
      password: this.state.doctor_password,
      salary: this.state.doctor_salary,
      specialisation: this.state.doctor_specialization,
      shift_time: '10:00 - 02:00'
    }
    
    Axios.post('/doctor/register', ass_doc, {
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(response => {
        this.setState({ message: response.data.message || 'Doctor registered successfully', messageType: 'success' });
        this.setState({ doctor_first_name: '', doctor_address: '', doctor_last_name: '', doctor_email: '', doctor_password: '', doctor_salary: '', doctor_specialization: '' });
      })
      .catch(err => {
        const message = err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : 'Unable to register doctor. Please try again.';
        this.setState({ message, messageType: 'danger' });
      });
  }


  onSubmit3(e) {
    e.preventDefault();

    if (!this.state.bill_patient_email) {
      this.setState({ message: 'Please provide the patient email for the bill', messageType: 'warning' });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(this.state.bill_patient_email)) {
      this.setState({ message: 'Please enter a valid patient email', messageType: 'warning' });
      return;
    }

    const data = {
      patient_email: this.state.bill_patient_email,
      medicine_cost: this.state.medicine_cost,
      room_charge: this.state.room_charge,
      misc_charge: this.state.misc_charge,
      operation_charge: this.state.operation_charge,
    }

    Axios.post('/admin/bill', data, {
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(response => {
        this.setState({ message: response.data.message || 'Bill generated successfully', messageType: 'success' });
      })
      .catch(err => {
        const message = err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : 'Unable to generate bill. Please try again.';
        this.setState({ message, messageType: 'danger' });
      });
  }


  onSubmit4(e) {
    e.preventDefault();

    if (!this.state.del_doctor_id) {
      this.setState({ message: 'Please provide a doctor ID to delete', messageType: 'warning' });
      return;
    }

    const ok = window.confirm(`Delete doctor with ID ${this.state.del_doctor_id}? This cannot be undone.`);
    if (!ok) return;

    const data = {
      doctor_id: this.state.del_doctor_id
    }

    Axios.post('/doctor/delete', data, {
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(response => {
        this.setState({ message: response.data.message || 'Doctor deleted successfully', messageType: 'success', del_doctor_id: '' });
      })
      .catch(err => {
        const message = err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : 'Unable to delete doctor. Please try again.';
        this.setState({ message, messageType: 'danger' });
      });
  }


  onSubmit5(e) {
    e.preventDefault();

    if (!this.state.update_doctor_id || this.state.new_salary === '') {
      this.setState({ message: 'Please provide a doctor ID and the new salary', messageType: 'warning' });
      return;
    }
    if (isNaN(Number(this.state.new_salary))) {
      this.setState({ message: 'Salary must be a number', messageType: 'warning' });
      return;
    }

    const data = {
      doctor_id: this.state.update_doctor_id,
      salary: this.state.new_salary
    }

    Axios.post('/doctor/update_sal', data, {
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(response => {
        this.setState({ message: response.data.message || 'Salary updated successfully', messageType: 'success' });
      })
      .catch(err => {
        const message = err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : 'Unable to update salary. Please try again.';
        this.setState({ message, messageType: 'danger' });
      });
  }


  onSubmitEdit(e) {
    e.preventDefault();

    const updates = {
      first_name: this.state.edit_first_name,
      last_name: this.state.edit_last_name,
      address: this.state.edit_address,
      phone_no: this.state.edit_phone_no
    };

    Axios.patch('/admin/update', updates, {
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(response => {
        this.setState({
          editMessage: response.data.message || 'Profile updated successfully',
          editMessageType: 'success',
          first_name: this.state.edit_first_name,
          last_name: this.state.edit_last_name,
          address: this.state.edit_address,
          phone_no: this.state.edit_phone_no
        });
      })
      .catch(err => {
        const message = err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : 'Unable to update profile. Please try again.';
        this.setState({ editMessage: message, editMessageType: 'danger' });
      });
  }

  onSubmitUnassign(e) {
    e.preventDefault();

    if (!this.state.unassign_patient_id) {
      this.setState({ message: 'Please provide a patient ID to unassign', messageType: 'warning' });
      return;
    }

    const ok = window.confirm(`Unassign the doctor from patient ${this.state.unassign_patient_id}?`);
    if (!ok) return;

    const data = {
      patient_id: this.state.unassign_patient_id
    }

    Axios.post('/admin/remove_assign', data, {
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(response => {
        this.setState({ message: response.data.message || 'Assignment removed', messageType: 'success', unassign_patient_id: '' });
      })
      .catch(err => {
        const message = err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : 'Unable to remove assignment. Please try again.';
        this.setState({ message, messageType: 'danger' });
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

    Axios.post('/admin/change_password', { current_password, new_password }, {
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(response => {
        this.setState({
          passMessage: response.data.message || 'Password changed',
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


  componentDidMount() {
    Axios.get('/admin/details', {
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
          phone_no: details.phone_no,
          designation: details.designation,
          salary: details.salary,
          edit_first_name: details.first_name,
          edit_last_name: details.last_name,
          edit_address: details.address,
          edit_phone_no: details.phone_no
        });
      });

  }

    
    render() { 
        return ( 
        <DashboardLayout title="Employee" items={employeeNav}>
        <div className="dash-role-page">
            <header className="dash-role-header">
              <div>
                <p className="dash-eyebrow">Settings &amp; operations</p>
                <h1 className="dash-role-title">Employee workspace</h1>
                <p className="dash-role-subtitle">Manage your profile and the day-to-day hospital workflow.</p>
              </div>
              <span className="dash-status-pill">Staff workspace</span>
            </header>
            {this.state.message && (
              <div className={`container mt-3 alert alert-${this.state.messageType}`} role="alert">
                {this.state.message}
              </div>
            )}
            <br/>            
            <div className="row">
            <div className="col-lg-6">
            <div className="container ml-3">
        <div className="jumbotron mt-5" style ={{backgroundColor:"#e0e0e0"}}>
          <div className="col-sm-6">
            <h2 className="text-primary">Employee Information</h2>
          </div>
          <br/>

          <div className="table-responsive">
          <table className="table col-md-6" >
            <tbody>
              <tr>
                <td>Name</td>
                <td>
                  {this.state.first_name} {this.state.last_name}
                </td>
              </tr>
              <tr>
                <td>Email</td>
                <td> {this.state.email} </td>
              </tr>
              <tr>
              <td>Address</td>
              <td> {this.state.address} </td>
            </tr>
            <tr>
            <td>Phone number</td>
                <td> {this.state.phone_no} </td>
            </tr>
            <tr>
                <td>Designation </td>
                <td> {this.state.designation} </td>
            </tr>
            <tr>
                <td>Salary</td>
                <td> {this.state.salary} </td>
            </tr>   

            </tbody>
          </table>
          </div>
        </div>
      </div>
      </div>
      
      <div className="col-lg-6 mb-1">
      <div className="container mr-3">
      <div className="jumbotron mt-5" style ={{backgroundColor:"#e0e0e0"}}>
      <form noValidate onSubmit={this.onSubmit1} >
        <div className="col-sm-8">
          <h2 className="text-primary">Assign Patient to Doctor</h2>
        </div>
        <br/>
        <FormField
          label="Patient ID"
          name="patient_id"
          value={this.state.patient_id}
          onChange={this.onChange}
          placeholder="e.g. 12"
          required
        />
        <FormField
          label="Doctor ID"
          name="doctor_id"
          value={this.state.doctor_id}
          onChange={this.onChange}
          placeholder="e.g. 3"
          required
        />
        <button
          type="submit"
          className="btn btn-lg btn-primary btn-block"
        >
          Assign
        </button>
      </form>
      </div>
    </div>
      </div>
      </div>
      



      <div className="row">
          <div className = "col-lg-6">
          <div className="container mr-3">
          <div className="jumbotron mt-5" style ={{backgroundColor:"#e0e0e0"}}>
          <form noValidate onSubmit={this.onSubmit2} >
            <div className="col-sm-8">
              <h2 className="text-primary">Add a New Doctor</h2>
            </div>
            <br/>
            <div className="row">
              <div className="col-sm-6">
                <FormField
                  label="First name"
                  name="doctor_first_name"
                  value={this.state.doctor_first_name}
                  onChange={this.onChange}
                  placeholder="Doctor's first name"
                  autoComplete="given-name"
                  required
                />
              </div>
              <div className="col-sm-6">
                <FormField
                  label="Last name"
                  name="doctor_last_name"
                  value={this.state.doctor_last_name}
                  onChange={this.onChange}
                  placeholder="Doctor's last name"
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>
            <FormField
              label="Email address"
              name="doctor_email"
              type="email"
              value={this.state.doctor_email}
              onChange={this.onChange}
              placeholder="doctor@example.com"
              autoComplete="email"
              required
            />
            <FormField
              label="Specialization"
              name="doctor_specialization"
              value={this.state.doctor_specialization}
              onChange={this.onChange}
              placeholder="e.g. Cardiologist"
            />
            <div className="row">
              <div className="col-sm-6">
                <FormField
                  label="Salary"
                  name="doctor_salary"
                  value={this.state.doctor_salary}
                  onChange={this.onChange}
                  placeholder="Monthly salary"
                  help="Optional — numbers only."
                />
              </div>
              <div className="col-sm-6">
                <FormField
                  label="Address"
                  name="doctor_address"
                  value={this.state.doctor_address}
                  onChange={this.onChange}
                  placeholder="Residential address"
                />
              </div>
            </div>
            <FormField
              label="Password"
              name="doctor_password"
              type="password"
              value={this.state.doctor_password}
              onChange={this.onChange}
              placeholder="Temporary password"
              autoComplete="new-password"
              required
            />
            <button
              type="submit"
              className="btn btn-lg btn-primary btn-block"
            >
              Add Doctor
            </button>
          </form>
          </div>
        </div>
          
          </div>







        <div className = "col-lg-6">
        <div className="container mr-3">
        <div className="jumbotron mt-5" style ={{backgroundColor:"#e0e0e0"}}>
        <form noValidate onSubmit={this.onSubmit3} >
          <div className="col-sm-8">
            <h2 className="text-primary">Generate Bill for Patient</h2>
          </div>
          <br/>
          <FormField
            label="Patient email"
            name="bill_patient_email"
            type="email"
            value={this.state.bill_patient_email}
            onChange={this.onChange}
            placeholder="patient@example.com"
            required
          />
          <div className="row">
            <div className="col-sm-6">
              <FormField
                label="Medicine cost"
                name="medicine_cost"
                value={this.state.medicine_cost}
                onChange={this.onChange}
                placeholder="0"
                help="Shillings (UGX)."
              />
            </div>
            <div className="col-sm-6">
              <FormField
                label="Operation charge"
                name="operation_charge"
                value={this.state.operation_charge}
                onChange={this.onChange}
                placeholder="0"
              />
            </div>
            <div className="col-sm-6">
              <FormField
                label="Room charge"
                name="room_charge"
                value={this.state.room_charge}
                onChange={this.onChange}
                placeholder="0"
              />
            </div>
            <div className="col-sm-6">
              <FormField
                label="Miscellaneous charge"
                name="misc_charge"
                value={this.state.misc_charge}
                onChange={this.onChange}
                placeholder="0"
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-lg btn-primary btn-block"
          >
            Generate Bill
          </button>
        </form>
        </div>
      </div>
        </div>
        </div>



        <div className = "row">
          <div className = "col-lg-6">
         
      <div className="container mr-3">
      <div className="jumbotron mt-5" style ={{backgroundColor:"#e0e0e0"}}>
      <form noValidate onSubmit={this.onSubmit4} >
        <div className="col-sm-8">
          <h3 className="text-primary">Delete a Doctor</h3>
        </div>
        <br/>
        <FormField
          label="Doctor ID"
          name="del_doctor_id"
          value={this.state.del_doctor_id}
          onChange={this.onChange}
          placeholder="e.g. 3"
          help="The doctor's ID from the doctors list. This action cannot be undone."
          required
        />
        <button
          type="submit"
          className="btn btn-lg btn-danger btn-block"
        >
          Delete Doctor
        </button>
      </form>
      </div>
    </div>
    </div>
    <div className="col-lg-6">
    <div className="container mr-3">
    <div className="jumbotron mt-5" style ={{backgroundColor:"#e0e0e0"}}>
    <form noValidate onSubmit={this.onSubmit5} >
      <div className="col-sm-8">
        <h2 className="text-primary">Update Doctor Salary</h2>
      </div>
      <br/>
      <FormField
        label="Doctor ID"
        name="update_doctor_id"
        value={this.state.update_doctor_id}
        onChange={this.onChange}
        placeholder="e.g. 3"
        required
      />
      <FormField
        label="New salary"
        name="new_salary"
        value={this.state.new_salary}
        onChange={this.onChange}
        placeholder="Monthly salary"
        help="Shillings (UGX), numbers only."
        required
      />
      <button
        type="submit"
        className="btn btn-lg btn-primary btn-block"
      >
        Update Salary
      </button>
    </form>
    </div>

    </div>
        </div>
        </div>

    <br/>
    <br/>
    <div className="row">
      <div className="col-lg-6">
        <div className="container ml-3">
          <div className="jumbotron mt-5" style={{ backgroundColor: "#e0e0e0" }}>
            <div className="col-sm-8">
              <h2 className="text-primary">Edit Your Details</h2>
            </div>
            <br />
            {this.state.editMessage !== '' && (
              <div className={`alert alert-${this.state.editMessageType}`} role="alert">
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
              <FormField
                label="Phone number"
                name="edit_phone_no"
                type="tel"
                value={this.state.edit_phone_no}
                onChange={this.onChange}
              />
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
      <div className="col-lg-6">
        <div className="container mr-3">
          <div className="jumbotron mt-5" style={{ backgroundColor: "#e0e0e0" }}>
            <form noValidate onSubmit={this.onSubmitUnassign}>
              <div className="col-sm-8">
                <h2 className="text-primary">Remove Doctor Assignment</h2>
              </div>
              <br />
              <FormField
                label="Patient ID"
                name="unassign_patient_id"
                value={this.state.unassign_patient_id}
                onChange={this.onChange}
                placeholder="e.g. 12"
                help="Removes the doctor assigned to this patient."
                required
              />
              <button type="submit" className="btn btn-lg btn-danger btn-block">
                Unassign Doctor
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <details className="dash-disclosure">
      <summary><span>Security</span><small>Change your password</small></summary>
    <div className="row dash-disclosure-content">
      <div className="col-lg-8 mx-auto">
        <div className="jumbotron mt-5" style={{ backgroundColor: "#e0e0e0" }}>
          <div className="col-sm-8">
            <h2 className="text-primary">Change Password</h2>
          </div>
          <br />
          {this.state.passMessage !== '' && (
            <div className={`alert alert-${this.state.passMessageType}`} role="alert">
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
 
export default Employee;

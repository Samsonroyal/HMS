import React, { Component } from 'react';
import axios from 'axios';
import FormField from '../Login/FormField';
import DashboardLayout from '../DashboardLayout';
import { adminNav } from '../dashboardNav';

class Admin extends Component {

  constructor(){
    super();
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      address: "",
      phone_no: "",
      designation: '',
      salary: '',
      password: '',

      del_emp_id: '',
      message: '',
      messageType: '',

      update_emp_id: '',
      new_salary: '',

      logs: [],
      logFilter: 'all'
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit1 = this.onSubmit1.bind(this)
    this.onSubmit2 = this.onSubmit2.bind(this)
    this.onSubmit3 = this.onSubmit3.bind(this)
    this.fetchLogs = this.fetchLogs.bind(this)
  }
  
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  componentDidMount() {
    this.fetchLogs();
  }

  fetchLogs() {
    const filter = this.state.logFilter === 'all' ? '' : this.state.logFilter;
    axios.get('/admin/logs', {
      params: { user_type: filter },
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(res => this.setState({ logs: res.data }))
      .catch(err => {
        const message = err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : 'Unable to load activity log.';
        this.setState({ message, messageType: 'danger' });
      });
  }

  onSubmit1(e) {
    e.preventDefault();

    const { first_name, last_name, email, designation, password } = this.state;

    if (!first_name || !last_name || !email || !designation || !password) {
      this.setState({ message: 'Please fill in first name, last name, email, designation and password', messageType: 'warning' });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      this.setState({ message: 'Please enter a valid email address', messageType: 'warning' });
      return;
    }

    const emp = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      address: this.state.address,
      phone_no: this.state.phone_no,
      designation: this.state.designation,
      salary: this.state.salary,
      password: this.state.password
    }

    axios.post('/admin/register', emp, {
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(res => {
        this.setState({ message: res.data.message || 'Employee registered successfully', messageType: 'success' });
        this.setState({ first_name: '', last_name: '', email: '', address: '', phone_no: '', designation: '', salary: '', password: '' });
      })
      .catch(err => {
        const message = err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : 'Unable to register employee. Please try again.';
        this.setState({ message, messageType: 'danger' });
      });
  }

  onSubmit2(e) {
    e.preventDefault();

    if (!this.state.del_emp_id) {
      this.setState({ message: 'Please provide an employee ID to delete', messageType: 'warning' });
      return;
    }

    const ok = window.confirm(`Delete employee with ID ${this.state.del_emp_id}? This cannot be undone.`);
    if (!ok) return;

    axios.post('/admin/delete', { admin_id: this.state.del_emp_id }, {
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(res => {
        this.setState({ message: res.data.message || 'Employee deleted successfully', messageType: 'success', del_emp_id: '' });
      })
      .catch(err => {
        const message = err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : 'Unable to delete employee. Please try again.';
        this.setState({ message, messageType: 'danger' });
      });
  }

  onSubmit3(e) {
    e.preventDefault();

    if (!this.state.update_emp_id || this.state.new_salary === '') {
      this.setState({ message: 'Please provide an employee ID and the new salary', messageType: 'warning' });
      return;
    }
    if (isNaN(Number(this.state.new_salary)) || Number(this.state.new_salary) < 0) {
      this.setState({ message: 'Salary must be a non-negative number', messageType: 'warning' });
      return;
    }

    const data = {
      admin_id: this.state.update_emp_id,
      salary: this.state.new_salary
    };

    axios.post('/admin/update_sal', data, {
      headers: {
        authorization: sessionStorage.getItem('usertoken')
      }
    })
      .then(res => {
        this.setState({ message: res.data.message || 'Salary updated successfully', messageType: 'success', update_emp_id: '', new_salary: '' });
      })
      .catch(err => {
        const message = err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : 'Unable to update salary. Please try again.';
        this.setState({ message, messageType: 'danger' });
      });
  }



    render() { 
        return ( 
        <DashboardLayout title="Admin" items={adminNav}>
        <div className="dash-role-page">
            <header className="dash-role-header">
              <div>
                <p className="dash-eyebrow">Settings &amp; administration</p>
                <h1 className="dash-role-title">Administrator workspace</h1>
                <p className="dash-role-subtitle">Manage staff, salaries, billing, and platform activity.</p>
              </div>
              <span className="dash-status-pill">Admin workspace</span>
            </header>
            {this.state.message && (
              <div className={`container mt-3 alert alert-${this.state.messageType}`} role="alert">
                {this.state.message}
              </div>
            )}
            <br></br>
            <br></br>
            <div className ="row">
              <div className = "col-lg-6">
              <div className="container mx-auto">
              <div className="jumbotron mt-5" style ={{backgroundColor:"#e0e0e0"}}>
              <form noValidate onSubmit={this.onSubmit1} >
                <div className="col-sm-8">
                  <h2 className="text-primary">Add a New Employee</h2>
                </div>
                <br/>
                <div className="row">
                  <div className="col-sm-6">
                    <FormField
                      label="First name"
                      name="first_name"
                      value={this.state.first_name}
                      onChange={this.onChange}
                      placeholder="Employee's first name"
                      autoComplete="given-name"
                      required
                    />
                  </div>
                  <div className="col-sm-6">
                    <FormField
                      label="Last name"
                      name="last_name"
                      value={this.state.last_name}
                      onChange={this.onChange}
                      placeholder="Employee's last name"
                      autoComplete="family-name"
                      required
                    />
                  </div>
                </div>
                <FormField
                  label="Email address"
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  placeholder="employee@example.com"
                  autoComplete="email"
                  required
                />
                <FormField
                  label="Designation"
                  name="designation"
                  value={this.state.designation}
                  onChange={this.onChange}
                  placeholder="e.g. Nurse, Receptionist"
                  required
                />
                <div className="row">
                  <div className="col-sm-6">
                    <FormField
                      label="Salary"
                      name="salary"
                      value={this.state.salary}
                      onChange={this.onChange}
                      placeholder="Monthly salary"
                      help="Optional — numbers only."
                    />
                  </div>
                  <div className="col-sm-6">
                    <FormField
                      label="Phone number"
                      name="phone_no"
                      type="tel"
                      value={this.state.phone_no}
                      onChange={this.onChange}
                      placeholder="e.g. 0771 234 567"
                      autoComplete="tel"
                    />
                  </div>
                </div>
                <FormField
                  label="Address"
                  name="address"
                  value={this.state.address}
                  onChange={this.onChange}
                  placeholder="Residential address"
                  autoComplete="street-address"
                />
                <FormField
                  label="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  placeholder="Temporary password"
                  autoComplete="new-password"
                  required
                />
              <button
               type="submit"
              className="btn btn-lg btn-primary btn-block"
              >
              Enter Employee
              </button>
              </form>
              </div>
            </div>
              </div>

              <div className = "col-lg-6">
              <div className="container mr-3">
              <div className="jumbotron mt-5" style ={{backgroundColor:"#e0e0e0"}}>
              <form noValidate onSubmit={this.onSubmit2} >
                <div className="col-sm-10">
                  <h3 className="text-primary">Delete an Employee</h3>
                </div>
                <br/>
                <FormField
                  label="Employee ID"
                  name="del_emp_id"
                  value={this.state.del_emp_id}
                  onChange={this.onChange}
                  placeholder="e.g. 5"
                  help="The employee's ID from the staff list. This action cannot be undone."
                  required
                />
              <button
              type="submit"
              className="btn btn-lg btn-danger btn-block"
              >
              Delete Employee
              </button>
            </form>
              </div>
            </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 mx-auto">
                <div className="container mx-auto">
                  <div className="jumbotron mt-5" style={{ backgroundColor: "#e0e0e0" }}>
                    <form noValidate onSubmit={this.onSubmit3}>
                      <div className="col-sm-10">
                        <h3 className="text-primary">Update Employee Salary</h3>
                      </div>
                      <br />
                      <FormField
                        label="Employee ID"
                        name="update_emp_id"
                        value={this.state.update_emp_id}
                        onChange={this.onChange}
                        placeholder="e.g. 5"
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
                      <button type="submit" className="btn btn-lg btn-primary btn-block">
                        Update Salary
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-10 mx-auto">
                <div className="jumbotron mt-5" style={{ backgroundColor: "#e0e0e0" }}>
                  <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
                    <h2 className="text-primary mb-0">Activity Log</h2>
                    <div className="d-flex align-items-center">
                      <label className="mr-2 mb-0 auth-label" htmlFor="logFilter">Show</label>
                      <select
                        id="logFilter"
                        name="logFilter"
                        className="form-control"
                        style={{ minWidth: 160 }}
                        value={this.state.logFilter}
                        onChange={e => this.setState({ logFilter: e.target.value }, this.fetchLogs)}
                      >
                        <option value="all">Everyone</option>
                        <option value="patient">Patients</option>
                        <option value="doctor">Doctors</option>
                        <option value="admin">Staff</option>
                      </select>
                    </div>
                  </div>
                  <p className="text-muted">Recent actions recorded across the platform.</p>
                  {this.state.logs.length !== 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Date &amp; Time</th>
                            <th>User</th>
                            <th>Type</th>
                            <th>Action</th>
                            <th>Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.logs.map(log => (
                            <tr key={log.log_id}>
                              <td>{new Date(log.created_at).toLocaleString()}</td>
                              <td>
                                {log.first_name || ''} {log.last_name || ''}
                                <br />
                                <small className="text-muted">#{log.user_id}</small>
                              </td>
                              <td>
                                <span className={`badge ${log.user_type === 'patient' ? 'badge-info' : log.user_type === 'doctor' ? 'badge-success' : 'badge-warning'}`}>
                                  {log.user_type}
                                </span>
                              </td>
                              <td>{log.action}</td>
                              <td>{log.details}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted mb-0">No activity recorded yet.</p>
                  )}
                </div>
              </div>
            </div>
            <br/>
            <br/>
                
        </div>
        </DashboardLayout>
        );
    }
}
 
export default Admin;

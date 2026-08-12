import React, { Component } from 'react';
import axios from 'axios';
import AuthShell from '../Login/AuthShell';
import FormField from '../Login/FormField';

class Register extends Component {
  constructor() {
    super()
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      address: '',
      phone_no: '',
      disease: '',
      message: '',
      messageType: ''
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  isValidEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
  }

  onSubmit(e) {
    e.preventDefault()

    const { first_name, last_name, email, password, address, phone_no, disease } = this.state;

    if (!first_name || !last_name || !email || !password || !phone_no) {
      this.setState({ message: 'Please fill in all required fields', messageType: 'warning' });
      return;
    }
    if (!this.isValidEmail(email)) {
      this.setState({ message: 'Please enter a valid email address', messageType: 'warning' });
      return;
    }
    if (password.length < 6) {
      this.setState({ message: 'Password must be at least 6 characters long', messageType: 'warning' });
      return;
    }

    const newUser = {
      first_name,
      last_name,
      email,
      password,
      address,
      phone_no,
      disease
    }

    axios.post('/patient/register', newUser)
      .then(res => {
        this.setState({ message: res.data.message || 'Account created. Signing you in…', messageType: 'success' });
        setTimeout(() => this.props.history.push(`/patient/login`), 1200);
      })
      .catch(err => {
        const message = err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : 'Unable to register. Please try again.';
        this.setState({ message, messageType: 'danger' });
      })
  }

  render() {
    return (
      <AuthShell
        title="Create a Patient Account"
        subtitle="Register to book appointments and view your records."
        message={this.state.message}
        messageType={this.state.messageType}
        buttonText="Create Account"
        onSubmit={this.onSubmit}
        widthClass="col-lg-6 col-md-8"
        footer={
          <>
            Already have an account?{' '}
            <a href="/patient/login">Sign in</a>
          </>
        }
      >
        <div className="row">
          <div className="col-sm-6">
            <FormField
              label="First name"
              name="first_name"
              value={this.state.first_name}
              onChange={this.onChange}
              placeholder="Your first name"
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
              placeholder="Your last name"
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
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          value={this.state.password}
          onChange={this.onChange}
          placeholder="At least 6 characters"
          autoComplete="new-password"
          minLength={6}
          help="Use at least 6 characters."
          required
        />
        <FormField
          label="Phone number"
          name="phone_no"
          type="tel"
          value={this.state.phone_no}
          onChange={this.onChange}
          placeholder="e.g. 0771 234 567"
          autoComplete="tel"
          required
        />
        <FormField
          label="Address"
          name="address"
          value={this.state.address}
          onChange={this.onChange}
          placeholder="Residential address"
          autoComplete="street-address"
        />
        <FormField
          label="Condition (optional)"
          name="disease"
          value={this.state.disease}
          onChange={this.onChange}
          placeholder="e.g. malaria, hypertension"
          help="Tell us about any condition you are being treated for."
        />
      </AuthShell>
    )
  }
}

export default Register;

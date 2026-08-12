import React, { Component } from 'react';
import axios from 'axios';
import AuthShell from './AuthShell';
import FormField from './FormField';

class PatientLogin extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
      message: '',
      messageType: ''
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit(e) {
    e.preventDefault()

    const user = {
      email: this.state.email,
      password: this.state.password
    }

    if (!user.email || !user.password) {
      this.setState({ message: 'Please enter your email and password', messageType: 'warning' });
      return;
    }

    axios.post('/patient/login', user)
      .then(res => {
        sessionStorage.setItem('usertoken', res.data.token)
        sessionStorage.setItem('userData', JSON.stringify({ email: user.email }));
        this.setState({ message: 'Signing you in…', messageType: 'success' });
        setTimeout(() => this.props.history.push('/patient/login/patient_home'), 800);
      })
      .catch(err => {
        const message = err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : 'Unable to sign in. Please try again.';
        this.setState({ message, messageType: 'danger' });
      })
  }

  render() {
    return (
      <AuthShell
        title="Patient Sign In"
        subtitle="View your appointments, prescriptions and bill."
        message={this.state.message}
        messageType={this.state.messageType}
        buttonText="Sign In"
        onSubmit={this.onSubmit}
        footer={
          <>
            Don't have an account?{' '}
            <a href="/regPatient">Register here</a>
          </>
        }
      >
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
          placeholder="Your password"
          autoComplete="current-password"
          required
        />
      </AuthShell>
    )
  }
}
export default PatientLogin;

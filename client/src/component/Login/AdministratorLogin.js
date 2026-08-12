import React, { Component } from 'react';
import axios from 'axios';
import AuthShell from './AuthShell';
import FormField from './FormField';

class AdministratorLogin extends Component {
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

    axios.post('/admin/login', user)
      .then(res => {
        sessionStorage.setItem('usertoken', res.data.token)
        sessionStorage.setItem('userData', JSON.stringify({ email: user.email }));
        this.setState({ message: 'Signing you in…', messageType: 'success' });
        setTimeout(() => this.props.history.push('/administrator/login/admin_home'), 800);
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
        title="Administrator Sign In"
        subtitle="Manage staff and hospital operations."
        message={this.state.message}
        messageType={this.state.messageType}
        buttonText="Sign In"
        onSubmit={this.onSubmit}
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
export default AdministratorLogin;

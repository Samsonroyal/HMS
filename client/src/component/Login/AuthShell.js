import React from 'react';
import Navber from '../Navber/Navber';

const AuthShell = ({
  title,
  subtitle,
  message,
  messageType,
  buttonText,
  onSubmit,
  children,
  footer,
  widthClass = 'col-lg-5 col-md-7'
}) => {
  return (
    <div className="auth-page">
      <Navber />
      <div className="container auth-container">
        <div className="row justify-content-center">
          <div className={widthClass}>
            <div className="auth-card">
              <div className="auth-card-header">
                <h2 className="auth-title">{title}</h2>
                {subtitle && <p className="auth-subtitle">{subtitle}</p>}
              </div>

              {message && (
                <div className={`alert alert-${messageType} auth-alert`} role="alert">
                  {message}
                </div>
              )}

              <form noValidate onSubmit={onSubmit}>
                {children}
                <button type="submit" className="btn btn-primary btn-block btn-auth">
                  {buttonText}
                </button>
              </form>

              <details className="auth-recovery">
                <summary>Forgot your password?</summary>
                <div className="auth-recovery-panel">
                  <p>Password recovery is handled by hospital support to protect your account.</p>
                  <a href="/contact">Contact support</a>
                </div>
              </details>

              {footer && <div className="auth-footer">{footer}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;

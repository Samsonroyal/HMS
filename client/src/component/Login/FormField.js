import React from 'react';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  help,
  autoComplete,
  minLength,
  maxLength,
  as = 'input',
  options,
  rows = 3,
  min,
  max
}) => {
  const describedBy = help ? `${name}-help` : undefined;
  const commonProps = {
    id: name,
    name,
    className: 'form-control auth-input',
    value,
    onChange,
    required,
    'aria-describedby': describedBy
  };

  let control;
  if (as === 'select') {
    control = (
      <select {...commonProps}>
        {placeholder && <option value="">{placeholder}</option>}
        {options &&
          options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
    );
  } else if (as === 'textarea') {
    control = (
      <textarea {...commonProps} rows={rows} placeholder={placeholder} />
    );
  } else {
    control = (
      <input
        {...commonProps}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={minLength}
        maxLength={maxLength}
        min={min}
        max={max}
      />
    );
  }

  return (
    <div className="form-group auth-field">
      <label htmlFor={name} className="auth-label">
        {label}
        {required && <span className="auth-required" aria-hidden="true">*</span>}
      </label>
      {control}
      {help && (
        <small id={`${name}-help`} className="form-text auth-help">
          {help}
        </small>
      )}
    </div>
  );
};

export default FormField;

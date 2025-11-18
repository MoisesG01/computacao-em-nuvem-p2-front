import React from 'react';
import './PasswordStrength.css';

const PasswordStrength = ({ password }) => {
  const calculateStrength = (pwd) => {
    if (!pwd) return { strength: 0, label: '', color: '' };

    let strength = 0;
    const checks = {
      length: pwd.length >= 6,
      hasLower: /[a-z]/.test(pwd),
      hasUpper: /[A-Z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      long: pwd.length >= 10
    };

    if (checks.length) strength++;
    if (checks.hasLower) strength++;
    if (checks.hasUpper) strength++;
    if (checks.hasNumber) strength++;
    if (checks.hasSpecial) strength++;
    if (checks.long) strength++;

    let label = '';
    let color = '';

    if (strength <= 2) {
      label = 'Muito Fraca';
      color = '#e74c3c';
    } else if (strength === 3) {
      label = 'Fraca';
      color = '#f39c12';
    } else if (strength === 4) {
      label = 'Média';
      color = '#f1c40f';
    } else if (strength === 5) {
      label = 'Forte';
      color = '#2ecc71';
    } else {
      label = 'Muito Forte';
      color = '#27ae60';
    }

    return { strength, label, color, percentage: (strength / 6) * 100 };
  };

  const { strength, label, color, percentage } = calculateStrength(password);

  if (!password) return null;

  return (
    <div className="password-strength">
      <div className="password-strength-bar-container">
        <div
          className="password-strength-bar"
          style={{
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
      <div className="password-strength-info">
        <span className="password-strength-label" style={{ color }}>
          Força: {label}
        </span>
        <div className="password-requirements">
          <span className={password.length >= 6 ? 'requirement-met' : 'requirement-unmet'}>
            {password.length >= 6 ? '✓' : '○'} Mínimo 6 caracteres
          </span>
          <span className={/[a-z]/.test(password) ? 'requirement-met' : 'requirement-unmet'}>
            {/[a-z]/.test(password) ? '✓' : '○'} Letra minúscula
          </span>
          <span className={/[A-Z]/.test(password) ? 'requirement-met' : 'requirement-unmet'}>
            {/[A-Z]/.test(password) ? '✓' : '○'} Letra maiúscula
          </span>
          <span className={/\d/.test(password) ? 'requirement-met' : 'requirement-unmet'}>
            {/\d/.test(password) ? '✓' : '○'} Número
          </span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrength;


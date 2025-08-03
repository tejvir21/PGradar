import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiFetch, saveToken } from '../utils/api';
// For reCAPTCHA, uncomment if you'd like to use it
// import ReCAPTCHA from 'react-google-recaptcha';

function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // const [recaptchaValue, setRecaptchaValue] = useState(null);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validateForm = () => {
    if (!form.username.trim()) return t('Username is required');
    if (!form.email.trim()) return t('Email is required');
    if (!/\S+@\S+\.\S+/.test(form.email)) return t('Email is invalid');
    if (form.password.length < 6) return t('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return t('Passwords do not match');
    // if (!recaptchaValue) return t('Please verify you are not a robot');
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          // recaptcha: recaptchaValue,
        }),
      });
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.message || t('Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-semibold mb-4">{t('Register')}</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <label className="block mb-2">
          {t('Username')}
          <input
            type="text" name="username" value={form.username} onChange={handleChange}
            required aria-label={t('Username')}
            className="w-full px-3 py-2 border rounded mt-1"
          />
        </label>
        <label className="block mb-2">
          {t('Email')}
          <input
            type="email" name="email" value={form.email} onChange={handleChange}
            required aria-label={t('Email')}
            className="w-full px-3 py-2 border rounded mt-1"
          />
        </label>
        <label className="block mb-2">
          {t('Password')}
          <input
            type="password" name="password" value={form.password} onChange={handleChange}
            required aria-label={t('Password')}
            className="w-full px-3 py-2 border rounded mt-1"
          />
        </label>
        <label className="block mb-4">
          {t('Confirm Password')}
          <input
            type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
            required aria-label={t('Confirm Password')}
            className="w-full px-3 py-2 border rounded mt-1"
          />
        </label>
        {/* 
        <ReCAPTCHA
          sitekey="YOUR_RECAPTCHA_SITE_KEY"
          onChange={setRecaptchaValue}
          className="mb-4"
        /> 
        */}
        <button
          type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? t('Registering...') : t('Register')}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        {t('Already have an account?')}{' '}
        <Link to="/login" className="text-blue-600 hover:underline">{t('Login')}</Link>
      </p>
    </div>
  );
}

export default Register;

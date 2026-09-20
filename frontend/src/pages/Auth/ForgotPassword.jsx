import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/auth.service.js';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await authService.forgotPassword(email);
      setResetToken(response.data?.resetToken || '');
      setSubmitted(true);
      toast.success('If the email exists, a reset link has been sent');
    } catch (requestError) {
      setError(requestError.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="main">
        <section className="page authPage">
          <div className="authCard successCard">
            <div className="successIcon">✓</div>
            <h1 className="pageTitle">Check Your Email</h1>
            <p className="pageText">
              If an account exists for <strong>{email}</strong>, you'll receive a password reset
              link shortly.
            </p>
            {resetToken && (
              <p className="pageText">
                Development reset link:{' '}
                <Link to={`/reset-password/${resetToken}`}>Reset password</Link>
              </p>
            )}
            <Link to="/login" className="btn authSubmit">
              Back to Login
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="main">
      <section className="page authPage">
        <div className="authCard">
          <h1 className="pageTitle">Forgot Password</h1>
          <p className="pageText">Enter your email to receive a password reset link</p>

          <form className="authForm" onSubmit={handleSubmit}>
            <div className="field">
              <label className="labelText">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
              />
            </div>

            {error && <div className="status error">{error}</div>}

            <button type="submit" className="btn authSubmit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <p className="authFooter">
              <Link to="/login">Back to Login</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
};

export default ForgotPassword;

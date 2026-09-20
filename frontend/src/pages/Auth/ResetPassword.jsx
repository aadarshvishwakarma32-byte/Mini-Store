import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service.js';
import { toast } from 'sonner';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [valid, setValid] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await authService.validateResetToken(token);
        setValid(response.success);
      } catch {
        setValid(false);
      } finally {
        setValidating(false);
      }
    };
    validateToken();
  }, [token]);

  const validate = () => {
    const newErrors = {};
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      toast.success('Password reset successful');
      navigate('/login');
    } catch (requestError) {
      toast.error(requestError.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <main className="main">
        <section className="page authPage">
          <div className="authCard">
            <div
              className="skeletonLine w60"
              style={{ height: '40px', width: '200px', borderRadius: '8px', margin: '0 auto 16px' }}
            />
            <div
              className="skeletonLine w40"
              style={{ height: '16px', width: '100%', borderRadius: '8px', margin: '0 auto 8px' }}
            />
            <div
              className="skeletonLine w40"
              style={{ height: '16px', width: '100%', borderRadius: '8px', margin: '0 auto' }}
            />
          </div>
        </section>
      </main>
    );
  }

  if (!valid) {
    return (
      <main className="main">
        <section className="page authPage">
          <div className="authCard errorCard">
            <div className="errorIcon">✕</div>
            <h1 className="pageTitle">Invalid Reset Link</h1>
            <p className="pageText">This password reset link is invalid or has expired.</p>
            <Link to="/forgot-password" className="btn authSubmit">
              Request New Link
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
          <h1 className="pageTitle">Set New Password</h1>
          <p className="pageText">Enter your new password below</p>

          <form className="authForm" onSubmit={handleSubmit}>
            <div className="field">
              <label className="labelText">New Password</label>
              <input
                type="password"
                className={`input ${errors.password ? 'error' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                disabled={loading}
              />
              {errors.password && <span className="errorText">{errors.password}</span>}
            </div>

            <div className="field">
              <label className="labelText">Confirm Password</label>
              <input
                type="password"
                className={`input ${errors.confirmPassword ? 'error' : ''}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                autoComplete="new-password"
                disabled={loading}
              />
              {errors.confirmPassword && (
                <span className="errorText">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className="btn authSubmit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default ResetPassword;

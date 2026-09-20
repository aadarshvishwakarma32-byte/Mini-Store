import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { toast } from 'sonner';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
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
      const result = await register(name.trim(), email, password);
      if (result.success) {
        navigate('/');
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main">
      <section className="page authPage">
        <div className="authCard">
          <h1 className="pageTitle">Create Account</h1>
          <p className="pageText">Join Mini Store today</p>

          <form className="authForm" onSubmit={handleSubmit}>
            <div className="field">
              <label className="labelText">Full Name</label>
              <input
                type="text"
                className={`input ${errors.name ? 'error' : ''}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                autoComplete="name"
                disabled={loading}
              />
              {errors.name && <span className="errorText">{errors.name}</span>}
            </div>

            <div className="field">
              <label className="labelText">Email</label>
              <input
                type="email"
                className={`input ${errors.email ? 'error' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
              />
              {errors.email && <span className="errorText">{errors.email}</span>}
            </div>

            <div className="field">
              <label className="labelText">Password</label>
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
                placeholder="Confirm your password"
                autoComplete="new-password"
                disabled={loading}
              />
              {errors.confirmPassword && (
                <span className="errorText">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className="btn authSubmit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="authFooter">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Register;

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main">
      <section className="page authPage">
        <div className="authCard">
          <h1 className="pageTitle">Welcome Back</h1>
          <p className="pageText">Sign in to your Mini Store account</p>

          <form className="authForm" onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
              />
              {errors.password && <span className="errorText">{errors.password}</span>}
            </div>

            <button type="submit" className="btn authSubmit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="authFooter">
              Don't have an account? <Link to="/register">Create one</Link>
            </p>

            <Link to="/forgot-password" className="forgotLink">
              Forgot password?
            </Link>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Login;

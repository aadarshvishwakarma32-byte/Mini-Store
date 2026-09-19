import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { toast } from 'sonner';

const Settings = () => {
  const { user, updateProfile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const [settings, setSettings] = useState({
    name: '',
    email: '',
    phone: '',
    notifications: true,
    newsletter: false,
  });

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSettings({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        notifications: true,
        newsletter: false,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!settings.name.trim()) newErrors.name = 'Name is required';
    if (!settings.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(settings.email)) newErrors.email = 'Email is invalid';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSuccess('');
    const response = await updateProfile({
      name: settings.name,
      email: settings.email,
      phone: settings.phone,
    });
    if (response.success) {
      setSuccess('Settings saved successfully');
      toast.success('Settings updated');
    } else {
      setErrors({ form: response.message || 'Update failed' });
      toast.error(response.message || 'Update failed');
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <main className="main">
        <section className="page">
          <div className="skeletonLine w60" style={{ height: '40px', width: '200px', borderRadius: '8px', margin: '0 auto 16px' }} />
          <div className="skeletonLine w40" style={{ height: '16px', width: '100%', borderRadius: '8px', margin: '0 auto 8px' }} />
          <div className="skeletonLine w40" style={{ height: '16px', width: '100%', borderRadius: '8px', margin: '0 auto' }} />
        </section>
      </main>
    );
  }

  return (
    <main className="main">
      <section className="page profilePage">
        <h1 className="pageTitle">Settings</h1>

        {success && <div className="status success" role="status">{success}</div>}
        {errors.form && <div className="status error">{errors.form}</div>}

        <form className="authForm profileForm" onSubmit={handleSubmit}>
          <div className="field">
            <label className="labelText">Full Name</label>
            <input
              type="text"
              name="name"
              className={`input ${errors.name ? 'error' : ''}`}
              value={settings.name}
              onChange={handleChange}
              placeholder="Your name"
            />
            {errors.name && <span className="errorText">{errors.name}</span>}
          </div>

          <div className="field">
            <label className="labelText">Email</label>
            <input
              type="email"
              name="email"
              className={`input ${errors.email ? 'error' : ''}`}
              value={settings.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            {errors.email && <span className="errorText">{errors.email}</span>}
          </div>

          <div className="field">
            <label className="labelText">Phone</label>
            <input
              type="tel"
              name="phone"
              className="input"
              value={settings.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="field">
            <label className="labelText" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
              />
              Enable notifications
            </label>
          </div>

          <div className="field">
            <label className="labelText" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="newsletter"
                checked={settings.newsletter}
                onChange={handleChange}
              />
              Subscribe to newsletter
            </label>
          </div>

          <button type="submit" className="btn authSubmit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Settings;

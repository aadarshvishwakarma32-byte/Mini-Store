import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { toast } from 'sonner';

const Profile = () => {
  const { user, updateProfile, changePassword, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || { street: '', city: '', state: '', zipCode: '', country: '' },
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.replace('address.', '');
      setProfileData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setProfileData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!profileData.name.trim()) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password required';
    if (!passwordData.newPassword) newErrors.newPassword = 'New password required';
    else if (passwordData.newPassword.length < 6) newErrors.newPassword = 'At least 6 characters';
    if (passwordData.newPassword !== passwordData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;

    setLoading(true);
    setSuccess('');
    const response = await updateProfile(profileData);
    if (response.success) {
      setSuccess('Profile updated successfully');
      toast.success('Profile updated');
    } else {
      setErrors({ form: response.message });
      toast.error(response.message || 'Update failed');
    }
    setLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setLoading(true);
    setSuccess('');
    const response = await changePassword(passwordData.currentPassword, passwordData.newPassword);
    if (response.success) {
      setSuccess('Password changed successfully');
      toast.success('Password changed');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setErrors({ form: response.message });
      toast.error(response.message || 'Change failed');
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <main className="main">
        <section className="page">
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
        </section>
      </main>
    );
  }

  return (
    <main className="main">
      <section className="page profilePage">
        <h1 className="pageTitle">My Profile</h1>

        <div className="profileTabs">
          <button
            className={`tabBtn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('profile');
              setErrors({});
              setSuccess('');
            }}
          >
            Profile
          </button>
          <button
            className={`tabBtn ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('password');
              setErrors({});
              setSuccess('');
            }}
          >
            Change Password
          </button>
        </div>

        {success && (
          <div className="status success" role="status">
            {success}
          </div>
        )}
        {errors.form && <div className="status error">{errors.form}</div>}

        {activeTab === 'profile' && (
          <form className="authForm profileForm" onSubmit={handleProfileSubmit}>
            <div className="field">
              <label className="labelText">Full Name</label>
              <input
                type="text"
                name="name"
                className={`input ${errors.name ? 'error' : ''}`}
                value={profileData.name}
                onChange={handleProfileChange}
                placeholder="Your name"
              />
              {errors.name && <span className="errorText">{errors.name}</span>}
            </div>

            <div className="field">
              <label className="labelText">Phone</label>
              <input
                type="tel"
                name="phone"
                className="input"
                value={profileData.phone}
                onChange={handleProfileChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <h3 className="sectionHeading">Shipping Address</h3>
            <div className="addressGrid">
              <div className="field">
                <label className="labelText">Street Address</label>
                <input
                  type="text"
                  name="address.street"
                  className="input"
                  value={profileData.address.street}
                  onChange={handleProfileChange}
                  placeholder="123 Main Street"
                />
              </div>
              <div className="field">
                <label className="labelText">City</label>
                <input
                  type="text"
                  name="address.city"
                  className="input"
                  value={profileData.address.city}
                  onChange={handleProfileChange}
                  placeholder="Your City"
                />
              </div>
              <div className="field">
                <label className="labelText">State</label>
                <input
                  type="text"
                  name="address.state"
                  className="input"
                  value={profileData.address.state}
                  onChange={handleProfileChange}
                  placeholder="Your State"
                />
              </div>
              <div className="field">
                <label className="labelText">ZIP Code</label>
                <input
                  type="text"
                  name="address.zipCode"
                  className="input"
                  value={profileData.address.zipCode}
                  onChange={handleProfileChange}
                  placeholder="12345"
                />
              </div>
              <div className="field">
                <label className="labelText">Country</label>
                <input
                  type="text"
                  name="address.country"
                  className="input"
                  value={profileData.address.country}
                  onChange={handleProfileChange}
                  placeholder="United States"
                />
              </div>
            </div>

            <button type="submit" className="btn authSubmit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}

        {activeTab === 'password' && (
          <form className="authForm profileForm" onSubmit={handlePasswordSubmit}>
            <div className="field">
              <label className="labelText">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                className={`input ${errors.currentPassword ? 'error' : ''}`}
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                autoComplete="current-password"
              />
              {errors.currentPassword && (
                <span className="errorText">{errors.currentPassword}</span>
              )}
            </div>

            <div className="field">
              <label className="labelText">New Password</label>
              <input
                type="password"
                name="newPassword"
                className={`input ${errors.newPassword ? 'error' : ''}`}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="At least 6 characters"
                autoComplete="new-password"
              />
              {errors.newPassword && <span className="errorText">{errors.newPassword}</span>}
            </div>

            <div className="field">
              <label className="labelText">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                className={`input ${errors.confirmPassword ? 'error' : ''}`}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <span className="errorText">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className="btn authSubmit" disabled={loading}>
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
};

export default Profile;

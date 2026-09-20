import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { adminService } from '../../services/admin.service.js';

const initialState = {
  storeName: '',
  announcement: '',
  supportEmail: '',
  currency: 'INR',
  isStoreOpen: true,
};

function AdminSettings() {
  const [settings, setSettings] = useState(initialState);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminService
      .getStoreSettings()
      .then((result) => setSettings(result.data || initialState))
      .catch(() => toast.error('Unable to load store settings'));
  }, []);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await adminService.updateStoreSettings(settings);
      toast.success('Store settings saved');
    } catch (error) {
      toast.error(error.message || 'Unable to save settings');
    } finally {
      setSaving(false);
    }
  };

  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }));

  return (
    <section className="adminContentPage">
      <div className="adminPageIntro">
        <p className="adminEyebrow">CONTENT & SETTINGS</p>
        <h1>Store content</h1>
        <p>Update customer-facing store information without editing code.</p>
      </div>
      <form className="adminSettingsForm" onSubmit={save}>
        <label>
          Store name
          <input
            className="input"
            value={settings.storeName}
            onChange={(e) => update('storeName', e.target.value)}
            required
          />
        </label>
        <label>
          Announcement bar
          <textarea
            className="textarea"
            rows="3"
            value={settings.announcement}
            onChange={(e) => update('announcement', e.target.value)}
          />
        </label>
        <label>
          Support email
          <input
            type="email"
            className="input"
            value={settings.supportEmail}
            onChange={(e) => update('supportEmail', e.target.value)}
            required
          />
        </label>
        <label>
          Currency
          <select
            className="input"
            value={settings.currency}
            onChange={(e) => update('currency', e.target.value)}
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </label>
        <label className="adminToggle">
          <input
            type="checkbox"
            checked={settings.isStoreOpen}
            onChange={(e) => update('isStoreOpen', e.target.checked)}
          />
          <span>Store is open for orders</span>
        </label>
        <button className="btn adminSaveButton" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </section>
  );
}

export default AdminSettings;

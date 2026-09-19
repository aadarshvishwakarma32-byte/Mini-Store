import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { adminService } from '../../services/admin.service.js';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadUsers = async () => { try { const result = await adminService.getUsers({ limit: 100 }); setUsers(result.data?.users || []); } catch { toast.error('Unable to load users'); } finally { setLoading(false); } };
  useEffect(() => { loadUsers(); }, []);
  const changeRole = async (id, role) => { try { await adminService.updateUserRole(id, role); toast.success('Role updated'); loadUsers(); } catch (error) { toast.error(error.message || 'Unable to update role'); } };
  const changeStatus = async (id, isActive) => { try { await adminService.updateUserStatus(id, isActive); toast.success('User status updated'); loadUsers(); } catch { toast.error('Unable to update user'); } };
  return <section className="adminContentPage"><div className="adminPageIntro"><p className="adminEyebrow">ACCESS CONTROL</p><h1>Users & roles</h1><p>Choose who can administer the store and temporarily disable access when needed.</p></div>{loading ? <div className="adminDashboardLoading">Loading users…</div> : <div className="productTableWrap"><table className="productTable"><thead><tr><th>User</th><th>Email</th><th>Role</th><th>Access</th></tr></thead><tbody>{users.map((user) => <tr key={user._id}><td>{user.name}</td><td>{user.email}</td><td><select className="adminInlineSelect" value={user.role} onChange={(e) => changeRole(user._id, e.target.value)}><option value="user">Customer</option><option value="admin">Admin</option></select></td><td><button className={`adminStatusButton ${user.isActive ? 'enabled' : ''}`} type="button" onClick={() => changeStatus(user._id, !user.isActive)}>{user.isActive ? 'Active' : 'Disabled'}</button></td></tr>)}</tbody></table></div>}</section>;
}
export default AdminUsers;

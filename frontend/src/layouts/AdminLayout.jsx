import { NavLink, Outlet } from 'react-router-dom';

function AdminLayout() {
  return (
    <div className="adminLayout">
      <aside className="adminSidebar">
        <nav className="adminNav">
          <h2 className="adminBrand">Admin</h2>
          <NavLink end className="adminLink" to="/admin">
            Dashboard
          </NavLink>
          <NavLink className="adminLink" to="/admin/products">
            Products
          </NavLink>
          <NavLink className="adminLink" to="/admin/users">
            Users & roles
          </NavLink>
          <NavLink className="adminLink" to="/admin/settings">
            Content & settings
          </NavLink>
          <NavLink className="adminLink" to="/admin/monitoring">
            Monitoring
          </NavLink>
        </nav>
      </aside>
      <main className="adminMain">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;

import { Outlet } from 'react-router-dom';
import Header from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

function MainLayout() {
  return (
    <div className="appRoot">
      <Header />
      <main className="mainContent">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;

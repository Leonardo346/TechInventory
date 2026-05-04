// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#333', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
      <h2>📦 TechInventory</h2>
      <div>
        <Link to="/" className="btn btn-primary" style={{ marginRight: '10px' }}>Inventario</Link>
        <Link to="/nuevo" className="btn btn-warning">Crear Producto</Link>
      </div>
    </nav>
  );
};

export default Navbar;
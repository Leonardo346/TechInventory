// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductos, eliminarProducto } from '../services/api';
import Spinner from '../components/Spinner';

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    cargarProductos();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const res = await getProductos();
      setProductos(res.data);
      setError(null);
    } catch (err) {
      setError('No se pudo conectar con la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        await eliminarProducto(id);
        cargarProductos();
      } catch (err) {
        alert('Hubo un error al eliminar el producto');
      }
    }
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalProductos = productos.length;
  const stockTotal = productos.reduce((total, p) => total + Number(p.stock || 0), 0);
  const valorInventario = productos.reduce(
    (total, p) => total + Number(p.precio || 0) * Number(p.stock || 0),
    0
  );

  if (loading) return <Spinner />;

  return (
    <div style={{ ...styles.page, padding: isMobile ? '18px' : '35px' }}>
      <section
        style={{
          ...styles.hero,
          flexDirection: isMobile ? 'column' : 'row',
          textAlign: isMobile ? 'center' : 'left',
        }}
      >
        <div>
          <p style={styles.badge}>Panel de Inventario</p>
          <h1 style={{ ...styles.title, fontSize: isMobile ? '26px' : '34px' }}>
            Gestión profesional de productos
          </h1>
          <p style={styles.subtitle}>
            Administra tus productos, controla el stock y mantén tu inventario actualizado.
          </p>
        </div>

        <Link
          to="/nuevo"
          style={{
            ...styles.primaryButton,
            width: isMobile ? '100%' : 'auto',
            textAlign: 'center',
          }}
        >
          + Nuevo Producto
        </Link>
      </section>

      <section
        style={{
          ...styles.statsGrid,
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        }}
      >
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Productos registrados</span>
          <strong style={styles.statNumber}>{totalProductos}</strong>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statLabel}>Stock total</span>
          <strong style={styles.statNumber}>{stockTotal}</strong>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statLabel}>Valor del inventario</span>
          <strong style={styles.statNumber}>S/ {valorInventario.toFixed(2)}</strong>
        </div>
      </section>

      <section style={styles.panel}>
        <div
          style={{
            ...styles.panelHeader,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
          }}
        >
          <div>
            <h2 style={styles.panelTitle}>Lista de productos</h2>
            <p style={styles.panelText}>Busca, edita o elimina productos registrados.</p>
          </div>

          <div style={{ ...styles.searchBox, width: isMobile ? '100%' : '330px' }}>
            <span style={styles.searchIcon}>🔎</span>
            <input
              type="text"
              placeholder="Buscar producto o categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {error ? (
          <div style={styles.errorBox}>{error}</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={{ ...styles.table, minWidth: isMobile ? '850px' : '100%' }}>
              <thead>
                <tr>
                  <th style={styles.th}>Producto</th>
                  <th style={styles.th}>Categoría</th>
                  <th style={styles.th}>Precio</th>
                  <th style={styles.th}>Stock</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {productosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={styles.empty}>
                      No hay productos disponibles.
                    </td>
                  </tr>
                ) : (
                  productosFiltrados.map((producto) => {
                    const id = producto.id;
                    const stock = Number(producto.stock);

                    return (
                      <tr key={id} style={styles.tr}>
                        <td style={styles.td}>
                          <div style={styles.productCell}>
                            <div style={styles.avatar}>
                              {producto.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <strong style={styles.productName}>{producto.nombre}</strong>
                              <p style={styles.productCode}>ID: {String(id).slice(0, 8)}</p>
                            </div>
                          </div>
                        </td>

                        <td style={styles.td}>
                          <span style={styles.category}>{producto.categoria}</span>
                        </td>

                        <td style={styles.td}>S/ {Number(producto.precio).toFixed(2)}</td>
                        <td style={styles.td}>{producto.stock}</td>

                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.status,
                              backgroundColor: stock > 0 ? '#dcfce7' : '#fee2e2',
                              color: stock > 0 ? '#166534' : '#991b1b',
                            }}
                          >
                            {stock > 0 ? 'Disponible' : 'Sin stock'}
                          </span>
                        </td>

                        <td style={styles.td}>
                          <div style={styles.actions}>
                            <Link to={`/editar/${id}`} style={styles.editButton}>
                              Editar
                            </Link>

                            <button
                              onClick={() => handleEliminar(id)}
                              style={styles.deleteButton}
                            >
                              Borrar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 45%, #e0f2fe 100%)',
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box',
  },
  hero: {
    background: 'linear-gradient(135deg, #111827, #1e3a8a)',
    color: 'white',
    borderRadius: '24px',
    padding: '35px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '25px',
    boxShadow: '0 20px 45px rgba(15, 23, 42, 0.25)',
    marginBottom: '25px',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    display: 'inline-block',
    padding: '8px 14px',
    borderRadius: '999px',
    fontSize: '13px',
    marginBottom: '12px',
  },
  title: {
    margin: '0 0 10px 0',
  },
  subtitle: {
    margin: 0,
    color: '#dbeafe',
    maxWidth: '560px',
  },
  primaryButton: {
    backgroundColor: 'white',
    color: '#1e3a8a',
    padding: '13px 20px',
    borderRadius: '14px',
    fontWeight: 'bold',
    textDecoration: 'none',
    boxSizing: 'border-box',
  },
  statsGrid: {
    display: 'grid',
    gap: '18px',
    marginBottom: '25px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '22px',
    borderRadius: '20px',
    boxShadow: '0 12px 25px rgba(15, 23, 42, 0.08)',
    border: '1px solid #e5e7eb',
  },
  statLabel: {
    color: '#64748b',
    fontSize: '14px',
  },
  statNumber: {
    display: 'block',
    marginTop: '8px',
    fontSize: '28px',
    color: '#0f172a',
  },
  panel: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: '24px',
    padding: '25px',
    boxShadow: '0 15px 35px rgba(15, 23, 42, 0.10)',
    border: '1px solid #e5e7eb',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '20px',
  },
  panelTitle: {
    margin: 0,
    color: '#111827',
    fontSize: '24px',
  },
  panelText: {
    margin: '5px 0 0 0',
    color: '#64748b',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    border: '1px solid #dbeafe',
    borderRadius: '14px',
    padding: '0 14px',
    boxSizing: 'border-box',
  },
  searchIcon: {
    marginRight: '8px',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    padding: '13px 0',
    width: '100%',
    fontSize: '14px',
  },
  tableWrapper: {
    overflowX: 'auto',
    width: '100%',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 10px',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    color: '#64748b',
    fontSize: '13px',
    textTransform: 'uppercase',
  },
  tr: {
    backgroundColor: 'white',
    boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)',
  },
  td: {
    padding: '16px 12px',
    color: '#334155',
  },
  productCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '14px',
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  productName: {
    color: '#111827',
  },
  productCode: {
    margin: '4px 0 0 0',
    fontSize: '12px',
    color: '#94a3b8',
  },
  category: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    padding: '7px 11px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  status: {
    padding: '7px 11px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  editButton: {
    backgroundColor: '#f59e0b',
    color: 'white',
    padding: '9px 13px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '9px 13px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '15px',
    borderRadius: '12px',
  },
  empty: {
    textAlign: 'center',
    padding: '30px',
    color: '#64748b',
    backgroundColor: 'white',
    borderRadius: '16px',
  },
};

export default Home;
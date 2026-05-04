// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FormularioProducto from './pages/FormularioProducto';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nuevo" element={<FormularioProducto />} />
          <Route path="/editar/:id" element={<FormularioProducto />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
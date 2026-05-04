// src/services/api.js
import axios from 'axios';

// Cuando tú o tu compa hagan el backend, esta URL cambiará. 
// Por ahora apuntará al puerto 3000 local.
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getProductos = () => apiClient.get('/productos');
export const crearProducto = (producto) => apiClient.post('/productos', producto);
export const actualizarProducto = (id, producto) => apiClient.put(`/productos/${id}`, producto);
export const eliminarProducto = (id) => apiClient.delete(`/productos/${id}`);

export default apiClient;
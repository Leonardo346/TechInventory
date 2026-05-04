// src/utils/validacion.js
import * as yup from 'yup';

export const productoSchema = yup.object().shape({
  nombre: yup.string().required('El nombre es obligatorio'),
  categoria: yup.string().required('La categoría es obligatoria'),
  precio: yup
    .number()
    .typeError('El precio debe ser un número')
    .positive('El precio debe ser mayor a cero')
    .required('El precio es obligatorio'),
  stock: yup
    .number()
    .typeError('El stock debe ser un número')
    .integer('El stock no puede tener decimales')
    .min(0, 'El stock no puede ser negativo')
    .required('El stock es obligatorio'),
});
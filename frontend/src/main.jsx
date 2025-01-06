import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Categorias from '@pages/Categoria';
import ProductoCarnico from '@pages/productoCarnico';

import Proveedores from '@pages/Proveedor';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import VerAnimalListaCorte from '@pages/verAnimalListaCorte';
import AnimalVara from '@pages/AnimalVara';
import Pedidos from "@pages/Pedidos"; 
import '@styles/styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: '/home',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: '/animal-corte/listas-precios',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <VerAnimalListaCorte />
          </ProtectedRoute>
        ),
      },
      {
        path: '/animal-vara/vara',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
           <AnimalVara />
          </ProtectedRoute>
        ),
      },
      {
        path: '/producto/carnico',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <ProductoCarnico />
          </ProtectedRoute>
        ),
      },
      {
        path: '/producto/categoria',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Categorias />
          </ProtectedRoute>
        ),
      },
      {
        path: '/gestion-proveedores/proveedor',  
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Proveedores /> 
          </ProtectedRoute>
        ),
      },
      {
        path: '/pedidos',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Pedidos />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute allowedRoles={['administrador']}>
        <Users />
      </ProtectedRoute>
    ),
  },

  {
    path: '/auth',
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);

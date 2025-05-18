import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';


import Proveedores from '@pages/Proveedor';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import Pedidos from "@pages/Pedidos";
import Productos from './pages/Productos'; // Importar la página de productos
import VerAnimalListaCorte from '@pages/verAnimalListaCorte';
import AnimalVara from '@pages/AnimalVara';
import Subproductos from '@pages/Subproductos';
import PagosPendientes from './pages/PagosPendientes';
import Clientes from './pages/Clientes';

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
        path: '/productos',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Productos />
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
        path: '/subproductos', // Nueva ruta para Subproductos
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Subproductos />
          </ProtectedRoute>
        ),
      },
      {
        path: '/pagos-pendientes',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <PagosPendientes />
          </ProtectedRoute>
        ),
      },
      {
        path: '/clientes',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Clientes />
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

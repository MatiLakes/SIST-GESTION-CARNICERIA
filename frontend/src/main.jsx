import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Categorias from '@pages/Categoria';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import ListaPreciosPage from '@pages/ListaPreciosPage';
import CrearListaPage from '@pages/CrearListaPage';
import Pedidos from "@pages/Pedidos";
import Productos from './pages/Productos'; // Importar la página de productos
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
            <ListaPreciosPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/animal-corte/crear-lista',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <CrearListaPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/proveedores/categoria',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Categorias />
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
    path: '/pedidos',
    element: (
      <ProtectedRoute allowedRoles={['administrador']}>
        <Pedidos />
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

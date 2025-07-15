import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CadastroCliente from './CadastroCliente';
import BlocoCentral from './BlocoCentral';
import CadastroProduto from './CadastroProduto.tsx';
import Relatorios from './Relatorios';
import CadastroVendedor from './CadastroVendedor.tsx';
import PerfilVendedor from './PerfilVendedor.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <BlocoCentral />,
  },
  {
    path: "/BlocoCentral",
    element: <BlocoCentral />,
  },
  {
    path: "/clientes",
    element: <CadastroCliente />,
  },
  {
    path: "/cadastrovendedor",
    element: <CadastroVendedor />,
  },
  {
    path: "/perfilvendedor",
    element: <PerfilVendedor />,
  },
  {
    path: "/produtos",
    element: <CadastroProduto />,
  },
  {
    path: "/relatorios",
    element: <Relatorios />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
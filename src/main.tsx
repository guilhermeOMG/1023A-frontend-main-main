import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
//import './index.css'
//import App from './App.tsx'
//import Container from './Container.tsx'
import CadastroCliente from './CadastroCliente';
import BlocoCentral from './BlocoCentral';
import CadastroVendedor from './CadastroVendedor';

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
  }
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)


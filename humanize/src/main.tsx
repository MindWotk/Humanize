import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Componentes Reutilizáveis e Wrappers
import { ThemeProvider } from "./components/ThemeContext/ThemeContext.tsx";
import Error from "./routes/Error/index.tsx";
import "./globals.css";

// Componentes de Páginas Institucionais
import PaginaInicial from "./routes/PaginaInicial/index.tsx";
import Login from "./routes/Login/index.tsx";
import Contato from "./routes/Contato/index.tsx";
import FAQ from "./routes/FAQ/index.tsx";
import Integrantes from "./routes/Integrantes/index.tsx";


// FUNCIONALIDADES HUMANIZE (ACESSO LOGADO) 
import Dashboard from "./routes/Dashboard/index.tsx";
import Checkin from "./routes/Checkin/index.tsx";
import Recursos from "./routes/Recursos/index.tsx";
import Perfil from "./routes/Perfil/index.tsx";

// ÁREA ADMINISTRATIVA (RESTRIÇÃO RH) 
import Cadastro from "./routes/Cadastro/index.tsx";
import AdminFuncionarios from "./routes/AdminFuncionarios/index.tsx";
import AdminRecursos from "./routes/AdminRecursos/index.tsx";
import Auditoria from "./routes/Auditoria/index.tsx";
import Sobre from "./routes/Sobre/index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      // Rotas Públicas
      { path: "/", element: <PaginaInicial /> },
      { path: "/sobre", element: <Sobre /> },
      { path: "/integrantes", element: <Integrantes /> },
      { path: "/contato", element: <Contato /> },
      { path: "/faq", element: <FAQ /> },
      { path: "/login", element: <Login /> },

      // Rotas do Colaborador (Logado)
      { path: "/checkin", element: <Checkin /> },
      { path: "/recursos", element: <Recursos /> },
      { path: "/perfil", element: <Perfil /> },

      // Rotas de Gestão
      { path: "/dashboard", element: <Dashboard /> },

      // Rotas Administrativas (Apenas RH)
      { path: "/cadastro", element: <Cadastro /> },
      { path: "/admin/funcionarios", element: <AdminFuncionarios /> },
      { path: "/admin/recursos", element: <AdminRecursos /> },
      { path: "/admin/auditoria", element: <Auditoria /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-teal-600 text-xl font-semibold animate-pulse">
          Carregando Humanize...
        </div>
      </div>
    }>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Suspense>
  </React.StrictMode>
);
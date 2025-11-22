
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Componentes Reutilizáveis e Wrappers
import Error from "./routes/Error/index.tsx";
import "./globals.css";

// Componentes de Páginas Institucionais
import PaginaInicial from "./routes/PaginaInicial/index.tsx";
import Contato from "./routes/Contato/index.tsx";
import FAQ from "./routes/FAQ/index.tsx";
import Integrantes from "./routes/Integrantes/index.tsx";

import Sobre from "./routes/Sobre/index.tsx";
import { Suspense } from "react";
import { ThemeProvider } from "./components/ThemeContext/ThemeContext.tsx";
import React from "react";


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
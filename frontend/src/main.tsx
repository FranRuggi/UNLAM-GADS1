import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./shared/styles/tokens.css";
import "./shared/styles/base.css";
import { Rutas } from "./app/router/Rutas";

const contenedor = document.getElementById("root");
if (!contenedor) throw new Error("No se encontró el nodo #root.");

createRoot(contenedor).render(
  <StrictMode>
    <BrowserRouter>
      <Rutas />
    </BrowserRouter>
  </StrictMode>,
);

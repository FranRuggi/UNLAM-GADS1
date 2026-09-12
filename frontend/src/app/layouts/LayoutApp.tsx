import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Logo } from "../../shared/components/Logo";
import { Icono, type NombreIcono } from "../../shared/components/Icono";
import { Avatar } from "../../shared/components/Avatar";
import { usuarioActual } from "../../shared/data/demo";
import { ROL } from "../../shared/data/formato";
import css from "./LayoutApp.module.css";

type ItemNav = { a: string; texto: string; icono: NombreIcono; exacto?: boolean };

const PRINCIPAL: ItemNav[] = [
  { a: "/app", texto: "Panel", icono: "panel", exacto: true },
  { a: "/app/oportunidades", texto: "Oportunidades", icono: "oportunidades" },
  { a: "/app/embudo", texto: "Embudo", icono: "embudo" },
];

const CLIENTES: ItemNav[] = [
  { a: "/app/empresas", texto: "Empresas", icono: "empresas" },
  { a: "/app/contactos", texto: "Contactos", icono: "contactos" },
];

const CATALOGO: ItemNav[] = [
  { a: "/app/salones", texto: "Salones", icono: "salones" },
];

export function LayoutApp() {
  const [lateralAbierto, setLateralAbierto] = useState(false);
  const { pathname } = useLocation();

  // La navegación cierra el menú. Se ajusta durante el render, que es el
  // patrón de React para reaccionar a un cambio de entrada sin un efecto.
  const [rutaPrevia, setRutaPrevia] = useState(pathname);
  if (rutaPrevia !== pathname) {
    setRutaPrevia(pathname);
    setLateralAbierto(false);
  }

  const grupo = (titulo: string, items: ItemNav[]) => (
    <div className={css.grupo}>
      <p className={css.grupoTitulo}>{titulo}</p>
      {items.map((item) => (
        <NavLink
          key={item.a}
          to={item.a}
          end={item.exacto}
          className={({ isActive }) =>
            `${css.enlace} ${isActive ? css.activo : ""}`
          }
        >
          <Icono nombre={item.icono} tamano={17} />
          {item.texto}
        </NavLink>
      ))}
    </div>
  );

  return (
    <div className={css.app}>
      <a className="salto-contenido" href="#contenido">
        Ir al contenido
      </a>

      {lateralAbierto && (
        <button
          type="button"
          className={css.velo}
          aria-label="Cerrar la navegación"
          onClick={() => setLateralAbierto(false)}
        />
      )}

      <aside
        className={`${css.lateral} ${lateralAbierto ? css.lateralAbierto : ""}`}
      >
        <div className={css.lateralMarca}>
          <Link to="/app" aria-label="Ztech CRM, panel">
            <Logo variante="compacto" tamano={28} />
          </Link>
        </div>

        <nav className={`${css.navegacion} scroll-fino`} aria-label="Navegación de la aplicación">
          {grupo("Comercial", PRINCIPAL)}
          {grupo("Clientes", CLIENTES)}
          {grupo("Catálogo", CATALOGO)}
        </nav>

        <div className={css.lateralPie}>
          <p className={css.aviso}>
            Maqueta sin backend. Los datos son de demostración y no se guardan.
          </p>
          <Link to="/" className={css.volver}>
            <Icono nombre="flechaIzquierda" tamano={14} />
            Volver al sitio
          </Link>
        </div>
      </aside>

      <div className={css.marco}>
        <header className={css.superior}>
          <button
            type="button"
            className={css.botonLateral}
            aria-label="Abrir la navegación"
            aria-expanded={lateralAbierto}
            onClick={() => setLateralAbierto(true)}
          >
            <Icono nombre="menu" tamano={19} />
          </button>

          <div className={css.buscador}>
            <Icono nombre="buscar" tamano={16} />
            <input
              type="search"
              placeholder="Buscar empresas, contactos u oportunidades"
              aria-label="Buscar en el CRM"
            />
          </div>

          <div className={css.superiorAcciones}>
            <button type="button" className={css.iconoAccion} aria-label="Notificaciones">
              <Icono nombre="campana" tamano={18} />
              <span className={css.marcador} aria-hidden="true" />
            </button>

            <div className={css.usuario}>
              <Avatar iniciales={usuarioActual.iniciales} tamano="md" />
              <span className={css.usuarioDatos}>
                <span className={css.usuarioNombre}>
                  {usuarioActual.nombre} {usuarioActual.apellido}
                </span>
                <span className={css.usuarioRol}>{ROL[usuarioActual.rol]}</span>
              </span>
            </div>

            <Link to="/" className={css.iconoAccion} aria-label="Cerrar sesión">
              <Icono nombre="salir" tamano={18} />
            </Link>
          </div>
        </header>

        <main id="contenido" className={css.contenido}>
          <div className={css.envoltorio}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

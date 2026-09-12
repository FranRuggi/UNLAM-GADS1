import { type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Seo } from "../../shared/seo/Seo";
import { Logo } from "../../shared/components/Logo";
import { Icono } from "../../shared/components/Icono";
import { Boton } from "../../shared/components/Boton";
import { Campo, Entrada } from "../../shared/components/Campos";
import { usuarioActual } from "../../shared/data/demo";
import css from "./PaginaIngreso.module.css";

const GARANTIAS = [
  "Empresas, contactos y oportunidades en una sola base",
  "Embudo comercial con el historial de cada etapa",
  "Disponibilidad del salón validada antes de confirmar",
];

export function PaginaIngreso() {
  const navegar = useNavigate();

  /**
   * No hay autenticación: el formulario navega al panel para poder recorrer
   * la maqueta. El login real llega con Spring Security y JWT (ver DF-05).
   */
  const alEnviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navegar("/app");
  };

  return (
    <>
      <Seo
        titulo="Iniciar sesión"
        descripcion="Accedé a Ztech CRM para gestionar las oportunidades comerciales de tu salón de eventos corporativos."
        noIndexar
      />

      <div className={css.pantalla}>
        {/* --- Formulario ------------------------------------------------ */}
        <div className={css.columnaForm}>
          <header className={css.cabecera}>
            <Link to="/" aria-label="Ztech CRM, inicio">
              <Logo tamano={32} />
            </Link>
          </header>

          <main className={css.centro}>
            <div className={css.caja}>
              <h1 className={css.titulo}>Ingresá a tu cuenta</h1>
              <p className={css.bajada}>
                Usá el correo de tu equipo comercial para acceder al CRM.
              </p>

              <form onSubmit={alEnviar} className={css.formulario} noValidate>
                <Campo etiqueta="Correo electrónico" requerido>
                  {(id) => (
                    <Entrada
                      id={id}
                      name="email"
                      type="email"
                      autoComplete="username"
                      defaultValue={usuarioActual.email}
                      placeholder="nombre@ztechcrm.com.ar"
                      required
                    />
                  )}
                </Campo>

                <Campo etiqueta="Contraseña" requerido>
                  {(id) => (
                    <Entrada
                      id={id}
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      defaultValue="demo-ztech-2026"
                      required
                    />
                  )}
                </Campo>

                <div className={css.fila}>
                  <label className={css.recordar}>
                    <input type="checkbox" name="recordar" defaultChecked />
                    <span>Mantener la sesión iniciada</span>
                  </label>
                  <a href="#recuperar" className={css.olvide}>
                    Olvidé mi contraseña
                  </a>
                </div>

                <Boton type="submit" tamano="lg" anchoCompleto>
                  Iniciar sesión
                </Boton>
              </form>

              <p className={css.aviso}>
                <Icono nombre="info" tamano={15} />
                Maqueta de demostración: cualquier dato te lleva al panel. No hay
                autenticación ni datos reales.
              </p>
            </div>
          </main>

          <footer className={css.pie}>
            <Link to="/">Volver al sitio</Link>
            <span aria-hidden="true">·</span>
            <Link to="/terminos">Términos</Link>
            <span aria-hidden="true">·</span>
            <Link to="/privacidad">Privacidad</Link>
          </footer>
        </div>

        {/* --- Panel de marca -------------------------------------------- */}
        <aside className={css.columnaMarca} aria-hidden="true">
          <div className={css.marcaContenido}>
            <Logo variante="completo" tamano={44} tono="claro" />
            <p className={css.marcaLema}>
              El control comercial de tu salón, sin planillas sueltas.
            </p>
            <ul className={css.garantias}>
              {GARANTIAS.map((g) => (
                <li key={g}>
                  <Icono nombre="check" tamano={16} />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}

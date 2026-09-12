import type { ReactNode } from "react";
import { Icono } from "./Icono";
import css from "./BarraFiltros.module.css";

type PropsBarra = {
  /** Texto del campo de búsqueda. */
  marcador: string;
  children?: ReactNode;
};

/**
 * Barra de búsqueda y filtros de los listados.
 *
 * Los controles todavía no filtran: la maqueta fija el diseño y el orden de
 * los criterios acordados en el módulo de oportunidades de la consigna.
 */
export function BarraFiltros({ marcador, children }: PropsBarra) {
  return (
    <div className={css.barra} role="search">
      <div className={css.busqueda}>
        <Icono nombre="buscar" tamano={16} />
        <input type="search" placeholder={marcador} aria-label={marcador} />
      </div>
      {children && <div className={css.filtros}>{children}</div>}
    </div>
  );
}

type PropsFiltro = {
  etiqueta: string;
  opciones: string[];
};

export function Filtro({ etiqueta, opciones }: PropsFiltro) {
  return (
    <label className={css.filtro}>
      <span className="solo-lectores">{etiqueta}</span>
      <select defaultValue="" aria-label={etiqueta}>
        <option value="">{etiqueta}</option>
        {opciones.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <Icono nombre="chevronAbajo" tamano={14} />
    </label>
  );
}

export function PieListado({
  mostrados,
  total,
  entidad,
}: {
  mostrados: number;
  total: number;
  entidad: string;
}) {
  return (
    <>
      <p className={css.conteo}>
        Mostrando {mostrados} de {total} {entidad}
      </p>
      <nav className={css.paginacion} aria-label="Paginación">
        <button type="button" disabled aria-label="Página anterior">
          <Icono nombre="chevronIzquierda" tamano={15} />
        </button>
        <span aria-current="page">1</span>
        <button type="button" disabled aria-label="Página siguiente">
          <Icono nombre="chevronDerecha" tamano={15} />
        </button>
      </nav>
    </>
  );
}

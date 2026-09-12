import { clienteDe, etapasOrdenadas, oportunidadesDeEtapa } from "../../shared/data/demo";
import { pesos } from "../../shared/data/formato";
import css from "./VistaPreviaEmbudo.module.css";

/**
 * Miniatura del tablero del embudo, armada con los mismos datos que usa la
 * aplicación. Es decorativa: se oculta a los lectores de pantalla, porque el
 * tablero real vive en `/app/embudo`.
 */
export function VistaPreviaEmbudo() {
  const columnas = etapasOrdenadas()
    .filter((e) => e.tipo === "ABIERTA")
    .slice(0, 3)
    .map((etapa) => ({
      etapa,
      oportunidades: oportunidadesDeEtapa(etapa.id).slice(0, 2),
    }));

  return (
    <div className={css.marco} aria-hidden="true">
      <div className={css.ventana}>
        <div className={css.barra}>
          <span className={css.semaforo} />
          <span className={css.semaforo} />
          <span className={css.semaforo} />
          <span className={css.ruta}>ztechcrm.com.ar/app/embudo</span>
        </div>

        <div className={css.tablero}>
          {columnas.map(({ etapa, oportunidades }) => (
            <div key={etapa.id} className={css.columna}>
              <div className={css.columnaCabecera}>
                <span
                  className={css.puntoEtapa}
                  style={{ background: `var(--etapa-${etapa.color})` }}
                />
                <span className={css.columnaNombre}>{etapa.nombre}</span>
                <span className={css.columnaCuenta}>
                  {oportunidadesDeEtapa(etapa.id).length}
                </span>
              </div>

              {oportunidades.map((o) => (
                <article key={o.id} className={css.ficha}>
                  <p className={css.fichaTitulo}>{o.titulo}</p>
                  <p className={css.fichaCliente}>{clienteDe(o)}</p>
                  <p className={css.fichaValor}>{pesos(o.valorEstimado)}</p>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

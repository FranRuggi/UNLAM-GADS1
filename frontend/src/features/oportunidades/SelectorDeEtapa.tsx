import { useState } from "react";
import { Icono } from "../../shared/components/Icono";
import { etapasOrdenadas } from "../../shared/data/demo";
import css from "./SelectorDeEtapa.module.css";

type Props = {
  etapaActualId: string;
  deshabilitado?: boolean;
};

/**
 * Recorrido visual del embudo con la etapa actual marcada.
 *
 * El cambio se refleja sólo en pantalla: el caso de uso real actualiza la
 * oportunidad y agrega el registro de historial en la misma transacción.
 */
export function SelectorDeEtapa({ etapaActualId, deshabilitado }: Props) {
  const etapas = etapasOrdenadas();
  const [seleccionada, setSeleccionada] = useState(etapaActualId);
  const actual = etapas.find((e) => e.id === seleccionada);
  const indiceActual = etapas.findIndex((e) => e.id === seleccionada);

  return (
    <div>
      <ol className={css.pasos}>
        {etapas.map((e, i) => {
          const recorrida = i < indiceActual;
          const esActual = e.id === seleccionada;

          return (
            <li key={e.id} className={css.paso}>
              <button
                type="button"
                className={`${css.boton} ${esActual ? css.actual : ""} ${
                  recorrida ? css.recorrida : ""
                }`}
                style={{ "--color-etapa": `var(--etapa-${e.color})` } as React.CSSProperties}
                aria-current={esActual ? "step" : undefined}
                disabled={deshabilitado}
                onClick={() => setSeleccionada(e.id)}
              >
                <span className={css.marca} aria-hidden="true">
                  {recorrida ? <Icono nombre="check" tamano={12} /> : i + 1}
                </span>
                <span className={css.nombre}>{e.nombre}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <p className={css.leyenda}>
        {deshabilitado ? (
          <>La oportunidad está cerrada: el cambio de etapa queda bloqueado.</>
        ) : (
          <>
            Etapa seleccionada: <strong>{actual?.nombre}</strong>. En la maqueta
            el cambio no se guarda.
          </>
        )}
      </p>
    </div>
  );
}

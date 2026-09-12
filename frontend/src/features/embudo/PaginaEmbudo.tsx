import { Link } from "react-router-dom";
import { Seo } from "../../shared/seo/Seo";
import { CabeceraPagina } from "../../shared/components/CabeceraPagina";
import { BotonEnlace } from "../../shared/components/Boton";
import { Icono } from "../../shared/components/Icono";
import { Avatar } from "../../shared/components/Avatar";
import { BarraFiltros, Filtro } from "../../shared/components/BarraFiltros";
import { Tarjeta } from "../../shared/components/Tarjeta";
import {
  clienteDe,
  datos,
  etapasOrdenadas,
  oportunidadesDeEtapa,
  salon,
  usuario,
} from "../../shared/data/demo";
import { fecha, pesos } from "../../shared/data/formato";
import pantalla from "../../shared/styles/pantalla.module.css";
import css from "./PaginaEmbudo.module.css";

export function PaginaEmbudo() {
  const etapas = etapasOrdenadas();
  const abiertas = datos.oportunidades.filter((o) => o.estado === "ABIERTA");
  const valorAbierto = abiertas.reduce((t, o) => t + o.valorEstimado, 0);

  return (
    <>
      <Seo
        titulo="Embudo comercial"
        descripcion="Tablero de oportunidades agrupadas por etapa."
        noIndexar
      />

      <CabeceraPagina
        titulo="Embudo comercial"
        descripcion="Las oportunidades agrupadas por etapa. Arrastrar una ficha va a cambiar su etapa y registrar el cambio en el historial."
        meta={
          <>
            <span>
              <Icono nombre="oportunidades" tamano={14} /> {abiertas.length}{" "}
              oportunidades abiertas
            </span>
            <span>
              <Icono nombre="dinero" tamano={14} /> {pesos(valorAbierto)} en
              negociación
            </span>
          </>
        }
        acciones={
          <>
            <BotonEnlace
              a="/app/oportunidades"
              variante="secundario"
              icono="ordenar"
            >
              Ver como lista
            </BotonEnlace>
            <BotonEnlace a="/app/oportunidades/nueva" icono="mas">
              Nueva oportunidad
            </BotonEnlace>
          </>
        }
      />

      <div className={pantalla.pila}>
        <Tarjeta aSangre>
          <BarraFiltros marcador="Buscar en el embudo">
            <Filtro
              etiqueta="Responsable"
              opciones={datos.usuarios.map((u) => `${u.nombre} ${u.apellido}`)}
            />
            <Filtro etiqueta="Estado" opciones={["Abierta", "Ganada", "Perdida"]} />
            <Filtro etiqueta="Origen" opciones={datos.origenes.map((o) => o.nombre)} />
            <Filtro etiqueta="Salón" opciones={datos.salones.map((s) => s.nombre)} />
          </BarraFiltros>
        </Tarjeta>

        <p className={pantalla.avisoMaqueta}>
          <Icono nombre="info" tamano={16} />
          Maqueta sin backend: el tablero muestra la distribución real de los
          datos de demostración, pero todavía no permite mover fichas ni guardar
          el cambio de etapa.
        </p>

        <div className={`${css.tablero} scroll-fino`}>
          {etapas.map((etapa) => {
            const oportunidades = oportunidadesDeEtapa(etapa.id);
            const total = oportunidades.reduce((t, o) => t + o.valorEstimado, 0);

            return (
              <section
                key={etapa.id}
                className={css.columna}
                aria-labelledby={`etapa-${etapa.id}`}
              >
                <header
                  className={css.columnaCabecera}
                  style={{ "--color-etapa": `var(--etapa-${etapa.color})` } as React.CSSProperties}
                >
                  <div className={css.columnaTitulo}>
                    <span className={css.punto} aria-hidden="true" />
                    <h2 id={`etapa-${etapa.id}`}>{etapa.nombre}</h2>
                    <span className={css.cuenta}>{oportunidades.length}</span>
                  </div>
                  <p className={css.columnaTotal}>{pesos(total)}</p>
                </header>

                <div className={css.fichas}>
                  {oportunidades.length === 0 ? (
                    <p className={css.columnaVacia}>Sin oportunidades en esta etapa.</p>
                  ) : (
                    oportunidades.map((o) => {
                      const responsable = usuario(o.responsableId);
                      const sala = salon(o.salonId);

                      return (
                        <article key={o.id} className={css.ficha}>
                          <Link
                            to={`/app/oportunidades/${o.id}`}
                            className={css.fichaTitulo}
                          >
                            {o.titulo}
                          </Link>
                          <p className={css.fichaCliente}>{clienteDe(o)}</p>

                          <dl className={css.fichaDatos}>
                            <div>
                              <dt>
                                <Icono nombre="salones" tamano={12} />
                                <span className="solo-lectores">Salón</span>
                              </dt>
                              <dd>{sala?.nombre}</dd>
                            </div>
                            <div>
                              <dt>
                                <Icono nombre="calendario" tamano={12} />
                                <span className="solo-lectores">Fecha del evento</span>
                              </dt>
                              <dd>{fecha(o.fechaEvento)}</dd>
                            </div>
                            <div>
                              <dt>
                                <Icono nombre="personas" tamano={12} />
                                <span className="solo-lectores">Asistentes</span>
                              </dt>
                              <dd>{o.cantidadAsistentes}</dd>
                            </div>
                          </dl>

                          <footer className={css.fichaPie}>
                            <span className={css.fichaValor}>
                              {pesos(o.valorEstimado)}
                            </span>
                            {responsable && (
                              <Avatar
                                iniciales={responsable.iniciales}
                                nombre={`${responsable.nombre} ${responsable.apellido}`}
                                tamano="sm"
                              />
                            )}
                          </footer>
                        </article>
                      );
                    })
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}

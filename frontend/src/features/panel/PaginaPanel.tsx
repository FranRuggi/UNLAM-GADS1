import { Link } from "react-router-dom";
import { Seo } from "../../shared/seo/Seo";
import { CabeceraPagina } from "../../shared/components/CabeceraPagina";
import { BotonEnlace } from "../../shared/components/Boton";
import {
  Tarjeta,
  TarjetaCabecera,
  TarjetaCuerpo,
} from "../../shared/components/Tarjeta";
import { Icono, type NombreIcono } from "../../shared/components/Icono";
import { Etiqueta } from "../../shared/components/Etiqueta";
import { LineaDeActividades } from "../actividades/LineaDeActividades";
import { FichaOportunidad } from "../oportunidades/FichaOportunidad";
import {
  datos,
  etapasOrdenadas,
  oportunidadesDeEtapa,
  usuarioActual,
} from "../../shared/data/demo";
import { fecha, pesos } from "../../shared/data/formato";
import pantalla from "../../shared/styles/pantalla.module.css";
import css from "./PaginaPanel.module.css";

export function PaginaPanel() {
  const abiertas = datos.oportunidades.filter((o) => o.estado === "ABIERTA");
  const ganadas = datos.oportunidades.filter((o) => o.estado === "GANADA");
  const valorAbierto = abiertas.reduce((t, o) => t + o.valorEstimado, 0);
  const etapas = etapasOrdenadas();
  const maximo = Math.max(...etapas.map((e) => oportunidadesDeEtapa(e.id).length), 1);

  const proximos = [...datos.oportunidades]
    .filter((o) => o.estado !== "PERDIDA")
    .sort((a, b) => a.fechaEvento.localeCompare(b.fechaEvento))
    .slice(0, 5);

  const recientes = [...datos.oportunidades]
    .sort((a, b) => b.creadaEl.localeCompare(a.creadaEl))
    .slice(0, 4);

  const actividades = [...datos.actividades]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 6);

  const metricas: {
    icono: NombreIcono;
    etiqueta: string;
    valor: string;
    nota: string;
  }[] = [
    {
      icono: "oportunidades",
      etiqueta: "Oportunidades abiertas",
      valor: String(abiertas.length),
      nota: `de ${datos.oportunidades.length} registradas`,
    },
    {
      icono: "dinero",
      etiqueta: "En negociación",
      valor: pesos(valorAbierto),
      nota: "valor estimado de las abiertas",
    },
    {
      icono: "empresas",
      etiqueta: "Empresas",
      valor: String(datos.empresas.length),
      nota: `${datos.contactos.length} contactos asociados`,
    },
    {
      icono: "check",
      etiqueta: "Reservas confirmadas",
      valor: String(ganadas.length),
      nota: "oportunidades ganadas",
    },
  ];

  return (
    <>
      <Seo
        titulo="Panel"
        descripcion="Resumen comercial del CRM."
        noIndexar
      />

      <CabeceraPagina
        titulo={`Hola, ${usuarioActual.nombre}`}
        descripcion="Este es el estado de la operación comercial de tus salones."
        acciones={
          <>
            <BotonEnlace a="/app/embudo" variante="secundario" icono="embudo">
              Ver embudo
            </BotonEnlace>
            <BotonEnlace a="/app/oportunidades/nueva" icono="mas">
              Nueva oportunidad
            </BotonEnlace>
          </>
        }
      />

      <div className={pantalla.pila}>
        <div className={pantalla.metricas}>
          {metricas.map((m) => (
            <article key={m.etiqueta} className={pantalla.metrica}>
              <p className={pantalla.metricaEncabezado}>
                <Icono nombre={m.icono} tamano={15} />
                {m.etiqueta}
              </p>
              <p className={pantalla.metricaValor}>{m.valor}</p>
              <p className={pantalla.metricaNota}>{m.nota}</p>
            </article>
          ))}
        </div>

        <div className={css.dosColumnas}>
          <div className={pantalla.pila}>
            <Tarjeta>
              <TarjetaCabecera
                titulo="Distribución del embudo"
                descripcion="Oportunidades por etapa"
                acciones={
                  <BotonEnlace a="/app/embudo" variante="fantasma" tamano="sm">
                    Ver tablero
                  </BotonEnlace>
                }
              />
              <TarjetaCuerpo>
                <ul className={css.barras}>
                  {etapas.map((e) => {
                    const cantidad = oportunidadesDeEtapa(e.id).length;
                    return (
                      <li key={e.id}>
                        <span className={css.barraEtiqueta}>{e.nombre}</span>
                        <span className={css.barraPista}>
                          <span
                            className={css.barra}
                            style={{
                              width: `${(cantidad / maximo) * 100}%`,
                              background: `var(--etapa-${e.color})`,
                            }}
                          />
                        </span>
                        <span className={css.barraValor}>{cantidad}</span>
                      </li>
                    );
                  })}
                </ul>
              </TarjetaCuerpo>
            </Tarjeta>

            <Tarjeta aSangre>
              <TarjetaCabecera
                titulo="Últimas oportunidades"
                descripcion="Las negociaciones cargadas más recientemente"
                acciones={
                  <BotonEnlace
                    a="/app/oportunidades"
                    variante="fantasma"
                    tamano="sm"
                  >
                    Ver todas
                  </BotonEnlace>
                }
              />
              <TarjetaCuerpo>
                <ul className={css.listaFichas}>
                  {recientes.map((o) => (
                    <li key={o.id}>
                      <FichaOportunidad oportunidad={o} />
                    </li>
                  ))}
                </ul>
              </TarjetaCuerpo>
            </Tarjeta>
          </div>

          <div className={pantalla.pila}>
            <Tarjeta aSangre>
              <TarjetaCabecera
                titulo="Próximos eventos"
                nivel={3}
                descripcion="Fechas comprometidas o en negociación"
              />
              <TarjetaCuerpo>
                <ul className={css.agenda}>
                  {proximos.map((o) => (
                    <li key={o.id}>
                      <span className={css.agendaFecha}>
                        {fecha(o.fechaEvento)}
                      </span>
                      <span className={css.agendaCuerpo}>
                        <Link to={`/app/oportunidades/${o.id}`}>{o.titulo}</Link>
                        <span className={css.agendaMeta}>
                          {o.cantidadAsistentes} asistentes
                        </span>
                      </span>
                      <Etiqueta
                        tono={o.estado === "GANADA" ? "exito" : "info"}
                        tamano="sm"
                      >
                        {o.estado === "GANADA" ? "Confirmado" : "Tentativo"}
                      </Etiqueta>
                    </li>
                  ))}
                </ul>
              </TarjetaCuerpo>
            </Tarjeta>

            <Tarjeta>
              <TarjetaCabecera
                titulo="Actividad reciente"
                nivel={3}
                descripcion="Últimas interacciones del equipo"
              />
              <TarjetaCuerpo>
                <div className={`${css.listaAcotada} scroll-fino`}>
                  <LineaDeActividades actividades={actividades} />
                </div>
              </TarjetaCuerpo>
            </Tarjeta>
          </div>
        </div>
      </div>
    </>
  );
}

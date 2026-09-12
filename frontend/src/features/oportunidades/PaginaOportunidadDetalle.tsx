import { Link, useParams } from "react-router-dom";
import { Seo } from "../../shared/seo/Seo";
import { CabeceraPagina } from "../../shared/components/CabeceraPagina";
import { Boton, BotonEnlace } from "../../shared/components/Boton";
import {
  Tarjeta,
  TarjetaCabecera,
  TarjetaCuerpo,
} from "../../shared/components/Tarjeta";
import { Etiqueta } from "../../shared/components/Etiqueta";
import { Avatar } from "../../shared/components/Avatar";
import { Icono } from "../../shared/components/Icono";
import { ListaDatos } from "../../shared/components/ListaDatos";
import { EstadoVacio } from "../../shared/components/EstadoVacio";
import { LineaDeActividades } from "../actividades/LineaDeActividades";
import { SelectorDeEtapa } from "./SelectorDeEtapa";
import {
  actividadesDe,
  contacto as buscarContacto,
  empresa as buscarEmpresa,
  etapa as buscarEtapa,
  historialDe,
  motivoPerdida,
  nombreContacto,
  nombreUsuario,
  oportunidad as buscarOportunidad,
  salon as buscarSalon,
  usuario,
} from "../../shared/data/demo";
import {
  ESTADO_OPORTUNIDAD,
  fecha,
  fechaExtendida,
  fechaHora,
  pesos,
  plural,
} from "../../shared/data/formato";
import pantalla from "../../shared/styles/pantalla.module.css";
import css from "./Oportunidades.module.css";

export function PaginaOportunidadDetalle() {
  const { id = "" } = useParams();
  const oportunidad = buscarOportunidad(id);

  if (!oportunidad) {
    return (
      <>
        <Seo titulo="Oportunidad no encontrada" descripcion="" noIndexar />
        <EstadoVacio
          icono="oportunidades"
          titulo="No encontramos esa oportunidad"
          descripcion="El registro puede haber sido dado de baja o el enlace no es correcto."
          accion={
            <BotonEnlace
              a="/app/oportunidades"
              variante="secundario"
              icono="flechaIzquierda"
            >
              Volver al listado
            </BotonEnlace>
          }
        />
      </>
    );
  }

  const etapa = buscarEtapa(oportunidad.etapaId);
  const estado = ESTADO_OPORTUNIDAD[oportunidad.estado];
  const empresa = buscarEmpresa(oportunidad.empresaId);
  const contacto = buscarContacto(oportunidad.contactoId);
  const salon = buscarSalon(oportunidad.salonId);
  const responsable = usuario(oportunidad.responsableId);
  const motivo = motivoPerdida(oportunidad.motivoPerdidaId);
  const historial = historialDe(oportunidad.id);
  const cerrada = oportunidad.estado !== "ABIERTA";

  return (
    <>
      <Seo titulo={oportunidad.titulo} descripcion="" noIndexar />

      <CabeceraPagina
        migas={[
          { texto: "Oportunidades", a: "/app/oportunidades" },
          { texto: oportunidad.titulo },
        ]}
        titulo={oportunidad.titulo}
        meta={
          <>
            {etapa && (
              <Etiqueta tono={etapa.color} punto tamano="sm">
                {etapa.nombre}
              </Etiqueta>
            )}
            <Etiqueta tono={estado.tono} tamano="sm">
              {estado.texto}
            </Etiqueta>
            <span>
              <Icono nombre="dinero" tamano={14} /> {pesos(oportunidad.valorEstimado)}
            </span>
            <span>
              <Icono nombre="calendario" tamano={14} />{" "}
              {fechaExtendida(oportunidad.fechaEvento)}
            </span>
          </>
        }
        acciones={
          <>
            <BotonEnlace
              a={`/app/oportunidades/${oportunidad.id}/editar`}
              variante="secundario"
              icono="lapiz"
            >
              Editar
            </BotonEnlace>
            <Boton variante="secundario" icono="mas">
              Registrar actividad
            </Boton>
          </>
        }
      />

      <div className={pantalla.grillaDetalle}>
        <div className={pantalla.pila}>
          <Tarjeta>
            <TarjetaCabecera
              titulo="Etapa actual"
              descripcion="El cambio de etapa queda registrado en el historial junto con el usuario que lo hizo."
            />
            <TarjetaCuerpo>
              <SelectorDeEtapa
                etapaActualId={oportunidad.etapaId}
                deshabilitado={cerrada}
              />
              {cerrada && (
                <p className={pantalla.avisoMaqueta} style={{ marginTop: "var(--e-4)" }}>
                  <Icono nombre="escudo" tamano={16} />
                  Una oportunidad cerrada no vuelve a una etapa abierta sin
                  autorización. La política exacta está pendiente (DP-01).
                </p>
              )}
            </TarjetaCuerpo>
          </Tarjeta>

          <Tarjeta>
            <TarjetaCabecera titulo="Datos de la oportunidad" />
            <TarjetaCuerpo>
              <ListaDatos
                datos={[
                  {
                    etiqueta: "Empresa",
                    valor: empresa ? (
                      <Link to={`/app/empresas/${empresa.id}`}>
                        {empresa.nombreComercial || empresa.razonSocial}
                      </Link>
                    ) : (
                      ""
                    ),
                  },
                  {
                    etiqueta: "Contacto",
                    valor: contacto ? (
                      <Link to={`/app/contactos/${contacto.id}`}>
                        {nombreContacto(contacto)}
                      </Link>
                    ) : (
                      ""
                    ),
                  },
                  { etiqueta: "Tipo de evento", valor: oportunidad.tipoEvento },
                  { etiqueta: "Origen", valor: oportunidad.origen },
                  {
                    etiqueta: "Cantidad de asistentes",
                    valor: `${oportunidad.cantidadAsistentes} personas`,
                  },
                  { etiqueta: "Probabilidad de cierre", valor: `${oportunidad.probabilidad} %` },
                  {
                    etiqueta: "Fecha estimada de cierre",
                    valor: fecha(oportunidad.fechaEstimadaCierre),
                  },
                  {
                    etiqueta: "Fecha real de cierre",
                    valor: oportunidad.fechaRealCierre
                      ? fecha(oportunidad.fechaRealCierre)
                      : "",
                  },
                  ...(motivo
                    ? [{ etiqueta: "Motivo de pérdida", valor: motivo.nombre }]
                    : []),
                  {
                    etiqueta: "Observaciones",
                    valor: oportunidad.observaciones,
                    ancho: true,
                  },
                ]}
              />
            </TarjetaCuerpo>
          </Tarjeta>

          <Tarjeta>
            <TarjetaCabecera
              titulo="Historial de etapas"
              descripcion={plural(historial.length, "cambio registrado", "cambios registrados")}
            />
            <TarjetaCuerpo>
              <ol className={pantalla.linea}>
                {historial.map((h) => {
                  const destino = buscarEtapa(h.etapaDestinoId);
                  const origen = h.etapaOrigenId
                    ? buscarEtapa(h.etapaOrigenId)
                    : undefined;
                  const autor = usuario(h.usuarioId);

                  return (
                    <li key={h.id} className={pantalla.lineaItem}>
                      <span
                        className={pantalla.lineaMarca}
                        style={{
                          color: destino ? `var(--etapa-${destino.color})` : undefined,
                        }}
                      >
                        <Icono nombre="embudo" tamano={15} />
                      </span>

                      <div className={pantalla.lineaCuerpo}>
                        <p className={pantalla.lineaTitulo}>
                          {origen
                            ? `De ${origen.nombre} a ${destino?.nombre}`
                            : `Alta en ${destino?.nombre}`}
                          <time className={pantalla.lineaFecha} dateTime={h.fecha}>
                            {fechaHora(h.fecha)}
                          </time>
                        </p>
                        <p className={pantalla.lineaAutor}>
                          {autor && <Avatar iniciales={autor.iniciales} tamano="sm" />}
                          {nombreUsuario(h.usuarioId)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </TarjetaCuerpo>
          </Tarjeta>

          <Tarjeta>
            <TarjetaCabecera
              titulo="Actividades"
              descripcion="Interacciones ya ocurridas con el cliente"
            />
            <TarjetaCuerpo>
              <LineaDeActividades
                actividades={actividadesDe({ oportunidadId: oportunidad.id })}
              />
            </TarjetaCuerpo>
          </Tarjeta>
        </div>

        <aside className={pantalla.pila}>
          <Tarjeta>
            <TarjetaCabecera titulo="Responsable" nivel={3} />
            <TarjetaCuerpo>
              <div className={css.responsable}>
                {responsable && (
                  <Avatar iniciales={responsable.iniciales} tamano="lg" />
                )}
                <div>
                  <p className={css.responsableNombre}>
                    {nombreUsuario(oportunidad.responsableId)}
                  </p>
                  <p className={css.responsableEmail}>{responsable?.email}</p>
                </div>
              </div>
            </TarjetaCuerpo>
          </Tarjeta>

          <Tarjeta>
            <TarjetaCabecera titulo="Salón reservado" nivel={3} />
            <TarjetaCuerpo>
              {salon && (
                <>
                  <p className={css.salonNombre}>{salon.nombre}</p>
                  <p className={css.salonUbicacion}>
                    {salon.direccion}, {salon.localidad}
                  </p>
                  <ListaDatos
                    columnas={1}
                    datos={[
                      {
                        etiqueta: "Capacidad",
                        valor: `${salon.capacidad} personas`,
                      },
                      {
                        etiqueta: "Asistentes previstos",
                        valor: `${oportunidad.cantidadAsistentes} personas`,
                      },
                      {
                        etiqueta: "Tarifa por jornada",
                        valor: pesos(salon.tarifaPorJornada),
                      },
                    ]}
                  />
                  <div className={css.ocupacion}>
                    <div className={css.ocupacionBarra}>
                      <span
                        style={{
                          width: `${Math.min(
                            (oportunidad.cantidadAsistentes / salon.capacidad) * 100,
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                    <p>
                      {Math.round(
                        (oportunidad.cantidadAsistentes / salon.capacidad) * 100,
                      )}
                      % de la capacidad del salón
                    </p>
                  </div>
                </>
              )}
            </TarjetaCuerpo>
          </Tarjeta>

          <Tarjeta>
            <TarjetaCabecera titulo="Cierre" nivel={3} />
            <TarjetaCuerpo>
              <div className={css.accionesCierre}>
                <Boton
                  variante="secundario"
                  icono="check"
                  anchoCompleto
                  disabled={cerrada}
                >
                  Marcar como ganada
                </Boton>
                <Boton
                  variante="peligro"
                  icono="cerrar"
                  anchoCompleto
                  disabled={cerrada}
                >
                  Marcar como perdida
                </Boton>
              </div>
              <p className={css.notaCierre}>
                Al confirmar una reserva, el backend valida capacidad y
                disponibilidad del salón. El cierre completo llega en la entrega
                final.
              </p>
            </TarjetaCuerpo>
          </Tarjeta>
        </aside>
      </div>
    </>
  );
}

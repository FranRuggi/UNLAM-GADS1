import { Link } from "react-router-dom";
import { Seo } from "../../shared/seo/Seo";
import { CabeceraPagina } from "../../shared/components/CabeceraPagina";
import { BotonEnlace } from "../../shared/components/Boton";
import { Tarjeta, TarjetaPie } from "../../shared/components/Tarjeta";
import { Tabla, EncabezadoTabla } from "../../shared/components/Tabla";
import { Etiqueta } from "../../shared/components/Etiqueta";
import { Avatar } from "../../shared/components/Avatar";
import { BarraFiltros, Filtro, PieListado } from "../../shared/components/BarraFiltros";
import {
  clienteDe,
  datos,
  etapa as buscarEtapa,
  etapasOrdenadas,
  salon,
  usuario,
} from "../../shared/data/demo";
import { ESTADO_OPORTUNIDAD, fecha, pesos } from "../../shared/data/formato";

const COLUMNAS = [
  "Oportunidad",
  "Cliente",
  "Salón",
  "Fecha del evento",
  "Responsable",
  "Valor estimado",
  "Etapa",
  "Estado",
];

export function PaginaOportunidades() {
  const oportunidades = [...datos.oportunidades].sort((a, b) =>
    b.creadaEl.localeCompare(a.creadaEl),
  );

  return (
    <>
      <Seo
        titulo="Oportunidades"
        descripcion="Listado de oportunidades comerciales del CRM."
        noIndexar
      />

      <CabeceraPagina
        titulo="Oportunidades"
        descripcion="Cada consulta por un salón se gestiona como una negociación con responsable, etapa y fecha de evento."
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

      <Tarjeta aSangre>
        <BarraFiltros marcador="Buscar por título, empresa o contacto">
          <Filtro etiqueta="Etapa" opciones={etapasOrdenadas().map((e) => e.nombre)} />
          <Filtro etiqueta="Estado" opciones={["Abierta", "Ganada", "Perdida"]} />
          <Filtro
            etiqueta="Responsable"
            opciones={datos.usuarios.map((u) => `${u.nombre} ${u.apellido}`)}
          />
          <Filtro etiqueta="Origen" opciones={datos.origenes.map((o) => o.nombre)} />
        </BarraFiltros>

        <Tabla resumen="Listado de oportunidades con su cliente, salón, etapa y valor estimado">
          <EncabezadoTabla columnas={COLUMNAS} />
          <tbody>
            {oportunidades.map((o) => {
              const etapa = buscarEtapa(o.etapaId);
              const estado = ESTADO_OPORTUNIDAD[o.estado];
              const responsable = usuario(o.responsableId);

              return (
                <tr key={o.id}>
                  <td>
                    <Link to={`/app/oportunidades/${o.id}`}>{o.titulo}</Link>
                    <span className="secundario">{o.tipoEvento}</span>
                  </td>
                  <td>{clienteDe(o)}</td>
                  <td>
                    {salon(o.salonId)?.nombre}
                    <span className="secundario">
                      {o.cantidadAsistentes} asistentes
                    </span>
                  </td>
                  <td className="numero">{fecha(o.fechaEvento)}</td>
                  <td>
                    <span className="persona">
                      {responsable && (
                        <Avatar iniciales={responsable.iniciales} tamano="sm" />
                      )}
                      {responsable?.nombre} {responsable?.apellido}
                    </span>
                  </td>
                  <td className="numero">{pesos(o.valorEstimado)}</td>
                  <td className="compacta">
                    {etapa && (
                      <Etiqueta tono={etapa.color} tamano="sm" punto>
                        {etapa.nombre}
                      </Etiqueta>
                    )}
                  </td>
                  <td className="compacta">
                    <Etiqueta tono={estado.tono} tamano="sm">
                      {estado.texto}
                    </Etiqueta>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Tabla>

        <TarjetaPie>
          <PieListado
            mostrados={oportunidades.length}
            total={oportunidades.length}
            entidad="oportunidades"
          />
        </TarjetaPie>
      </Tarjeta>
    </>
  );
}

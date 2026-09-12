import { Icono, type NombreIcono } from "../../shared/components/Icono";
import { Avatar } from "../../shared/components/Avatar";
import { EstadoVacio } from "../../shared/components/EstadoVacio";
import { nombreUsuario, tipoActividad, usuario } from "../../shared/data/demo";
import type { Actividad } from "../../shared/data/tipos";
import { desdeHace, fechaHora } from "../../shared/data/formato";
import css from "../../shared/styles/pantalla.module.css";

/** El catálogo de tipos de actividad define su icono. */
const ICONOS: Record<string, NombreIcono> = {
  llamada: "llamada",
  email: "email",
  mensaje: "mensaje",
  reunion: "reunion",
  virtual: "virtual",
  demo: "demo",
  propuesta: "propuesta",
  nota: "nota",
};

export function LineaDeActividades({
  actividades,
}: {
  actividades: Actividad[];
}) {
  if (actividades.length === 0) {
    return (
      <EstadoVacio
        icono="capas"
        titulo="Sin actividades registradas"
        descripcion="Las llamadas, reuniones y propuestas enviadas van a aparecer acá, en orden cronológico."
      />
    );
  }

  return (
    <ol className={css.linea}>
      {actividades.map((a) => {
        const tipo = tipoActividad(a.tipoId);
        const autor = usuario(a.usuarioId);

        return (
          <li key={a.id} className={css.lineaItem}>
            <span className={css.lineaMarca}>
              <Icono
                nombre={ICONOS[tipo?.icono ?? "nota"] ?? "nota"}
                tamano={15}
              />
            </span>

            <div className={css.lineaCuerpo}>
              <p className={css.lineaTitulo}>
                {a.titulo}
                <time className={css.lineaFecha} dateTime={a.fecha}>
                  {fechaHora(a.fecha)} · {desdeHace(a.fecha)}
                </time>
              </p>
              <p className={css.lineaDetalle}>{a.detalle}</p>
              <p className={css.lineaAutor}>
                {autor && <Avatar iniciales={autor.iniciales} tamano="sm" />}
                {tipo?.nombre} registrada por {nombreUsuario(a.usuarioId)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

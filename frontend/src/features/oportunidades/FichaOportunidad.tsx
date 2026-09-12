import { Link } from "react-router-dom";
import { Etiqueta } from "../../shared/components/Etiqueta";
import { Avatar } from "../../shared/components/Avatar";
import { Icono } from "../../shared/components/Icono";
import { clienteDe, etapa as buscarEtapa, salon, usuario } from "../../shared/data/demo";
import type { Oportunidad } from "../../shared/data/tipos";
import { fecha, pesos } from "../../shared/data/formato";
import css from "./FichaOportunidad.module.css";

type Props = {
  oportunidad: Oportunidad;
  mostrarCliente?: boolean;
};

/** Fila de oportunidad usada en los detalles de empresa, contacto y salón. */
export function FichaOportunidad({ oportunidad, mostrarCliente = true }: Props) {
  const etapa = buscarEtapa(oportunidad.etapaId);
  const responsable = usuario(oportunidad.responsableId);
  const sala = salon(oportunidad.salonId);

  return (
    <article className={css.ficha}>
      <div className={css.principal}>
        <Link to={`/app/oportunidades/${oportunidad.id}`} className={css.titulo}>
          {oportunidad.titulo}
        </Link>

        <p className={css.meta}>
          {mostrarCliente && <span>{clienteDe(oportunidad)}</span>}
          <span>
            <Icono nombre="salones" tamano={13} /> {sala?.nombre}
          </span>
          <span>
            <Icono nombre="calendario" tamano={13} /> {fecha(oportunidad.fechaEvento)}
          </span>
          <span>
            <Icono nombre="personas" tamano={13} /> {oportunidad.cantidadAsistentes}{" "}
            asistentes
          </span>
        </p>
      </div>

      <div className={css.lateral}>
        <span className={css.valor}>{pesos(oportunidad.valorEstimado)}</span>
        {etapa && (
          <Etiqueta tono={etapa.color} tamano="sm" punto>
            {etapa.nombre}
          </Etiqueta>
        )}
        {responsable && (
          <Avatar
            iniciales={responsable.iniciales}
            nombre={`${responsable.nombre} ${responsable.apellido}`}
            tamano="sm"
          />
        )}
      </div>
    </article>
  );
}

import { Seo } from "../../shared/seo/Seo";
import { CabeceraPagina } from "../../shared/components/CabeceraPagina";
import { Tarjeta, TarjetaCuerpo } from "../../shared/components/Tarjeta";
import { Etiqueta } from "../../shared/components/Etiqueta";
import { Icono } from "../../shared/components/Icono";
import { BarraFiltros, Filtro } from "../../shared/components/BarraFiltros";
import { datos, oportunidadesDeSalon } from "../../shared/data/demo";
import { ESTADO_SALON, pesos } from "../../shared/data/formato";
import pantalla from "../../shared/styles/pantalla.module.css";
import css from "./Salones.module.css";

export function PaginaSalones() {
  return (
    <>
      <Seo
        titulo="Salones"
        descripcion="Catálogo de salones disponibles para eventos corporativos."
        noIndexar
      />

      <CabeceraPagina
        titulo="Salones"
        descripcion="El producto que se comercializa. Cada oportunidad se asocia a un salón, con su capacidad y su tarifa."
        meta={
          <p className={pantalla.avisoMaqueta}>
            <Icono nombre="info" tamano={16} />
            En Entrega 1 los salones están precargados. Su gestión completa
            (alta, edición y baja) llega en la entrega final.
          </p>
        }
      />

      <Tarjeta aSangre>
        <BarraFiltros marcador="Buscar por nombre o localidad">
          <Filtro
            etiqueta="Estado"
            opciones={["Disponible", "En mantenimiento", "Inactivo"]}
          />
          <Filtro
            etiqueta="Capacidad"
            opciones={["Hasta 20", "De 21 a 35", "De 36 a 50"]}
          />
        </BarraFiltros>

        <TarjetaCuerpo>
          <ul className={css.grilla}>
            {datos.salones.map((s) => {
              const estado = ESTADO_SALON[s.estado];
              const usos = oportunidadesDeSalon(s.id).length;

              return (
                <li key={s.id} className={css.salon}>
                  <header className={css.encabezado}>
                    <h3>{s.nombre}</h3>
                    <Etiqueta tono={estado.tono} tamano="sm" punto>
                      {estado.texto}
                    </Etiqueta>
                  </header>

                  <p className={css.descripcion}>{s.descripcion}</p>

                  <dl className={css.numeros}>
                    <div>
                      <dt>Capacidad</dt>
                      <dd>{s.capacidad} personas</dd>
                    </div>
                    <div>
                      <dt>Tarifa por jornada</dt>
                      <dd>{pesos(s.tarifaPorJornada)}</dd>
                    </div>
                    <div>
                      <dt>Oportunidades</dt>
                      <dd>{usos}</dd>
                    </div>
                  </dl>

                  <p className={css.ubicacion}>
                    <Icono nombre="ubicacion" tamano={14} />
                    {s.direccion}, {s.localidad}
                  </p>

                  <ul className={css.equipamiento}>
                    {s.equipamiento.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </TarjetaCuerpo>
      </Tarjeta>
    </>
  );
}

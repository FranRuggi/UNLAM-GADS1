import { Link, useParams } from "react-router-dom";
import { Seo } from "../../shared/seo/Seo";
import { CabeceraPagina } from "../../shared/components/CabeceraPagina";
import { BotonEnlace } from "../../shared/components/Boton";
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
import { FichaOportunidad } from "../oportunidades/FichaOportunidad";
import {
  actividadesDe,
  contacto as buscarContacto,
  empresa as buscarEmpresa,
  nombreContacto,
  nombreUsuario,
  oportunidadesDeContacto,
  usuario,
} from "../../shared/data/demo";
import { ESTADO_CLIENTE, pesos, plural } from "../../shared/data/formato";
import pantalla from "../../shared/styles/pantalla.module.css";
import css from "../empresas/Empresas.module.css";

export function PaginaContactoDetalle() {
  const { id = "" } = useParams();
  const contacto = buscarContacto(id);

  if (!contacto) {
    return (
      <>
        <Seo titulo="Contacto no encontrado" descripcion="" noIndexar />
        <EstadoVacio
          icono="contactos"
          titulo="No encontramos ese contacto"
          descripcion="El registro puede haber sido dado de baja o el enlace no es correcto."
          accion={
            <BotonEnlace a="/app/contactos" variante="secundario" icono="flechaIzquierda">
              Volver al listado
            </BotonEnlace>
          }
        />
      </>
    );
  }

  const estado = ESTADO_CLIENTE[contacto.estado];
  const empresa = buscarEmpresa(contacto.empresaId);
  const responsable = usuario(contacto.responsableId);
  const oportunidades = oportunidadesDeContacto(contacto.id);
  const abiertas = oportunidades.filter((o) => o.estado === "ABIERTA");
  const cartera = abiertas.reduce((t, o) => t + o.valorEstimado, 0);

  return (
    <>
      <Seo titulo={nombreContacto(contacto)} descripcion="" noIndexar />

      <CabeceraPagina
        migas={[
          { texto: "Contactos", a: "/app/contactos" },
          { texto: nombreContacto(contacto) },
        ]}
        titulo={nombreContacto(contacto)}
        descripcion={contacto.cargo}
        meta={
          <>
            <Etiqueta tono={estado.tono} punto tamano="sm">
              {estado.texto}
            </Etiqueta>
            {empresa ? (
              <span>
                <Icono nombre="empresas" tamano={14} />{" "}
                <Link to={`/app/empresas/${empresa.id}`}>
                  {empresa.nombreComercial || empresa.razonSocial}
                </Link>
              </span>
            ) : (
              <span>
                <Icono nombre="usuario" tamano={14} /> Cliente individual
              </span>
            )}
          </>
        }
        acciones={
          <>
            <BotonEnlace
              a={`/app/contactos/${contacto.id}/editar`}
              variante="secundario"
              icono="lapiz"
            >
              Editar
            </BotonEnlace>
            <BotonEnlace a="/app/oportunidades/nueva" icono="mas">
              Nueva oportunidad
            </BotonEnlace>
          </>
        }
      />

      <div className={pantalla.grillaDetalle}>
        <div className={pantalla.pila}>
          <Tarjeta>
            <TarjetaCabecera titulo="Datos del contacto" />
            <TarjetaCuerpo>
              <ListaDatos
                datos={[
                  { etiqueta: "Nombre", valor: contacto.nombre },
                  { etiqueta: "Apellido", valor: contacto.apellido },
                  { etiqueta: "Cargo", valor: contacto.cargo },
                  {
                    etiqueta: "Empresa",
                    valor: empresa ? (
                      <Link to={`/app/empresas/${empresa.id}`}>
                        {empresa.razonSocial}
                      </Link>
                    ) : (
                      "Cliente individual"
                    ),
                  },
                  {
                    etiqueta: "Correo",
                    valor: <a href={`mailto:${contacto.email}`}>{contacto.email}</a>,
                  },
                  {
                    etiqueta: "Teléfono",
                    valor: <a href={`tel:${contacto.telefono}`}>{contacto.telefono}</a>,
                  },
                  { etiqueta: "Origen", valor: contacto.origen },
                  { etiqueta: "Estado", valor: estado.texto },
                  {
                    etiqueta: "Observaciones",
                    valor: contacto.observaciones,
                    ancho: true,
                  },
                ]}
              />
            </TarjetaCuerpo>
          </Tarjeta>

          <Tarjeta aSangre>
            <TarjetaCabecera
              titulo="Oportunidades"
              descripcion={`${plural(oportunidades.length, "negociación", "negociaciones")} en las que participa`}
            />
            <TarjetaCuerpo>
              {oportunidades.length === 0 ? (
                <EstadoVacio
                  icono="oportunidades"
                  titulo="Todavía no hay oportunidades"
                  descripcion="Cuando esta persona consulte por un salón, cargá la oportunidad para seguirla en el embudo."
                />
              ) : (
                <ul className={css.listaFichas}>
                  {oportunidades.map((o) => (
                    <li key={o.id}>
                      <FichaOportunidad oportunidad={o} mostrarCliente={false} />
                    </li>
                  ))}
                </ul>
              )}
            </TarjetaCuerpo>
          </Tarjeta>

          <Tarjeta>
            <TarjetaCabecera
              titulo="Historial comercial"
              descripcion="Interacciones registradas con esta persona"
            />
            <TarjetaCuerpo>
              <LineaDeActividades
                actividades={actividadesDe({ contactoId: contacto.id })}
              />
            </TarjetaCuerpo>
          </Tarjeta>
        </div>

        <aside className={pantalla.pila}>
          <Tarjeta>
            <TarjetaCabecera titulo="Resumen" nivel={3} />
            <TarjetaCuerpo>
              <ListaDatos
                columnas={1}
                datos={[
                  {
                    etiqueta: "Responsable comercial",
                    valor: (
                      <span className={css.persona}>
                        {responsable && (
                          <Avatar iniciales={responsable.iniciales} tamano="sm" />
                        )}
                        {nombreUsuario(contacto.responsableId)}
                      </span>
                    ),
                  },
                  { etiqueta: "Oportunidades abiertas", valor: abiertas.length },
                  { etiqueta: "Cartera abierta estimada", valor: pesos(cartera) },
                ]}
              />
            </TarjetaCuerpo>
          </Tarjeta>
        </aside>
      </div>
    </>
  );
}

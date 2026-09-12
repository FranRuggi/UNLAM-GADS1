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
  contactosDeEmpresa,
  empresa as buscarEmpresa,
  nombreContacto,
  nombreUsuario,
  oportunidadesDeEmpresa,
  usuario,
} from "../../shared/data/demo";
import { ESTADO_CLIENTE, pesos, plural } from "../../shared/data/formato";
import pantalla from "../../shared/styles/pantalla.module.css";
import css from "./Empresas.module.css";

export function PaginaEmpresaDetalle() {
  const { id = "" } = useParams();
  const empresa = buscarEmpresa(id);

  if (!empresa) {
    return (
      <>
        <Seo titulo="Empresa no encontrada" descripcion="" noIndexar />
        <EstadoVacio
          icono="empresas"
          titulo="No encontramos esa empresa"
          descripcion="El registro puede haber sido dado de baja o el enlace no es correcto."
          accion={
            <BotonEnlace a="/app/empresas" variante="secundario" icono="flechaIzquierda">
              Volver al listado
            </BotonEnlace>
          }
        />
      </>
    );
  }

  const estado = ESTADO_CLIENTE[empresa.estado];
  const contactos = contactosDeEmpresa(empresa.id);
  const oportunidades = oportunidadesDeEmpresa(empresa.id);
  const responsable = usuario(empresa.responsableId);
  const abiertas = oportunidades.filter((o) => o.estado === "ABIERTA");
  const cartera = abiertas.reduce((t, o) => t + o.valorEstimado, 0);

  return (
    <>
      <Seo titulo={empresa.razonSocial} descripcion="" noIndexar />

      <CabeceraPagina
        migas={[
          { texto: "Empresas", a: "/app/empresas" },
          { texto: empresa.nombreComercial || empresa.razonSocial },
        ]}
        titulo={empresa.nombreComercial || empresa.razonSocial}
        descripcion={empresa.razonSocial}
        meta={
          <>
            <Etiqueta tono={estado.tono} punto tamano="sm">
              {estado.texto}
            </Etiqueta>
            <span>
              <Icono nombre="capas" tamano={14} /> {empresa.industria}
            </span>
            <span>
              <Icono nombre="ubicacion" tamano={14} /> {empresa.localidad}
            </span>
          </>
        }
        acciones={
          <>
            <BotonEnlace
              a={`/app/empresas/${empresa.id}/editar`}
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
            <TarjetaCabecera titulo="Datos de la empresa" />
            <TarjetaCuerpo>
              <ListaDatos
                datos={[
                  { etiqueta: "Razón social", valor: empresa.razonSocial },
                  { etiqueta: "CUIT", valor: empresa.cuit },
                  { etiqueta: "Industria", valor: empresa.industria },
                  { etiqueta: "Origen", valor: empresa.origen },
                  {
                    etiqueta: "Correo",
                    valor: <a href={`mailto:${empresa.email}`}>{empresa.email}</a>,
                  },
                  {
                    etiqueta: "Teléfono",
                    valor: <a href={`tel:${empresa.telefono}`}>{empresa.telefono}</a>,
                  },
                  {
                    etiqueta: "Sitio web",
                    valor: (
                      <a
                        href={`https://${empresa.sitioWeb}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {empresa.sitioWeb}
                      </a>
                    ),
                  },
                  {
                    etiqueta: "Dirección",
                    valor: `${empresa.direccion}, ${empresa.localidad}`,
                  },
                  {
                    etiqueta: "Observaciones",
                    valor: empresa.observaciones,
                    ancho: true,
                  },
                ]}
              />
            </TarjetaCuerpo>
          </Tarjeta>

          <Tarjeta aSangre>
            <TarjetaCabecera
              titulo="Oportunidades"
              descripcion={`${plural(oportunidades.length, "negociación registrada", "negociaciones registradas")} con esta empresa`}
              acciones={
                <BotonEnlace
                  a="/app/oportunidades/nueva"
                  variante="secundario"
                  tamano="sm"
                  icono="mas"
                >
                  Agregar
                </BotonEnlace>
              }
            />
            <TarjetaCuerpo>
              {oportunidades.length === 0 ? (
                <EstadoVacio
                  icono="oportunidades"
                  titulo="Todavía no hay oportunidades"
                  descripcion="Cuando esta empresa consulte por un salón, cargá la oportunidad para seguirla en el embudo."
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
              descripcion="Actividades registradas con la empresa y sus contactos"
            />
            <TarjetaCuerpo>
              <LineaDeActividades
                actividades={actividadesDe({ empresaId: empresa.id })}
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
                          <Avatar
                            iniciales={responsable.iniciales}
                            tamano="sm"
                          />
                        )}
                        {nombreUsuario(empresa.responsableId)}
                      </span>
                    ),
                  },
                  { etiqueta: "Oportunidades abiertas", valor: abiertas.length },
                  { etiqueta: "Cartera abierta estimada", valor: pesos(cartera) },
                  { etiqueta: "Contactos asociados", valor: contactos.length },
                ]}
              />
            </TarjetaCuerpo>
          </Tarjeta>

          <Tarjeta aSangre>
            <TarjetaCabecera
              titulo="Contactos"
              nivel={3}
              acciones={
                <BotonEnlace
                  a="/app/contactos/nuevo"
                  variante="fantasma"
                  tamano="sm"
                  icono="mas"
                  aria-label="Agregar contacto"
                />
              }
            />
            <TarjetaCuerpo>
              {contactos.length === 0 ? (
                <EstadoVacio
                  icono="contactos"
                  titulo="Sin contactos"
                  descripcion="Agregá la persona con la que negociás en esta empresa."
                />
              ) : (
                <ul className={css.listaContactos}>
                  {contactos.map((c) => (
                    <li key={c.id}>
                      <Avatar
                        iniciales={`${c.nombre[0]}${c.apellido[0]}`}
                        tamano="md"
                      />
                      <div>
                        <Link to={`/app/contactos/${c.id}`}>
                          {nombreContacto(c)}
                        </Link>
                        <span className={css.cargo}>{c.cargo}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </TarjetaCuerpo>
          </Tarjeta>
        </aside>
      </div>
    </>
  );
}

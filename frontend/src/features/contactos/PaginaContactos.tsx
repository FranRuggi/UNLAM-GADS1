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
  datos,
  empresa as buscarEmpresa,
  nombreContacto,
  nombreUsuario,
  oportunidadesDeContacto,
  usuario,
} from "../../shared/data/demo";
import { ESTADO_CLIENTE } from "../../shared/data/formato";

const COLUMNAS = [
  "Contacto",
  "Cargo",
  "Empresa",
  "Teléfono",
  "Responsable",
  "Oportunidades",
  "Estado",
];

export function PaginaContactos() {
  const contactos = datos.contactos;

  return (
    <>
      <Seo
        titulo="Contactos"
        descripcion="Listado de contactos del CRM."
        noIndexar
      />

      <CabeceraPagina
        titulo="Contactos"
        descripcion="Personas con las que negociás, asociadas a una empresa o como cliente individual."
        acciones={
          <BotonEnlace a="/app/contactos/nuevo" icono="mas">
            Nuevo contacto
          </BotonEnlace>
        }
      />

      <Tarjeta aSangre>
        <BarraFiltros marcador="Buscar por nombre, correo o cargo">
          <Filtro
            etiqueta="Estado"
            opciones={["Potencial", "Cliente", "Inactivo", "No contactar"]}
          />
          <Filtro
            etiqueta="Empresa"
            opciones={datos.empresas.map((e) => e.nombreComercial || e.razonSocial)}
          />
          <Filtro
            etiqueta="Responsable"
            opciones={datos.usuarios.map((u) => `${u.nombre} ${u.apellido}`)}
          />
        </BarraFiltros>

        <Tabla resumen="Listado de contactos con su cargo, empresa y responsable comercial">
          <EncabezadoTabla columnas={COLUMNAS} />
          <tbody>
            {contactos.map((c) => {
              const estado = ESTADO_CLIENTE[c.estado];
              const empresa = buscarEmpresa(c.empresaId);
              const responsable = usuario(c.responsableId);

              return (
                <tr key={c.id}>
                  <td>
                    <span className="persona">
                      <Avatar
                        iniciales={`${c.nombre[0]}${c.apellido[0]}`}
                        tamano="sm"
                      />
                      <span>
                        <Link to={`/app/contactos/${c.id}`}>
                          {nombreContacto(c)}
                        </Link>
                        <span className="secundario">{c.email}</span>
                      </span>
                    </span>
                  </td>
                  <td>{c.cargo}</td>
                  <td>
                    {empresa ? (
                      <Link to={`/app/empresas/${empresa.id}`}>
                        {empresa.nombreComercial || empresa.razonSocial}
                      </Link>
                    ) : (
                      <Etiqueta tono="neutro" tamano="sm">
                        Cliente individual
                      </Etiqueta>
                    )}
                  </td>
                  <td>{c.telefono}</td>
                  <td>
                    <span className="persona">
                      {responsable && (
                        <Avatar iniciales={responsable.iniciales} tamano="sm" />
                      )}
                      {nombreUsuario(c.responsableId)}
                    </span>
                  </td>
                  <td className="numero">{oportunidadesDeContacto(c.id).length}</td>
                  <td className="compacta">
                    <Etiqueta tono={estado.tono} tamano="sm" punto>
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
            mostrados={contactos.length}
            total={contactos.length}
            entidad="contactos"
          />
        </TarjetaPie>
      </Tarjeta>
    </>
  );
}

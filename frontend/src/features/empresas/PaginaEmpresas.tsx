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
  contactosDeEmpresa,
  datos,
  nombreUsuario,
  oportunidadesDeEmpresa,
  usuario,
} from "../../shared/data/demo";
import { ESTADO_CLIENTE } from "../../shared/data/formato";

const COLUMNAS = [
  "Empresa",
  "Industria",
  "Localidad",
  "Responsable",
  "Contactos",
  "Oportunidades",
  "Estado",
];

export function PaginaEmpresas() {
  const empresas = datos.empresas;

  return (
    <>
      <Seo
        titulo="Empresas"
        descripcion="Listado de empresas cliente del CRM."
        noIndexar
      />

      <CabeceraPagina
        titulo="Empresas"
        descripcion="Organizaciones que consultaron por un salón o ya contrataron un evento."
        acciones={
          <BotonEnlace a="/app/empresas/nueva" icono="mas">
            Nueva empresa
          </BotonEnlace>
        }
      />

      <Tarjeta aSangre>
        <BarraFiltros marcador="Buscar por razón social, CUIT o industria">
          <Filtro
            etiqueta="Estado"
            opciones={["Potencial", "Cliente", "Inactivo", "No contactar"]}
          />
          <Filtro
            etiqueta="Responsable"
            opciones={datos.usuarios.map((u) => `${u.nombre} ${u.apellido}`)}
          />
          <Filtro etiqueta="Origen" opciones={datos.origenes.map((o) => o.nombre)} />
        </BarraFiltros>

        <Tabla resumen="Listado de empresas con su industria, responsable comercial y estado">
          <EncabezadoTabla columnas={COLUMNAS} />
          <tbody>
            {empresas.map((e) => {
              const estado = ESTADO_CLIENTE[e.estado];
              const responsable = usuario(e.responsableId);
              return (
                <tr key={e.id}>
                  <td>
                    <Link to={`/app/empresas/${e.id}`}>
                      {e.nombreComercial || e.razonSocial}
                    </Link>
                    <span className="secundario">{e.cuit}</span>
                  </td>
                  <td>{e.industria}</td>
                  <td>{e.localidad}</td>
                  <td>
                    <span className="persona">
                      {responsable && (
                        <Avatar iniciales={responsable.iniciales} tamano="sm" />
                      )}
                      {nombreUsuario(e.responsableId)}
                    </span>
                  </td>
                  <td className="numero">{contactosDeEmpresa(e.id).length}</td>
                  <td className="numero">{oportunidadesDeEmpresa(e.id).length}</td>
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
            mostrados={empresas.length}
            total={empresas.length}
            entidad="empresas"
          />
        </TarjetaPie>
      </Tarjeta>
    </>
  );
}

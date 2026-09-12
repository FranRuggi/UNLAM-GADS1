import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Seo } from "../../shared/seo/Seo";
import { CabeceraPagina } from "../../shared/components/CabeceraPagina";
import { Boton, BotonEnlace } from "../../shared/components/Boton";
import { Tarjeta, TarjetaCuerpo, TarjetaPie } from "../../shared/components/Tarjeta";
import { Icono } from "../../shared/components/Icono";
import {
  AreaTexto,
  Campo,
  Entrada,
  GrupoCampos,
  Selector,
} from "../../shared/components/Campos";
import { datos, empresa as buscarEmpresa } from "../../shared/data/demo";
import { ESTADO_CLIENTE } from "../../shared/data/formato";
import pantalla from "../../shared/styles/pantalla.module.css";

export function PaginaEmpresaFormulario() {
  const { id } = useParams();
  const navegar = useNavigate();
  const empresa = id ? buscarEmpresa(id) : undefined;
  const edicion = Boolean(empresa);

  /** La maqueta no persiste: al guardar se vuelve a la vista anterior. */
  const alEnviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navegar(empresa ? `/app/empresas/${empresa.id}` : "/app/empresas");
  };

  return (
    <>
      <Seo
        titulo={edicion ? "Editar empresa" : "Nueva empresa"}
        descripcion=""
        noIndexar
      />

      <CabeceraPagina
        migas={[
          { texto: "Empresas", a: "/app/empresas" },
          { texto: edicion ? "Editar" : "Nueva empresa" },
        ]}
        titulo={edicion ? `Editar ${empresa?.nombreComercial}` : "Nueva empresa"}
        descripcion={
          edicion
            ? "Actualizá los datos de la organización y su responsable comercial."
            : "Registrá la organización que consulta por un salón. Después vas a poder asociarle contactos y oportunidades."
        }
      />

      <form onSubmit={alEnviar}>
        <Tarjeta>
          <TarjetaCuerpo>
            <p className={pantalla.avisoMaqueta}>
              <Icono nombre="info" tamano={16} />
              Maqueta sin backend: el formulario no valida ni guarda. La
              validación con Zod y la persistencia llegan con la API.
            </p>

            <div style={{ marginTop: "var(--e-8)" }}>
              <GrupoCampos
                titulo="Identificación"
                descripcion="Datos fiscales y comerciales de la organización."
              >
                <Campo etiqueta="Razón social" requerido ancho>
                  {(id) => (
                    <Entrada
                      id={id}
                      name="razonSocial"
                      defaultValue={empresa?.razonSocial}
                      placeholder="Consultora Delta S.R.L."
                      required
                    />
                  )}
                </Campo>

                <Campo etiqueta="Nombre comercial">
                  {(id) => (
                    <Entrada
                      id={id}
                      name="nombreComercial"
                      defaultValue={empresa?.nombreComercial}
                      placeholder="Delta"
                    />
                  )}
                </Campo>

                <Campo etiqueta="CUIT" ayuda="Formato 30-00000000-0">
                  {(id, ayuda) => (
                    <Entrada
                      id={id}
                      name="cuit"
                      aria-describedby={ayuda}
                      defaultValue={empresa?.cuit}
                      placeholder="30-71234567-8"
                    />
                  )}
                </Campo>

                <Campo etiqueta="Industria o actividad" requerido>
                  {(id) => (
                    <Entrada
                      id={id}
                      name="industria"
                      defaultValue={empresa?.industria}
                      placeholder="Consultoría"
                      required
                    />
                  )}
                </Campo>

                <Campo etiqueta="Estado" requerido>
                  {(id) => (
                    <Selector
                      id={id}
                      name="estado"
                      defaultValue={empresa?.estado ?? "POTENCIAL"}
                    >
                      {Object.entries(ESTADO_CLIENTE).map(([valor, e]) => (
                        <option key={valor} value={valor}>
                          {e.texto}
                        </option>
                      ))}
                    </Selector>
                  )}
                </Campo>
              </GrupoCampos>

              <GrupoCampos titulo="Contacto y ubicación">
                <Campo etiqueta="Correo electrónico">
                  {(id) => (
                    <Entrada
                      id={id}
                      name="email"
                      type="email"
                      defaultValue={empresa?.email}
                      placeholder="contacto@empresa.com.ar"
                    />
                  )}
                </Campo>

                <Campo etiqueta="Teléfono">
                  {(id) => (
                    <Entrada
                      id={id}
                      name="telefono"
                      type="tel"
                      defaultValue={empresa?.telefono}
                      placeholder="+54 11 4000-0000"
                    />
                  )}
                </Campo>

                <Campo etiqueta="Dirección">
                  {(id) => (
                    <Entrada
                      id={id}
                      name="direccion"
                      defaultValue={empresa?.direccion}
                      placeholder="Av. Santa Fe 1234, piso 5"
                    />
                  )}
                </Campo>

                <Campo etiqueta="Localidad">
                  {(id) => (
                    <Entrada
                      id={id}
                      name="localidad"
                      defaultValue={empresa?.localidad}
                      placeholder="CABA"
                    />
                  )}
                </Campo>

                <Campo etiqueta="Sitio web" ancho>
                  {(id) => (
                    <Entrada
                      id={id}
                      name="sitioWeb"
                      defaultValue={empresa?.sitioWeb}
                      placeholder="www.empresa.com.ar"
                    />
                  )}
                </Campo>
              </GrupoCampos>

              <GrupoCampos titulo="Gestión comercial">
                <Campo etiqueta="Responsable comercial" requerido>
                  {(id) => (
                    <Selector
                      id={id}
                      name="responsableId"
                      defaultValue={empresa?.responsableId ?? ""}
                      required
                    >
                      <option value="" disabled>
                        Elegí un responsable
                      </option>
                      {datos.usuarios.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nombre} {u.apellido}
                        </option>
                      ))}
                    </Selector>
                  )}
                </Campo>

                <Campo etiqueta="Origen">
                  {(id) => (
                    <Selector
                      id={id}
                      name="origen"
                      defaultValue={empresa?.origen ?? ""}
                    >
                      <option value="" disabled>
                        Elegí un origen
                      </option>
                      {datos.origenes.map((o) => (
                        <option key={o.id} value={o.nombre}>
                          {o.nombre}
                        </option>
                      ))}
                    </Selector>
                  )}
                </Campo>

                <Campo
                  etiqueta="Observaciones"
                  ancho
                  ayuda="Notas internas del equipo comercial."
                >
                  {(id, ayuda) => (
                    <AreaTexto
                      id={id}
                      name="observaciones"
                      aria-describedby={ayuda}
                      defaultValue={empresa?.observaciones}
                      placeholder="Buscan espacio recurrente para capacitaciones mensuales."
                    />
                  )}
                </Campo>
              </GrupoCampos>
            </div>
          </TarjetaCuerpo>

          <TarjetaPie>
            <span>Los campos marcados con asterisco son obligatorios.</span>
            <span style={{ display: "flex", gap: "var(--e-2)" }}>
              <BotonEnlace
                a={empresa ? `/app/empresas/${empresa.id}` : "/app/empresas"}
                variante="secundario"
              >
                Cancelar
              </BotonEnlace>
              <Boton type="submit" icono="check">
                {edicion ? "Guardar cambios" : "Crear empresa"}
              </Boton>
            </span>
          </TarjetaPie>
        </Tarjeta>
      </form>
    </>
  );
}

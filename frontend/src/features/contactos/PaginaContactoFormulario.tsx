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
import {
  contacto as buscarContacto,
  datos,
  nombreContacto,
} from "../../shared/data/demo";
import { ESTADO_CLIENTE } from "../../shared/data/formato";
import pantalla from "../../shared/styles/pantalla.module.css";

export function PaginaContactoFormulario() {
  const { id } = useParams();
  const navegar = useNavigate();
  const contacto = id ? buscarContacto(id) : undefined;
  const edicion = Boolean(contacto);

  const alEnviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navegar(contacto ? `/app/contactos/${contacto.id}` : "/app/contactos");
  };

  return (
    <>
      <Seo
        titulo={edicion ? "Editar contacto" : "Nuevo contacto"}
        descripcion=""
        noIndexar
      />

      <CabeceraPagina
        migas={[
          { texto: "Contactos", a: "/app/contactos" },
          { texto: edicion ? "Editar" : "Nuevo contacto" },
        ]}
        titulo={
          edicion && contacto
            ? `Editar ${nombreContacto(contacto)}`
            : "Nuevo contacto"
        }
        descripcion={
          edicion
            ? "Actualizá los datos de la persona y su relación con la empresa."
            : "Registrá la persona con la que vas a negociar. Si es un cliente individual, dejá la empresa vacía."
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
              <GrupoCampos titulo="Datos personales">
                <Campo etiqueta="Nombre" requerido>
                  {(id) => (
                    <Entrada
                      id={id}
                      name="nombre"
                      defaultValue={contacto?.nombre}
                      placeholder="Carolina"
                      required
                    />
                  )}
                </Campo>

                <Campo etiqueta="Apellido" requerido>
                  {(id) => (
                    <Entrada
                      id={id}
                      name="apellido"
                      defaultValue={contacto?.apellido}
                      placeholder="Suárez"
                      required
                    />
                  )}
                </Campo>

                <Campo etiqueta="Cargo">
                  {(id) => (
                    <Entrada
                      id={id}
                      name="cargo"
                      defaultValue={contacto?.cargo}
                      placeholder="Jefa de Capacitación"
                    />
                  )}
                </Campo>

                <Campo etiqueta="Estado" requerido>
                  {(id) => (
                    <Selector
                      id={id}
                      name="estado"
                      defaultValue={contacto?.estado ?? "POTENCIAL"}
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

              <GrupoCampos titulo="Contacto">
                <Campo etiqueta="Correo electrónico" requerido>
                  {(id) => (
                    <Entrada
                      id={id}
                      name="email"
                      type="email"
                      defaultValue={contacto?.email}
                      placeholder="carolina@empresa.com.ar"
                      required
                    />
                  )}
                </Campo>

                <Campo etiqueta="Teléfono">
                  {(id) => (
                    <Entrada
                      id={id}
                      name="telefono"
                      type="tel"
                      defaultValue={contacto?.telefono}
                      placeholder="+54 9 11 5555-5555"
                    />
                  )}
                </Campo>
              </GrupoCampos>

              <GrupoCampos
                titulo="Relación comercial"
                descripcion="Un contacto puede pertenecer a una empresa o existir como cliente individual."
              >
                <Campo
                  etiqueta="Empresa relacionada"
                  ayuda="Dejalo vacío si se trata de un cliente individual."
                >
                  {(id, ayuda) => (
                    <Selector
                      id={id}
                      name="empresaId"
                      aria-describedby={ayuda}
                      defaultValue={contacto?.empresaId ?? ""}
                    >
                      <option value="">Sin empresa (cliente individual)</option>
                      {datos.empresas.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.nombreComercial || e.razonSocial}
                        </option>
                      ))}
                    </Selector>
                  )}
                </Campo>

                <Campo etiqueta="Responsable comercial" requerido>
                  {(id) => (
                    <Selector
                      id={id}
                      name="responsableId"
                      defaultValue={contacto?.responsableId ?? ""}
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
                      defaultValue={contacto?.origen ?? ""}
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

                <Campo etiqueta="Observaciones" ancho>
                  {(id) => (
                    <AreaTexto
                      id={id}
                      name="observaciones"
                      defaultValue={contacto?.observaciones}
                      placeholder="Prefiere que la contacten por correo antes de las 11."
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
                a={contacto ? `/app/contactos/${contacto.id}` : "/app/contactos"}
                variante="secundario"
              >
                Cancelar
              </BotonEnlace>
              <Boton type="submit" icono="check">
                {edicion ? "Guardar cambios" : "Crear contacto"}
              </Boton>
            </span>
          </TarjetaPie>
        </Tarjeta>
      </form>
    </>
  );
}

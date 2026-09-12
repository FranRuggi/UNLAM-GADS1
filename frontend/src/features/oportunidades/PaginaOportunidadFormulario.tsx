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
  datos,
  etapasOrdenadas,
  nombreContacto,
  oportunidad as buscarOportunidad,
} from "../../shared/data/demo";
import pantalla from "../../shared/styles/pantalla.module.css";

const TIPOS_EVENTO = [
  "Capacitación",
  "Convención",
  "Lanzamiento de producto",
  "Reunión de directorio",
  "Workshop",
  "Jornada de integración",
];

export function PaginaOportunidadFormulario() {
  const { id } = useParams();
  const navegar = useNavigate();
  const oportunidad = id ? buscarOportunidad(id) : undefined;
  const edicion = Boolean(oportunidad);

  const alEnviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navegar(
      oportunidad ? `/app/oportunidades/${oportunidad.id}` : "/app/oportunidades",
    );
  };

  return (
    <>
      <Seo
        titulo={edicion ? "Editar oportunidad" : "Nueva oportunidad"}
        descripcion=""
        noIndexar
      />

      <CabeceraPagina
        migas={[
          { texto: "Oportunidades", a: "/app/oportunidades" },
          { texto: edicion ? "Editar" : "Nueva oportunidad" },
        ]}
        titulo={edicion ? "Editar oportunidad" : "Nueva oportunidad"}
        descripcion={
          edicion
            ? "Actualizá los datos de la negociación. El cambio de etapa se hace desde el detalle o el embudo."
            : "Toda oportunidad necesita un responsable, un salón y al menos una empresa o un contacto."
        }
      />

      <form onSubmit={alEnviar}>
        <Tarjeta>
          <TarjetaCuerpo>
            <p className={pantalla.avisoMaqueta}>
              <Icono nombre="info" tamano={16} />
              Maqueta sin backend: el formulario no valida ni guarda. El control
              de capacidad y disponibilidad del salón se resuelve en el servidor.
            </p>

            <div style={{ marginTop: "var(--e-8)" }}>
              <GrupoCampos titulo="Identificación de la negociación">
                <Campo etiqueta="Título" requerido ancho>
                  {(id) => (
                    <Entrada
                      id={id}
                      name="titulo"
                      defaultValue={oportunidad?.titulo}
                      placeholder="Capacitación anual de liderazgo"
                      required
                    />
                  )}
                </Campo>

                <Campo
                  etiqueta="Empresa"
                  ayuda="Empresa o contacto: al menos uno es obligatorio."
                >
                  {(id, ayuda) => (
                    <Selector
                      id={id}
                      name="empresaId"
                      aria-describedby={ayuda}
                      defaultValue={oportunidad?.empresaId ?? ""}
                    >
                      <option value="">Sin empresa</option>
                      {datos.empresas.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.nombreComercial || e.razonSocial}
                        </option>
                      ))}
                    </Selector>
                  )}
                </Campo>

                <Campo etiqueta="Contacto">
                  {(id) => (
                    <Selector
                      id={id}
                      name="contactoId"
                      defaultValue={oportunidad?.contactoId ?? ""}
                    >
                      <option value="">Sin contacto</option>
                      {datos.contactos.map((c) => (
                        <option key={c.id} value={c.id}>
                          {nombreContacto(c)}
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
                      defaultValue={oportunidad?.responsableId ?? ""}
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
                      defaultValue={oportunidad?.origen ?? ""}
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
              </GrupoCampos>

              <GrupoCampos
                titulo="Evento y salón"
                descripcion="Los asistentes no pueden superar la capacidad del salón elegido."
              >
                <Campo etiqueta="Salón" requerido>
                  {(id) => (
                    <Selector
                      id={id}
                      name="salonId"
                      defaultValue={oportunidad?.salonId ?? ""}
                      required
                    >
                      <option value="" disabled>
                        Elegí un salón
                      </option>
                      {datos.salones.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nombre} ({s.capacidad} personas)
                        </option>
                      ))}
                    </Selector>
                  )}
                </Campo>

                <Campo etiqueta="Tipo de evento">
                  {(id) => (
                    <Selector
                      id={id}
                      name="tipoEvento"
                      defaultValue={oportunidad?.tipoEvento ?? ""}
                    >
                      <option value="" disabled>
                        Elegí un tipo
                      </option>
                      {TIPOS_EVENTO.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </Selector>
                  )}
                </Campo>

                <Campo etiqueta="Fecha del evento" requerido>
                  {(id) => (
                    <Entrada
                      id={id}
                      name="fechaEvento"
                      type="date"
                      defaultValue={oportunidad?.fechaEvento}
                      required
                    />
                  )}
                </Campo>

                <Campo etiqueta="Cantidad de asistentes" requerido>
                  {(id) => (
                    <Entrada
                      id={id}
                      name="cantidadAsistentes"
                      type="number"
                      min={1}
                      max={50}
                      defaultValue={oportunidad?.cantidadAsistentes}
                      placeholder="24"
                      required
                    />
                  )}
                </Campo>
              </GrupoCampos>

              <GrupoCampos titulo="Seguimiento comercial">
                <Campo etiqueta="Etapa actual" requerido>
                  {(id) => (
                    <Selector
                      id={id}
                      name="etapaId"
                      defaultValue={oportunidad?.etapaId ?? etapasOrdenadas()[0].id}
                      required
                    >
                      {etapasOrdenadas().map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.nombre}
                        </option>
                      ))}
                    </Selector>
                  )}
                </Campo>

                <Campo etiqueta="Valor estimado" ayuda="En pesos argentinos.">
                  {(id, ayuda) => (
                    <Entrada
                      id={id}
                      name="valorEstimado"
                      type="number"
                      min={0}
                      step={1000}
                      aria-describedby={ayuda}
                      defaultValue={oportunidad?.valorEstimado}
                      placeholder="250000"
                    />
                  )}
                </Campo>

                <Campo etiqueta="Probabilidad de cierre" ayuda="Entre 0 y 100.">
                  {(id, ayuda) => (
                    <Entrada
                      id={id}
                      name="probabilidad"
                      type="number"
                      min={0}
                      max={100}
                      aria-describedby={ayuda}
                      defaultValue={oportunidad?.probabilidad}
                      placeholder="40"
                    />
                  )}
                </Campo>

                <Campo etiqueta="Fecha estimada de cierre">
                  {(id) => (
                    <Entrada
                      id={id}
                      name="fechaEstimadaCierre"
                      type="date"
                      defaultValue={oportunidad?.fechaEstimadaCierre}
                    />
                  )}
                </Campo>

                <Campo etiqueta="Observaciones" ancho>
                  {(id) => (
                    <AreaTexto
                      id={id}
                      name="observaciones"
                      defaultValue={oportunidad?.observaciones}
                      placeholder="Piden catering incluido y una prueba de sonido el día anterior."
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
                a={
                  oportunidad
                    ? `/app/oportunidades/${oportunidad.id}`
                    : "/app/oportunidades"
                }
                variante="secundario"
              >
                Cancelar
              </BotonEnlace>
              <Boton type="submit" icono="check">
                {edicion ? "Guardar cambios" : "Crear oportunidad"}
              </Boton>
            </span>
          </TarjetaPie>
        </Tarjeta>
      </form>
    </>
  );
}

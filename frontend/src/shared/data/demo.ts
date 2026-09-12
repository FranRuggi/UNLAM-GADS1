import bruto from "./demo.json";
import type {
  Actividad,
  CambioEtapa,
  Contacto,
  DatosDemo,
  Empresa,
  Etapa,
  Oportunidad,
  Salon,
  Usuario,
} from "./tipos";

/**
 * Única fuente de datos de la maqueta.
 *
 * Es de sólo lectura y vive en memoria: las altas, ediciones y cambios de
 * etapa todavía no persisten (ver el alcance del plan de la maqueta). Cuando
 * exista la API, este módulo se reemplaza por consultas de TanStack Query y
 * las vistas siguen consumiendo las mismas funciones de búsqueda.
 */
export const datos = bruto as DatosDemo;

/* --- Búsquedas por identificador ----------------------------------------- */

const indice = <T extends { id: string }>(items: T[]) =>
  new Map(items.map((i) => [i.id, i]));

const usuarios = indice(datos.usuarios);
const empresas = indice(datos.empresas);
const contactos = indice(datos.contactos);
const salones = indice(datos.salones);
const etapas = indice(datos.etapas);
const oportunidades = indice(datos.oportunidades);
const motivos = indice(datos.motivosPerdida);
const tiposActividad = indice(datos.tiposActividad);

export const usuario = (id: string) => usuarios.get(id);
export const empresa = (id: string | null) => (id ? empresas.get(id) : undefined);
export const contacto = (id: string | null) => (id ? contactos.get(id) : undefined);
export const salon = (id: string) => salones.get(id);
export const etapa = (id: string) => etapas.get(id);
export const oportunidad = (id: string) => oportunidades.get(id);
export const motivoPerdida = (id: string | null) => (id ? motivos.get(id) : undefined);
export const tipoActividad = (id: string) => tiposActividad.get(id);

/* --- Derivados de uso frecuente ------------------------------------------- */

export const nombreUsuario = (id: string): string => {
  const u = usuario(id);
  return u ? `${u.nombre} ${u.apellido}` : "Sin asignar";
};

export const nombreContacto = (c: Contacto): string =>
  `${c.nombre} ${c.apellido}`;

/** Empresa o, si es un cliente individual, el contacto asociado. */
export const clienteDe = (o: Oportunidad): string => {
  const e = empresa(o.empresaId);
  if (e) return e.nombreComercial || e.razonSocial;
  const c = contacto(o.contactoId);
  return c ? nombreContacto(c) : "Sin cliente";
};

export const etapasOrdenadas = (): Etapa[] =>
  [...datos.etapas].sort((a, b) => a.orden - b.orden);

export const contactosDeEmpresa = (idEmpresa: string): Contacto[] =>
  datos.contactos.filter((c) => c.empresaId === idEmpresa);

export const oportunidadesDeEmpresa = (idEmpresa: string): Oportunidad[] =>
  datos.oportunidades.filter((o) => o.empresaId === idEmpresa);

export const oportunidadesDeContacto = (idContacto: string): Oportunidad[] =>
  datos.oportunidades.filter((o) => o.contactoId === idContacto);

export const oportunidadesDeEtapa = (idEtapa: string): Oportunidad[] =>
  datos.oportunidades.filter((o) => o.etapaId === idEtapa);

export const oportunidadesDeSalon = (idSalon: string): Oportunidad[] =>
  datos.oportunidades.filter((o) => o.salonId === idSalon);

const porFechaDesc = (a: { fecha: string }, b: { fecha: string }) =>
  b.fecha.localeCompare(a.fecha);

export const actividadesDe = (filtro: {
  empresaId?: string;
  contactoId?: string;
  oportunidadId?: string;
}): Actividad[] =>
  datos.actividades
    .filter(
      (a) =>
        (filtro.empresaId ? a.empresaId === filtro.empresaId : false) ||
        (filtro.contactoId ? a.contactoId === filtro.contactoId : false) ||
        (filtro.oportunidadId ? a.oportunidadId === filtro.oportunidadId : false),
    )
    .sort(porFechaDesc);

export const historialDe = (idOportunidad: string): CambioEtapa[] =>
  datos.historialEtapas
    .filter((h) => h.oportunidadId === idOportunidad)
    .sort(porFechaDesc);

/* --- Sesión simulada ------------------------------------------------------- */

/** Usuario que se muestra en la barra superior. No hay autenticación real. */
export const usuarioActual: Usuario =
  datos.usuarios.find((u) => u.rol === "RESPONSABLE_COMERCIAL") ??
  datos.usuarios[0];

export type { Empresa, Contacto, Salon, Etapa, Oportunidad, Usuario, Actividad };

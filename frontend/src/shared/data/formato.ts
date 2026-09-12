import type { EstadoCliente, EstadoOportunidad, EstadoSalon } from "./tipos";
import type { Tono } from "../components/Etiqueta";

const LOCALE = "es-AR";

const moneda = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const fechaCorta = new Intl.DateTimeFormat(LOCALE, {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const fechaLarga = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const horaCorta = new Intl.DateTimeFormat(LOCALE, {
  hour: "2-digit",
  minute: "2-digit",
});

/**
 * Las fechas del set de demostración son locales, sin zona (ver DP-07).
 * Devuelve `null` ante un valor ausente para que un dato incompleto muestre
 * un guión en lugar de romper la pantalla.
 */
const aFecha = (iso: string | null | undefined) =>
  iso ? new Date(iso.length === 10 ? `${iso}T00:00:00` : iso) : null;

const SIN_DATO = "—";

export const pesos = (valor: number) => moneda.format(valor);

/** "1 cambio" / "3 cambios", para los contadores de las pantallas. */
export const plural = (cantidad: number, singular: string, plural: string) =>
  `${cantidad} ${cantidad === 1 ? singular : plural}`;

export const numero = (valor: number) => new Intl.NumberFormat(LOCALE).format(valor);

export const fecha = (iso: string | null | undefined) => {
  const d = aFecha(iso);
  return d ? fechaCorta.format(d) : SIN_DATO;
};

export const fechaExtendida = (iso: string | null | undefined) => {
  const d = aFecha(iso);
  return d ? fechaLarga.format(d) : SIN_DATO;
};

export const fechaHora = (iso: string | null | undefined) => {
  const d = aFecha(iso);
  return d ? `${fechaCorta.format(d)}, ${horaCorta.format(d)}` : SIN_DATO;
};

/** "hace 3 días", para las líneas de tiempo de actividad. */
export const desdeHace = (
  iso: string | null | undefined,
  referencia = new Date("2026-09-12T12:00:00"),
) => {
  const d = aFecha(iso);
  if (!d) return SIN_DATO;
  const dias = Math.round((referencia.getTime() - d.getTime()) / 86_400_000);
  if (dias <= 0) return "hoy";
  if (dias === 1) return "ayer";
  if (dias < 30) return `hace ${dias} días`;
  const meses = Math.round(dias / 30);
  return meses === 1 ? "hace 1 mes" : `hace ${meses} meses`;
};

/* --- Etiquetas legibles de los estados ------------------------------------ */

export const ESTADO_CLIENTE: Record<EstadoCliente, { texto: string; tono: Tono }> = {
  POTENCIAL: { texto: "Potencial", tono: "info" },
  CLIENTE: { texto: "Cliente", tono: "exito" },
  INACTIVO: { texto: "Inactivo", tono: "neutro" },
  NO_CONTACTAR: { texto: "No contactar", tono: "peligro" },
};

export const ESTADO_OPORTUNIDAD: Record<
  EstadoOportunidad,
  { texto: string; tono: Tono }
> = {
  ABIERTA: { texto: "Abierta", tono: "info" },
  GANADA: { texto: "Ganada", tono: "exito" },
  PERDIDA: { texto: "Perdida", tono: "peligro" },
};

export const ESTADO_SALON: Record<EstadoSalon, { texto: string; tono: Tono }> = {
  DISPONIBLE: { texto: "Disponible", tono: "exito" },
  MANTENIMIENTO: { texto: "En mantenimiento", tono: "alerta" },
  INACTIVO: { texto: "Inactivo", tono: "neutro" },
};

export const ROL: Record<string, string> = {
  ADMIN: "Administrador",
  VENDEDOR: "Vendedor",
  RESPONSABLE_COMERCIAL: "Responsable comercial",
};

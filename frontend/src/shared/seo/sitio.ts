/**
 * Constantes del sitio usadas por SEO, datos estructurados y pie de página.
 * El dominio definitivo está pendiente (ver DF-04 en decisiones-frontend.md).
 */
export const SITIO = {
  nombre: "Ztech CRM",
  nombreLargo: "Ztech — Executive CRM",
  lema: "CRM para salones de eventos corporativos",
  url: "https://ztechcrm.com.ar",
  imagenSocial: "/imagenes/ztech-crm-og.jpg",
  email: "contacto@ztechcrm.com.ar",
  idioma: "es-AR",
  institucion: "Universidad Nacional de La Matanza",
  materia: "Gestión Aplicada al Desarrollo de Software II",
  localidad: "San Justo, Provincia de Buenos Aires, Argentina",
} as const;

export const urlAbsoluta = (ruta: string): string =>
  ruta.startsWith("http") ? ruta : `${SITIO.url}${ruta}`;

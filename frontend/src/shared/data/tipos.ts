/**
 * Tipos del dominio tal como los consume la interfaz.
 *
 * Reflejan la ERS y los módulos de la consigna. Cuando exista la API, estos
 * tipos pasan a derivarse de los DTO del backend (`/api/v1`); las vistas no
 * deberían cambiar.
 */

export type Rol = "ADMIN" | "VENDEDOR" | "RESPONSABLE_COMERCIAL";

export type EstadoCliente = "POTENCIAL" | "CLIENTE" | "INACTIVO" | "NO_CONTACTAR";

export type EstadoOportunidad = "ABIERTA" | "GANADA" | "PERDIDA";

export type EstadoSalon = "DISPONIBLE" | "MANTENIMIENTO" | "INACTIVO";

export type TipoEtapa = "ABIERTA" | "GANADA" | "PERDIDA";

export type ColorEtapa =
  | "teal"
  | "blue"
  | "violet"
  | "indigo"
  | "amber"
  | "green"
  | "red";

export type Usuario = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: Rol;
  iniciales: string;
  activo: boolean;
};

export type Empresa = {
  id: string;
  razonSocial: string;
  nombreComercial: string;
  cuit: string;
  industria: string;
  email: string;
  telefono: string;
  direccion: string;
  localidad: string;
  sitioWeb: string;
  estado: EstadoCliente;
  responsableId: string;
  origen: string;
  observaciones: string;
};

export type Contacto = {
  id: string;
  nombre: string;
  apellido: string;
  cargo: string;
  email: string;
  telefono: string;
  empresaId: string | null;
  responsableId: string;
  estado: EstadoCliente;
  origen: string;
  observaciones: string;
};

export type Salon = {
  id: string;
  nombre: string;
  capacidad: number;
  tarifaPorJornada: number;
  direccion: string;
  localidad: string;
  estado: EstadoSalon;
  equipamiento: string[];
  descripcion: string;
};

export type Etapa = {
  id: string;
  nombre: string;
  orden: number;
  tipo: TipoEtapa;
  color: ColorEtapa;
};

export type Oportunidad = {
  id: string;
  titulo: string;
  empresaId: string | null;
  contactoId: string | null;
  responsableId: string;
  salonId: string;
  etapaId: string;
  estado: EstadoOportunidad;
  valorEstimado: number;
  probabilidad: number;
  fechaEstimadaCierre: string;
  fechaRealCierre: string | null;
  fechaEvento: string;
  cantidadAsistentes: number;
  tipoEvento: string;
  origen: string;
  motivoPerdidaId: string | null;
  observaciones: string;
  creadaEl: string;
};

export type Catalogo = { id: string; nombre: string };

export type TipoActividad = Catalogo & { icono: string };

export type Actividad = {
  id: string;
  tipoId: string;
  titulo: string;
  detalle: string;
  usuarioId: string;
  empresaId: string | null;
  contactoId: string | null;
  oportunidadId: string | null;
  fecha: string;
};

export type CambioEtapa = {
  id: string;
  oportunidadId: string;
  etapaOrigenId: string | null;
  etapaDestinoId: string;
  usuarioId: string;
  fecha: string;
};

export type DatosDemo = {
  usuarios: Usuario[];
  empresas: Empresa[];
  contactos: Contacto[];
  salones: Salon[];
  etapas: Etapa[];
  oportunidades: Oportunidad[];
  origenes: Catalogo[];
  motivosPerdida: Catalogo[];
  tiposActividad: TipoActividad[];
  actividades: Actividad[];
  historialEtapas: CambioEtapa[];
};

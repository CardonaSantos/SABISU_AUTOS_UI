// Tipos para la aplicación

// Departamentos
export interface Departamentos {
  id: number;
  nombre: string;
}

// Municipios
export interface Municipios {
  id: number;
  nombre: string;
}

// Servicios
export interface Servicios {
  id: number;
  nombre: string;
}

// Servicios de Internet
export interface ServiciosInternet {
  id: number;
  nombre: string;
  velocidad: string;
}

// Zonas de Facturación
export interface FacturacionZona {
  id: number;
  nombre: string;
  velocidad: string;
  clientesCount: number;
  facturasCount: number;
}

// Contrato
export interface ContratoID {
  clienteId: number;
  idContrato: string;
  fechaFirma: Date | null;
  archivoContrato: string;
  observaciones: string;
}

// Datos del Cliente
export interface CustomerData {
  id: number;
  nombre: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  dpi: string;
  observaciones: string;
  contactoReferenciaNombre: string;
  contactoReferenciaTelefono: string;
  coordenadas: string[];
  ip: string;
  gateway: string;
  mascara: string;
  contrasenaWifi: string;
  ssidRouter: string;
  fechaInstalacion: string;
  departamento: Departamentos;
  municipio: Municipios;
  servicios: Servicios[];
  servicioWifi: ServiciosInternet;
  zonaFacturacion: FacturacionZona;
  contrato?: {
    idContrato: string;
    fechaFirma: string;
    archivoContrato: string;
    observaciones: string;
  };
}

// Datos del formulario
export interface FormData {
  // Datos básicos
  nombre: string;
  coordenadas: string;
  ip: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  dpi: string;
  observaciones: string;
  contactoReferenciaNombre: string;
  contactoReferenciaTelefono: string;

  // Datos del servicio
  contrasenaWifi: string;
  ssidRouter: string;
  fechaInstalacion: Date | null;
  asesorId: string | null;
  servicioId: string | null;
  municipioId: string | null;
  departamentoId: string | null;
  empresaId: string;

  mascara: string;
  gateway: string;
}

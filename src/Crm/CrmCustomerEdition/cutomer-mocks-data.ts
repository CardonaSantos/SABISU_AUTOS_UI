// Tipos importados de tu aplicación
import type {
  Departamentos,
  Municipios,
  Servicios,
  ServiciosInternet,
  FacturacionZona,
  CustomerData,
} from "./types";

// Mock de departamentos
export const mockDepartamentos: Departamentos[] = [
  { id: 1, nombre: "Guatemala" },
  { id: 2, nombre: "Quetzaltenango" },
  { id: 3, nombre: "Escuintla" },
  { id: 4, nombre: "Sacatepéquez" },
  { id: 5, nombre: "Chimaltenango" },
];

// Mock de municipios por departamento
export const mockMunicipiosPorDepartamento: Record<number, Municipios[]> = {
  1: [
    { id: 101, nombre: "Guatemala" },
    { id: 102, nombre: "Mixco" },
    { id: 103, nombre: "Villa Nueva" },
    { id: 104, nombre: "San Miguel Petapa" },
  ],
  2: [
    { id: 201, nombre: "Quetzaltenango" },
    { id: 202, nombre: "Coatepeque" },
    { id: 203, nombre: "Colomba" },
  ],
  3: [
    { id: 301, nombre: "Escuintla" },
    { id: 302, nombre: "Santa Lucía Cotzumalguapa" },
    { id: 303, nombre: "La Democracia" },
  ],
  4: [
    { id: 401, nombre: "Antigua Guatemala" },
    { id: 402, nombre: "Jocotenango" },
    { id: 403, nombre: "Ciudad Vieja" },
  ],
  5: [
    { id: 501, nombre: "Chimaltenango" },
    { id: 502, nombre: "Tecpán" },
    { id: 503, nombre: "Patzún" },
  ],
};

// Mock de servicios
export const mockServicios: Servicios[] = [
  { id: 1, nombre: "Instalación" },
  { id: 2, nombre: "Soporte Técnico" },
  { id: 3, nombre: "Mantenimiento" },
  { id: 4, nombre: "Configuración de Router" },
  { id: 5, nombre: "Cambio de Equipo" },
];

// Mock de servicios de internet
export const mockServiciosInternet: ServiciosInternet[] = [
  { id: 1, nombre: "Plan Básico", velocidad: "10 Mbps" },
  { id: 2, nombre: "Plan Estándar", velocidad: "25 Mbps" },
  { id: 3, nombre: "Plan Premium", velocidad: "50 Mbps" },
  { id: 4, nombre: "Plan Empresarial", velocidad: "100 Mbps" },
  { id: 5, nombre: "Plan Fibra Óptica", velocidad: "200 Mbps" },
];

// Mock de zonas de facturación
export const mockZonasFacturacion: FacturacionZona[] = [
  {
    id: 1,
    nombre: "Zona Norte",
    velocidad: "25 Mbps",
    clientesCount: 120,
    facturasCount: 350,
  },
  {
    id: 2,
    nombre: "Zona Sur",
    velocidad: "50 Mbps",
    clientesCount: 85,
    facturasCount: 210,
  },
  {
    id: 3,
    nombre: "Zona Este",
    velocidad: "30 Mbps",
    clientesCount: 65,
    facturasCount: 180,
  },
  {
    id: 4,
    nombre: "Zona Oeste",
    velocidad: "40 Mbps",
    clientesCount: 95,
    facturasCount: 280,
  },
  {
    id: 5,
    nombre: "Zona Central",
    velocidad: "100 Mbps",
    clientesCount: 150,
    facturasCount: 420,
  },
];

// Mock de un cliente específico para edición
export const mockCustomerData: CustomerData = {
  id: 123,
  nombre: "Juan Carlos",
  apellidos: "Pérez González",
  telefono: "5555-1234",
  direccion: "Calle Principal 123, Zona 10",
  dpi: "1234567890123",
  observaciones: "Cliente preferencial desde 2020",
  contactoReferenciaNombre: "María López",
  contactoReferenciaTelefono: "5555-5678",
  coordenadas: ["14.634915", "-90.506882"],
  ip: "192.168.1.100",
  gateway: "192.168.1.1",
  mascara: "255.255.255.0",
  contrasenaWifi: "WiFi2023Segura",
  ssidRouter: "RED_CLIENTE_123",
  fechaInstalacion: "2023-05-15T14:30:00.000Z",
  departamento: mockDepartamentos[0], // Guatemala
  municipio: mockMunicipiosPorDepartamento[1][0], // Guatemala (municipio)
  servicios: [mockServicios[0], mockServicios[2]], // Instalación y Mantenimiento
  servicioWifi: mockServiciosInternet[2], // Plan Premium
  zonaFacturacion: mockZonasFacturacion[4], // Zona Central
  contrato: {
    idContrato: "CONTRATO-123",
    fechaFirma: "2023-05-10T10:00:00.000Z",
    archivoContrato: "contrato_123.pdf",
    observaciones: "Contrato firmado en oficina central",
  },
};

// Servicio mock para simular llamadas a la API
export const mockApiService = {
  // Obtener todos los departamentos
  getDepartamentos: async (): Promise<Departamentos[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockDepartamentos);
      }, 300);
    });
  },

  // Obtener municipios por departamento
  getMunicipiosByDepartamento: async (
    departamentoId: number
  ): Promise<Municipios[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockMunicipiosPorDepartamento[departamentoId] || []);
      }, 300);
    });
  },

  // Obtener todos los servicios
  getServicios: async (): Promise<Servicios[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockServicios);
      }, 300);
    });
  },

  // Obtener todos los servicios de internet
  getServiciosInternet: async (): Promise<ServiciosInternet[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockServiciosInternet);
      }, 300);
    });
  },

  // Obtener todas las zonas de facturación
  getZonasFacturacion: async (): Promise<FacturacionZona[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockZonasFacturacion);
      }, 300);
    });
  },

  // Obtener un cliente por ID
  getCustomerById: async (id: number | string): Promise<CustomerData> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id) {
          resolve(mockCustomerData);
        } else {
          reject(new Error("Cliente no encontrado"));
        }
      }, 500);
    });
  },

  //   // Actualizar un cliente
  //   updateCustomer: async (
  //     id: number | string,
  //     data: any
  //   ): Promise<{ success: boolean; message: string }> => {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         console.log("Cliente actualizado:", data);
  //         resolve({
  //           success: true,
  //           message: "Cliente actualizado correctamente",
  //         });
  //       }, 800);
  //     });
  //   },
};

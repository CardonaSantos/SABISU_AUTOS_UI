import type { Sector, Municipio, ClienteInternet } from "./types";

// Mock data for municipios
const mockMunicipios: Municipio[] = [
  { id: 1, nombre: "San Juan", provincia: "San Juan", codigo: "SJ" },
  { id: 2, nombre: "Rawson", provincia: "San Juan", codigo: "RW" },
  { id: 3, nombre: "Rivadavia", provincia: "San Juan", codigo: "RV" },
  { id: 4, nombre: "Chimbas", provincia: "San Juan", codigo: "CH" },
  { id: 5, nombre: "Santa Lucía", provincia: "San Juan", codigo: "SL" },
  { id: 6, nombre: "Pocito", provincia: "San Juan", codigo: "PC" },
];

// Mock data for clientes
const mockClientes: ClienteInternet[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    direccion: "Calle Principal 123",
    sectorId: 1,
  },
  {
    id: 2,
    nombre: "María González",
    direccion: "Av. Central 456",
    sectorId: 1,
  },
  {
    id: 3,
    nombre: "Carlos Rodríguez",
    direccion: "Calle Norte 789",
    sectorId: 2,
  },
  { id: 4, nombre: "Ana Martínez", direccion: "Av. Sur 321", sectorId: 2 },
  { id: 5, nombre: "Luis Sánchez", direccion: "Calle Este 654", sectorId: 3 },
  { id: 6, nombre: "Laura Fernández", direccion: "Av. Oeste 987", sectorId: 3 },
  { id: 7, nombre: "Roberto López", direccion: "Calle 1 234", sectorId: 4 },
  { id: 8, nombre: "Patricia Díaz", direccion: "Av. 2 567", sectorId: 4 },
];

// Mock data for sectores
let mockSectores: Sector[] = [
  {
    id: 1,
    nombre: "Sector Norte",
    descripcion: "Zona norte de la ciudad con alta densidad poblacional",
    municipioId: 1,
    clientes: mockClientes.filter((c) => c.sectorId === 1),
    creadoEn: new Date("2023-01-15T10:30:00"),
    actualizadoEn: new Date("2023-01-15T10:30:00"),
    municipio: {
      id: 1,
      nombre: "San Juan",
      provincia: "San Juan",
      codigo: "SJ",
    },
  },
  {
    id: 2,
    nombre: "Sector Sur",
    descripcion: "Zona sur de la ciudad, principalmente residencial",
    municipioId: 1,
    clientes: mockClientes.filter((c) => c.sectorId === 2),
    creadoEn: new Date("2023-02-20T14:45:00"),
    actualizadoEn: new Date("2023-03-10T09:15:00"),
    municipio: {
      id: 1,
      nombre: "San Juan",
      provincia: "San Juan",
      codigo: "SJ",
    },
  },
  {
    id: 3,
    nombre: "Zona Este",
    descripcion: "Área este con desarrollo comercial e industrial",
    municipioId: 2,
    clientes: mockClientes.filter((c) => c.sectorId === 3),
    creadoEn: new Date("2023-03-05T11:20:00"),
    actualizadoEn: new Date("2023-03-05T11:20:00"),
    municipio: {
      id: 2,
      nombre: "Rawson",
      provincia: "San Juan",
      codigo: "RW",
    },
  },
  {
    id: 4,
    nombre: "Zona Oeste",
    descripcion: "Sector occidental con nuevos desarrollos urbanos",
    municipioId: 3,
    clientes: mockClientes.filter((c) => c.sectorId === 4),
    creadoEn: new Date("2023-04-12T16:10:00"),
    actualizadoEn: new Date("2023-05-18T13:40:00"),
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions
export async function getSectors(): Promise<Sector[]> {
  await delay(800);
  return [...mockSectores];
}

export async function getMunicipios(): Promise<Municipio[]> {
  await delay(500);
  return [...mockMunicipios];
}

export async function createSector(
  sectorData: Omit<Sector, "id" | "creadoEn" | "actualizadoEn" | "clientes">
): Promise<Sector> {
  await delay(1000);

  const newSector: Sector = {
    id: mockSectores.length + 1,
    ...sectorData,
    clientes: [],
    creadoEn: new Date(),
    actualizadoEn: new Date(),
  };

  mockSectores = [...mockSectores, newSector];
  return newSector;
}

export async function getSectorById(id: number): Promise<Sector | undefined> {
  await delay(600);
  return mockSectores.find((sector) => sector.id === id);
}

export async function updateSector(
  id: number,
  sectorData: Partial<
    Omit<Sector, "id" | "creadoEn" | "actualizadoEn" | "clientes">
  >
): Promise<Sector | undefined> {
  await delay(1000);

  const index = mockSectores.findIndex((sector) => sector.id === id);
  if (index === -1) return undefined;

  const updatedSector = {
    ...mockSectores[index],
    ...sectorData,
    actualizadoEn: new Date(),
  };

  mockSectores = [
    ...mockSectores.slice(0, index),
    updatedSector,
    ...mockSectores.slice(index + 1),
  ];

  return updatedSector;
}

export async function deleteSector(id: number): Promise<boolean> {
  await delay(800);

  const index = mockSectores.findIndex((sector) => sector.id === id);
  if (index === -1) return false;

  mockSectores = [
    ...mockSectores.slice(0, index),
    ...mockSectores.slice(index + 1),
  ];

  return true;
}

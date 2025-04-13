import type { PlantillaMensaje } from "./types";

// Datos de ejemplo para plantillas
let mockPlantillas: PlantillaMensaje[] = [
  {
    id: 1,
    nombre: "Factura Mensual",
    tipo: "GENERACION_FACTURA",
    body: "Estimado {nombre_cliente}, le informamos que su factura del mes de {mes_factura} ya está disponible. El monto a pagar es de ${monto} con fecha de vencimiento {fecha_vencimiento}. Gracias por su preferencia.",
    empresaId: 1,
    creadoEn: new Date("2023-05-10T08:30:00"),
    actualizadoEn: new Date("2023-05-10T08:30:00"),
  },
  {
    id: 2,
    nombre: "Primer Recordatorio de Pago",
    tipo: "RECORDATORIO_1",
    body: "Estimado {nombre_cliente}, le recordamos que su factura por ${monto} vence el {fecha_vencimiento}. Por favor, realice su pago para evitar recargos. Si ya realizó el pago, ignore este mensaje.",
    empresaId: 1,
    creadoEn: new Date("2023-06-15T10:45:00"),
    actualizadoEn: new Date("2023-07-20T14:20:00"),
  },
  {
    id: 3,
    nombre: "Segundo Recordatorio de Pago",
    tipo: "RECORDATORIO_2",
    body: "IMPORTANTE: Estimado {nombre_cliente}, su factura por ${monto} está próxima a vencer. Para evitar la suspensión del servicio, por favor realice su pago antes del {fecha_vencimiento}. Si ya realizó el pago, ignore este mensaje.",
    empresaId: 1,
    creadoEn: new Date("2023-07-05T09:15:00"),
    actualizadoEn: new Date("2023-07-05T09:15:00"),
  },
  {
    id: 4,
    nombre: "Confirmación de Pago",
    tipo: "AVISO_PAGO",
    body: "Estimado {nombre_cliente}, confirmamos que hemos recibido su pago por ${monto} correspondiente a la factura del mes de {mes_factura}. Gracias por su puntualidad.",
    empresaId: 1,
    creadoEn: new Date("2023-08-12T16:30:00"),
    actualizadoEn: new Date("2023-08-12T16:30:00"),
  },
  {
    id: 5,
    nombre: "Aviso de Suspensión",
    tipo: "SUSPENSION",
    body: "AVISO IMPORTANTE: Estimado {nombre_cliente}, debido a la falta de pago de su factura por ${monto} vencida el {fecha_vencimiento}, su servicio será suspendido en las próximas 48 horas. Para evitar la suspensión, realice su pago inmediatamente.",
    empresaId: 1,
    creadoEn: new Date("2023-09-20T11:00:00"),
    actualizadoEn: new Date("2023-09-20T11:00:00"),
  },
];

// Simular retraso de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Funciones mock para operaciones CRUD
export async function getMockPlantillas(): Promise<PlantillaMensaje[]> {
  await delay(800);
  return [...mockPlantillas];
}

export async function createMockPlantilla(
  data: Omit<PlantillaMensaje, "id" | "creadoEn" | "actualizadoEn">
): Promise<PlantillaMensaje> {
  await delay(1000);

  const newPlantilla: PlantillaMensaje = {
    id:
      mockPlantillas.length > 0
        ? Math.max(...mockPlantillas.map((p) => p.id)) + 1
        : 1,
    ...data,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
  };

  mockPlantillas = [...mockPlantillas, newPlantilla];
  return newPlantilla;
}

export async function updateMockPlantilla(
  id: number,
  data: Partial<
    Omit<PlantillaMensaje, "id" | "creadoEn" | "actualizadoEn" | "empresaId">
  >
): Promise<PlantillaMensaje> {
  await delay(1000);

  const index = mockPlantillas.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error("Plantilla no encontrada");
  }

  const updatedPlantilla = {
    ...mockPlantillas[index],
    ...data,
    actualizadoEn: new Date(),
  };

  mockPlantillas = [
    ...mockPlantillas.slice(0, index),
    updatedPlantilla,
    ...mockPlantillas.slice(index + 1),
  ];

  return updatedPlantilla;
}

export async function deleteMockPlantilla(id: number): Promise<void> {
  await delay(800);

  const index = mockPlantillas.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error("Plantilla no encontrada");
  }

  mockPlantillas = [
    ...mockPlantillas.slice(0, index),
    ...mockPlantillas.slice(index + 1),
  ];
}

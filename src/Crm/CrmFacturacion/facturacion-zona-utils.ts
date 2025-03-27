import type {
  FacturacionZona,
  NuevaFacturacionZona,
} from "./FacturacionZonaTypes";

// Validate that days are in logical order
export const validateDays = (
  zona: NuevaFacturacionZona | FacturacionZona
): boolean => {
  // If there's no cut-off day, no problem
  if (!zona.diaCorte) return true;

  // Validate that generation day is before reminder day
  if (zona.diaGeneracionFactura >= zona.diaRecordatorio) return false;

  // Validate that reminder day is before payment day
  if (zona.diaRecordatorio >= zona.diaPago) return false;

  // Validate that payment day is before cut-off day
  if (zona.diaPago >= zona.diaCorte) return false;

  return true;
};

// Check if the form is valid
export const isFormValid = (nuevaZona: NuevaFacturacionZona): boolean => {
  return (
    nuevaZona.nombre.trim() !== "" &&
    nuevaZona.diaGeneracionFactura > 0 &&
    nuevaZona.diaGeneracionFactura <= 28 &&
    nuevaZona.diaPago > 0 &&
    nuevaZona.diaPago <= 28 &&
    nuevaZona.diaRecordatorio > 0 &&
    nuevaZona.diaRecordatorio <= 28 &&
    nuevaZona.diaSegundoRecordatorio > 0 &&
    nuevaZona.diaSegundoRecordatorio <= 28 &&
    (!nuevaZona.diaCorte ||
      (nuevaZona.diaCorte > 0 && nuevaZona.diaCorte <= 28)) &&
    (!nuevaZona.suspenderTrasFacturas || nuevaZona.suspenderTrasFacturas > 0) &&
    validateDays(nuevaZona)
  );
};

// Check if the edit form is valid
export const isEditFormValid = (
  editingZona: FacturacionZona | null
): boolean => {
  if (!editingZona) return false;

  return (
    editingZona.nombre.trim() !== "" &&
    editingZona.diaGeneracionFactura > 0 &&
    editingZona.diaGeneracionFactura <= 28 &&
    editingZona.diaPago > 0 &&
    editingZona.diaPago <= 28 &&
    editingZona.diaRecordatorio > 0 &&
    editingZona.diaRecordatorio <= 28 &&
    editingZona.diaSegundoRecordatorio > 0 &&
    editingZona.diaSegundoRecordatorio <= 28 &&
    (!editingZona.diaCorte ||
      (editingZona.diaCorte > 0 && editingZona.diaCorte <= 28)) &&
    (!editingZona.suspenderTrasFacturas ||
      editingZona.suspenderTrasFacturas > 0) &&
    validateDays(editingZona)
  );
};

// Convert notification methods from booleans to string format for API
export const notificationMethodsToString = (
  zona: NuevaFacturacionZona | FacturacionZona
): string => {
  const methods = [];
  if (zona.whatsapp) methods.push("WhatsApp");
  if (zona.email) methods.push("Email");
  if (zona.sms) methods.push("SMS");
  if (zona.llamada) methods.push("Llamada");
  if (zona.telegram) methods.push("Telegram");

  return methods.join(", ");
};

// Convert notification methods from string to boolean format
export const stringToNotificationMethods = (
  mediosString: string
): {
  whatsapp: boolean;
  email: boolean;
  sms: boolean;
  llamada: boolean;
  telegram: boolean;
} => {
  const medios = mediosString.split(", ");

  return {
    whatsapp: medios.includes("WhatsApp"),
    email: medios.includes("Email"),
    sms: medios.includes("SMS"),
    llamada: medios.includes("Llamada"),
    telegram: medios.includes("Telegram"),
  };
};

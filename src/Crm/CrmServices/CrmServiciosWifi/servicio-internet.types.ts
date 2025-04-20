/**
 * Tipos centralizados para el módulo de Servicios de Internet
 */

// Estado del servicio
export type EstadoServicio = "ACTIVO" | "INACTIVO";

// Interfaz para la relación entre cliente y servicio
export interface ClienteServicioInternet {
  id: number;
  clienteId: number;
  servicioInternetId: number;
  // Otros campos que pueda tener la relación
}

// Interfaz para un servicio de internet existente
export interface ServicioInternet {
  id: number;
  nombre: string;
  velocidad?: string | null;
  precio: number;
  estado: EstadoServicio;
  empresaId: number;
  creadoEn: string;
  actualizadoEn: string;
  clientes?: ClienteServicioInternet[];
  clientesCount?: number; // Campo calculado para mostrar la cantidad de clientes
}

// Interfaz para crear un nuevo servicio de internet
export interface NuevoServicioInternet {
  nombre: string;
  velocidad?: string | null;
  precio: number;
  estado: EstadoServicio;
  empresaId: number;
}

// Interfaz para las props del formulario de servicio
export interface ServicioFormProps {
  initialData: ServicioInternet | NuevoServicioInternet;
  onSubmit: (data: ServicioInternet | NuevoServicioInternet) => Promise<void>;
  isLoading: boolean;
  isEditing: boolean;
  empresaId: number;
}

// Interfaz para las props del diálogo de creación
export interface CreateServicioDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: NuevoServicioInternet;
  onSubmit: (data: NuevoServicioInternet) => Promise<void>;
  isLoading: boolean;
  empresaId: number;
}

// Interfaz para las props del diálogo de edición
export interface EditServicioDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  servicio: ServicioInternet | null;
  onSave: (updatedServicio: ServicioInternet) => Promise<void>;
  isLoading: boolean;
}

// Interfaz para las props del diálogo de eliminación
export interface DeleteServicioDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => Promise<void>;
  isLoading: boolean;
}

// Interfaz para las props de la tabla de servicios
export interface ServicioTableProps {
  servicios: ServicioInternet[];
  formatearMoneda: (monto: number) => string;
  onEditClick: (servicio: ServicioInternet) => void;
  onDeleteClick: (id: number) => void;
}

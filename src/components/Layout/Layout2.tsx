import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
//================================================================>
import { useState, useEffect } from "react";
import { X, Bell, User, MailIcon, LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link, Outlet } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";
import nv2 from "@/assets/LOGOPNG.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { UserToken } from "@/Types/UserToken/UserToken";
import { jwtDecode } from "jwt-decode";
import { useStore } from "../Context/ContextSucursal";
import axios from "axios";
import { Sucursal } from "@/Types/Sucursal/Sucursal_Info";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { useSocket } from "../Context/SocketContext";

const API_URL = import.meta.env.VITE_API_URL;

interface LayoutProps {
  children?: React.ReactNode;
}

enum TipoNotificacion {
  SOLICITUD_PRECIO = "SOLICITUD_PRECIO",
  TRANSFERENCIA = "TRANSFERENCIA",
  VENCIMIENTO = "VENCIMIENTO",
  OTRO = "OTRO",
}

interface Notificacion {
  id: number;
  mensaje: string;
  remitenteId: number;
  tipoNotificacion: TipoNotificacion;
  referenciaId: number | null;
  fechaCreacion: string;
}

export default function Layout2({ children }: LayoutProps) {
  const [tokenUser, setTokenUser] = useState<UserToken | null>(null);
  const setUserNombre = useStore((state) => state.setUserNombre);
  const setUserCorreo = useStore((state) => state.setUserCorreo);
  const setUserId = useStore((state) => state.setUserId);

  const setActivo = useStore((state) => state.setActivo);
  const setRol = useStore((state) => state.setRol);
  const setSucursalId = useStore((state) => state.setSucursalId);
  const sucursalId = useStore((state) => state.sucursalId);
  const socket = useSocket();

  const userID = useStore((state) => state.userId);

  // const menuItems = [
  //   { icon: Home, label: "Home", href: "/" },
  //   { icon: ShoppingCart, label: "Punto venta", href: "/punto-venta" },
  //   { icon: Package, label: "Inventario", href: "/inventario" },

  //   { icon: Box, label: "Añadir Stock", href: "/adicion-stock" },
  //   { icon: Clock, label: "Historial de Ventas", href: "/historial/ventas" },
  //   { icon: Layers, label: "Categorias", href: "/categorias" },

  //   { icon: CircleUser, label: "Proveedores", href: "/agregar-proveedor" },
  //   { icon: Building, label: "Sucursales", href: "/sucursal" },
  //   { icon: Building, label: "Añadir Sucursal", href: "/add-sucursal" },

  //   {
  //     icon: SendToBackIcon,
  //     label: "Transferir Productos",
  //     href: "/transferencia",
  //   },

  //   {
  //     icon: NotepadText,
  //     label: "Transferencia Historial",
  //     href: "/transferencia-historial",
  //   },

  //   {
  //     icon: NotepadText,
  //     label: "Historial Cambios Precio",
  //     href: "/historial-cambios-precio",
  //   },

  //   {
  //     icon: FileStack,
  //     label: "Stock Eliminaciones",
  //     href: "/stock-eliminaciones",
  //   },

  //   { icon: Users, label: "Clientes", href: "/clientes-manage" },
  //   { icon: BarChart2, label: "Reportes", href: "/reportes" },
  //   { icon: NotebookIcon, label: "Entregas Stock", href: "/entregas-stock" },
  //   { icon: RotateCw, label: "Devoluciones", href: "/devoluciones" },
  //   { icon: AlertCircle, label: "Vencimientos", href: "/vencimientos" },
  //   { icon: Bell, label: "Notificaciones", href: "/notificaciones" },
  // ];

  useEffect(() => {
    const storedToken = localStorage.getItem("authTokenPos");
    if (storedToken) {
      try {
        const decodedToken = jwtDecode<UserToken>(storedToken);
        setTokenUser(decodedToken);
        setUserNombre(decodedToken.nombre);
        setUserCorreo(decodedToken.correo);
        setActivo(decodedToken.activo);
        setRol(decodedToken.rol);
        setUserId(decodedToken.sub);
        setSucursalId(decodedToken.sucursalId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  function handleDeletToken() {
    localStorage.removeItem("authTokenPos");
    window.location.reload();
  }

  const [sucursalInfo, setSucursalInfo] = useState<Sucursal>();

  useEffect(() => {
    const getInfoSucursal = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/sucursales/get-info-sucursal/${sucursalId}`
        );
        if (response.status === 200) {
          setSucursalInfo(response.data);
        }
      } catch (error) {
        console.error("Error fetching sucursal info:", error);
      }
    };

    // Solo hace la petición si sucursalId es válido
    if (sucursalId) {
      getInfoSucursal();
    }
  }, [sucursalId]); // Ahora depende de sucursalId

  console.log("La info de la sucursal actual es: ", sucursalInfo);

  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  const getNotificaciones = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/notification/get-my-notifications/${userID}`
      );
      if (response.status === 200) {
        setNotificaciones(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir notificaciones");
    }
  };

  useEffect(() => {
    if (userID) {
      getNotificaciones();
    }
  }, [userID]);
  // authTokenPos

  console.log("Mis notificaciones diponibles son: ", notificaciones);

  const deleteNoti = async (id: number) => {
    try {
      const response = await axios.delete(
        `${API_URL}/notification/delete-my-notification/${id}/${userID}`
      );
      if (response.status === 200) {
        toast.success("Notificación eliminada");
        getNotificaciones(); // Actualiza las notificaciones después de eliminar
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al eliminar notificación");
    }
  };

  // Escuchar el evento de nueva notificación entrante
  useEffect(() => {
    if (socket) {
      console.log("Escuchando evento para notificaciones");

      socket.on("recibirNotificacion", (nuevaNotificacion: Notificacion) => {
        setNotificaciones((prevNotificaciones) => [
          nuevaNotificacion,
          ...prevNotificaciones,
        ]);
      });

      // Limpieza del evento al desmontar el componente o desconectarse el socket
      return () => {
        socket.off("recibirNotificacion");
      };
    }
  }, [socket]);

  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
        <AppSidebar />

        {/* Contenedor principal para el toolbar y el contenido */}
        <div className="flex flex-col w-full">
          {/* Toolbar */}
          <div className="sticky top-0 z-10 h-16 w-full bg-background border-b border-border shadow-sm flex items-center justify-between">
            <div className="mx-auto flex h-16 max-w-7xl w-full items-center px-4 sm:px-6 lg:px-8 justify-between">
              {/* Sección izquierda: Logo y nombre de la sucursal */}
              <div className="flex items-center space-x-2">
                <Link to={"/"}>
                  <img className="h-16 w-28" src={nv2} alt="Logo" />
                </Link>
                <Link to={"/"}>
                  <h2 className="text-lg font-semibold text-foreground">
                    {sucursalInfo?.nombre}
                  </h2>
                </Link>
              </div>

              {/* Sección derecha: Toggle de modo, notificaciones y menú de usuario */}
              <div className="flex items-center space-x-4">
                <div className="flex justify-center items-center p-4">
                  <ModeToggle />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative">
                      <Button variant="outline" size="icon" className="mr-4">
                        <Bell className="h-6 w-6" />
                      </Button>
                      {notificaciones.length > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-6 h-6 text-xs font-bold leading-none text-primary-foreground bg-rose-500 rounded-full">
                          {notificaciones.length}
                        </span>
                      )}
                    </div>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-center text-2xl font-bold">
                        Notificaciones
                      </DialogTitle>
                    </DialogHeader>
                    <div className="py-4 overflow-y-auto max-h-96">
                      {notificaciones && notificaciones.length > 0 ? (
                        notificaciones.map((not) => (
                          <Card className="m-2 p-4 shadow-md" key={not.id}>
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p
                                  style={{ fontSize: "9px" }}
                                  className={`font-semibold ${
                                    not.tipoNotificacion ===
                                    TipoNotificacion.SOLICITUD_PRECIO
                                      ? "text-green-600 dark:text-green-400"
                                      : not.tipoNotificacion ===
                                        TipoNotificacion.TRANSFERENCIA
                                      ? "text-blue-600 dark:text-blue-400"
                                      : not.tipoNotificacion ===
                                        TipoNotificacion.VENCIMIENTO
                                      ? "text-red-600 dark:text-red-400"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {TipoNotificacion[not.tipoNotificacion]}
                                </p>
                                <p className="text-sm mt-1 break-words text-foreground">
                                  {not.mensaje}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(not.fechaCreacion).toLocaleString()}
                                </p>
                              </div>
                              <Button
                                style={{ width: "25px", height: "25px" }}
                                size={"icon"}
                                type="button"
                                variant={"destructive"}
                                title="Eliminar Notificación"
                                className="rounded-full p-2 ml-2 flex-shrink-0"
                                onClick={() => deleteNoti(not.id)} // Pasa el id directamente
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </Card>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground">
                          No hay notificaciones.
                        </p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <User className="h-5 w-5" />
                        <span className="sr-only">User menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>{tokenUser?.nombre}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MailIcon className="mr-2 h-4 w-4" />
                        <span>{tokenUser?.correo}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDeletToken}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar Sesión</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <main className="flex-1 overflow-y-auto p-1 lg:p-8">
            <SidebarTrigger />
            {children || <Outlet />}
          </main>

          {/* Footer */}
          <footer className="bg-background py-4 text-center text-sm text-muted-foreground border-t border-border">
            <p>&copy; 2024 Novas Sistemas. Todos los derechos reservados</p>
          </footer>
        </div>
      </SidebarProvider>
    </div>
  );
}

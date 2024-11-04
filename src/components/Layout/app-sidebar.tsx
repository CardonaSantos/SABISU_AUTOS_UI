import { Home, Ticket } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Bell,
  ShoppingCart,
  Package,
  Users,
  BarChart2,
  Box,
  RotateCw,
  AlertCircle,
  Layers,
  Clock,
  Building,
  CircleUser,
  NotebookIcon,
  SendToBackIcon,
  NotepadText,
  FileStack,
} from "lucide-react";
import { useStore } from "../Context/ContextSucursal";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const menuItems = [
  // Sección de Ventas
  { icon: Home, label: "Home", href: "/" },
  { icon: ShoppingCart, label: "Punto de Venta", href: "/punto-venta" },
  { icon: Clock, label: "Historial de Ventas", href: "/historial/ventas" },

  // Sección de Inventario y Stock
  { icon: Package, label: "Inventario", href: "/inventario" },
  { icon: Box, label: "Añadir Stock", href: "/adicion-stock" },
  {
    icon: NotepadText,
    label: "Historial Cambios Precio",
    href: "/historial-cambios-precio",
  },
  {
    icon: FileStack,
    label: "Stock Eliminaciones",
    href: "/stock-eliminaciones",
  },
  { icon: NotebookIcon, label: "Entregas Stock", href: "/entregas-stock" },
  { icon: RotateCw, label: "Devoluciones", href: "/devoluciones" },
  { icon: AlertCircle, label: "Vencimientos", href: "/vencimientos" },

  // Sección de Transferencias
  {
    icon: SendToBackIcon,
    label: "Transferir Productos",
    href: "/transferencia",
  },
  {
    icon: NotepadText,
    label: "Transferencia Historial",
    href: "/transferencia-historial",
  },

  // Sección de Categorías y Gestión
  { icon: Layers, label: "Categorías", href: "/categorias" },

  // Sección de Clientes y Proveedores
  { icon: Users, label: "Clientes", href: "/clientes-manage" },
  { icon: CircleUser, label: "Proveedores", href: "/agregar-proveedor" },

  // Sección de Sucursales
  { icon: Building, label: "Sucursales", href: "/sucursal" },
  { icon: Building, label: "Añadir Sucursal", href: "/add-sucursal" },

  // Reportes y Notificaciones
  { icon: BarChart2, label: "Reportes", href: "/reportes" },
  { icon: Bell, label: "Notificaciones", href: "/notificaciones" },

  { icon: Ticket, label: "Ticket Manage", href: "/ticket/manage" },
];

const menuVendedor = [
  // Sección de Ventas
  { icon: Home, label: "Home", href: "/" },
  { icon: ShoppingCart, label: "Punto de Venta", href: "/punto-venta" },
  { icon: Clock, label: "Historial de Ventas", href: "/historial/ventas" },

  // Sección de Inventario y Stock
  { icon: Package, label: "Inventario", href: "/inventario" },
  // { icon: Box, label: "Añadir Stock", href: "/adicion-stock" },
  {
    icon: NotepadText,
    label: "Historial Cambios Precio",
    href: "/historial-cambios-precio",
  },
  {
    icon: FileStack,
    label: "Stock Eliminaciones",
    href: "/stock-eliminaciones",
  },
  // { icon: NotebookIcon, label: "Entregas Stock", href: "/entregas-stock" },
  { icon: RotateCw, label: "Devoluciones", href: "/devoluciones" },
  { icon: AlertCircle, label: "Vencimientos", href: "/vencimientos" },

  // Sección de Transferencias
  // {
  //   icon: SendToBackIcon,
  //   label: "Transferir Productos",
  //   href: "/transferencia",
  // },
  // {
  //   icon: NotepadText,
  //   label: "Transferencia Historial",
  //   href: "/transferencia-historial",
  // },

  // Sección de Categorías y Gestión
  // { icon: Layers, label: "Categorías", href: "/categorias" },

  // Sección de Clientes y Proveedores
  { icon: Users, label: "Clientes", href: "/clientes-manage" },
  // { icon: CircleUser, label: "Proveedores", href: "/agregar-proveedor" },

  // Sección de Sucursales
  // { icon: Building, label: "Sucursales", href: "/sucursal" },
  // { icon: Building, label: "Añadir Sucursal", href: "/add-sucursal" },

  // Reportes y Notificaciones
  { icon: BarChart2, label: "Reportes", href: "/reportes" },
  { icon: Bell, label: "Notificaciones", href: "/notificaciones" },
];

export function AppSidebar() {
  const rolUser = useStore((state) => state.userRol);

  function retornarRutas() {
    if (rolUser === "ADMIN") {
      return menuItems;
    } else {
      return menuVendedor;
    }
  }

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent className="">
        <div className="overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupLabel>Secciones</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {retornarRutas().map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <Link to={item.href} className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <item.icon className="h-4 w-4 shrink-0" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{item.label}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        {/* Condición para mostrar el texto solo si no está en modo de solo iconos */}
                        {/* {sidebarVariant !== "icon" && <span>{item.label}</span>} */}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

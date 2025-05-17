import {
  Home,
  ShieldCheck,
  Ticket,
  Wallet,
  ClipboardList,
  NotebookText,
  CoinsIcon,
  Bolt,
  ClipboardPen,
  FileText,
  CreditCard,
  WrenchIcon,
  ChevronDown,
  PackageOpen,
  Tag,
  Building2,
  FileSpreadsheet,
  Target,
  Goal,
  UserPlus,
  Waypoints,
  Cpu,
  Wifi,
  Tags,
  MonitorSmartphone,
  MapIcon,
  MapPinned,
  MapPin,
  MessagesSquare,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  ShoppingCart,
  Package,
  Users,
  Box,
  AlertCircle,
  Clock,
  Building,
  CircleUser,
  NotebookIcon,
  SendToBackIcon,
  NotepadText,
  FileStack,
} from "lucide-react";
import { useStore } from "../Context/ContextSucursal";
import { Link, useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useMemo } from "react";

const menuVendedor = [
  // Sección de Ventas
  { icon: Home, label: "Home", href: "/" },
  { icon: ShoppingCart, label: "Punto de Venta", href: "/punto-venta" },
  { icon: Clock, label: "Historial de Ventas", href: "/historial/ventas" },

  // Sección de Inventario y Stock
  {
    icon: Package,
    label: "Inventario y Stock",
    submenu: [
      { icon: Package, label: "Inventario", href: "/inventario" },
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
      {
        icon: ClipboardPen,
        label: "Ventas Eliminaciones",
        href: "/historial/ventas-eliminaciones",
      },
    ],
  },

  // Sección de Clientes
  { icon: Users, label: "Clientes", href: "/clientes-manage" },

  // Vencimientos
  { icon: AlertCircle, label: "Vencimientos", href: "/vencimientos" },
  { icon: ShieldCheck, label: "Garantía Manage", href: "/garantia/manage" },
  { icon: CreditCard, label: "Créditos", href: "/creditos" },
  { icon: WrenchIcon, label: "Reparaciones", href: "/reparaciones" },
];

const menuItemsAdmin = [
  // Sección de Ventas
  { icon: Home, label: "Home", href: "/" },
  { icon: ShoppingCart, label: "Punto de Venta", href: "/punto-venta" },
  { icon: Clock, label: "Historial de Ventas", href: "/historial/ventas" },

  // Sección de Inventario y Stock con submenú
  {
    icon: Package,
    label: "Inventario y Stock",
    submenu: [
      { icon: PackageOpen, label: "Inventario", href: "/inventario" },

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
    ],
  },

  { icon: Tag, label: "Categorías", href: "/categorias" },

  // Vencimientos
  { icon: AlertCircle, label: "Vencimientos", href: "/vencimientos" },

  // Sección de Transferencias
  {
    icon: SendToBackIcon,
    label: "Transferencias",
    submenu: [
      {
        icon: NotepadText,
        label: "Transferir Productos",
        href: "/transferencia",
      },
      {
        icon: NotepadText,
        label: "Transferencia Historial",
        href: "/transferencia-historial",
      },
    ],
  },

  // Sección de Clientes y Proveedores con submenú
  {
    icon: Users,
    label: "Clientes y Proveedores",
    submenu: [
      { icon: Users, label: "Clientes", href: "/clientes-manage" },
      { icon: CircleUser, label: "Proveedores", href: "/agregar-proveedor" },
    ],
  },

  // Sección de Sucursales
  {
    icon: Building,
    label: "Sucursales",
    submenu: [{ icon: Building, label: "Mis Sucursales", href: "/sucursal" }],
  },
  // Gestión de Garantías y Tickets
  {
    icon: ShieldCheck,
    label: "Garantía y Ticket",
    submenu: [
      { icon: ShieldCheck, label: "Garantía Manage", href: "/garantia/manage" },
      { icon: Ticket, label: "Ticket Manage", href: "/ticket/manage" },
    ],
  },

  // Gestión de Caja
  {
    icon: Wallet,
    label: "Caja",
    submenu: [
      {
        icon: Wallet,
        label: "Depósitos y Egresos",
        href: "/depositos-egresos/",
      },
      { icon: ClipboardList, label: "Registrar Caja", href: "/registro-caja/" },
      {
        icon: NotebookText,
        label: "Registros de Caja",
        href: "/registros-caja/",
      },
      {
        icon: CoinsIcon,
        label: "Saldo y Egresos",
        href: "/historial/depositos-egresos",
      },
    ],
  },

  // Configuración
  // Ventas Eliminaciones y Plantillas de Créditos
  {
    icon: ClipboardPen,
    label: "Gestión de Ventas",
    submenu: [
      {
        icon: ClipboardPen,
        label: "Ventas Eliminaciones",
        href: "/historial/ventas-eliminaciones",
      },
      {
        icon: FileText,
        label: "Plantillas de Créditos",
        href: "/plantillas-venta-cuotas",
      },
    ],
  },

  // Créditos
  { icon: CreditCard, label: "Créditos", href: "/creditos" },
  { icon: WrenchIcon, label: "Reparaciones", href: "/reparaciones" },

  { icon: Target, label: "Metas", href: "/metas" },
  { icon: Goal, label: "Mis Metas", href: "/mis-metas" },

  { icon: Building2, label: "Resumen sucursales", href: "/sumary" },

  { icon: FileSpreadsheet, label: "Reportes", href: "/reportes" },

  { icon: Bolt, label: "Config", href: "/config/user" },
];
//RUTAS CRM
const routesCrm_Admin = [
  { icon: Home, label: "Inicio", href: "/crm" },

  {
    icon: Users,
    label: "Clientes",
    submenu: [
      {
        icon: Users,
        label: "Listado de Clientes",
        href: "/crm-clientes",
      },
      {
        icon: UserPlus,
        label: "Nuevo Cliente",
        href: "/crm/crear-cliente-crm",
      },
    ],
  },

  { icon: CreditCard, label: "Facturación", href: "/crm/facturacion" },

  {
    icon: MonitorSmartphone,
    label: "Soporte",
    submenu: [
      { icon: Ticket, label: "Tickets de Soporte", href: "/crm/tickets" },
      {
        icon: Tags,
        label: "Categorías de Soporte",
        href: "/crm/tags",
      },
    ],
  },
  // SERVICIOS Y GESTIÓN DE SERVICIOS
  {
    icon: Waypoints,
    label: "Servicios",
    submenu: [
      {
        icon: Cpu,
        label: "Gestión de Servicios",
        href: "/crm-servicios",
      },
      {
        icon: Wifi,
        label: "Servicios de Internet",
        href: "/crm-servicios-internet",
      },
    ],
  },

  {
    icon: MapPinned,
    label: "Facturación por Zona",
    href: "/crm-facturacion-zona",
  },
  {
    icon: MapPin,
    label: "Sectores",
    href: "/crm-sectores",
  },

  {
    icon: MessagesSquare,
    label: "Mensajes Automaticos",
    href: "/crm-mensajes-automaticos",
  },

  {
    icon: FileText,
    label: "Plantillas contratos",
    href: "/contrato-plantilla",
  },

  {
    icon: MapIcon,
    label: "Rutas Cobro",
    submenu: [
      {
        icon: MapPin,
        label: "Rutas Manage",
        href: "/crm/ruta",
      },
    ],
  },
  { icon: Building, label: "Empresa", href: "/crm/empresa" },

  { icon: User, label: "Perfil", href: "/crm/perfil" },

  { icon: Users, label: "Usuarios", href: "/crm/usuarios" },
];
//rutas para otro rol del
const routesCrm_Otro = [
  { icon: Home, label: "Inicio", href: "/crm" },

  {
    icon: Users,
    label: "Clientes",
    submenu: [
      {
        icon: Users,
        label: "Listado de Clientes",
        href: "/crm-clientes",
      },
      {
        icon: UserPlus,
        label: "Nuevo Cliente",
        href: "/crm/crear-cliente-crm",
      },
    ],
  },

  { icon: CreditCard, label: "Facturación", href: "/crm/facturacion" },

  {
    icon: MonitorSmartphone,
    label: "Soporte",
    submenu: [
      { icon: Ticket, label: "Tickets de Soporte", href: "/crm/tickets" },
      {
        icon: Tags,
        label: "Categorías de Soporte",
        href: "/crm/tags",
      },
    ],
  },

  // SERVICIOS Y GESTIÓN DE SERVICIOS
  {
    icon: Waypoints,
    label: "Servicios",
    submenu: [
      {
        icon: Cpu,
        label: "Gestión de Servicios",
        href: "/crm-servicios",
      },
      {
        icon: Wifi,
        label: "Servicios de Internet",
        href: "/crm-servicios-internet",
      },
    ],
  },

  {
    icon: MapPinned,
    label: "Facturación por Zona",
    href: "/crm-facturacion-zona",
  },
  {
    icon: MapPin,
    label: "Sectores",
    href: "/crm-sectores",
  },

  {
    icon: MapIcon,
    label: "Rutas Cobro",
    submenu: [
      {
        icon: MapPin,
        label: "Rutas Manage",
        href: "/crm/ruta",
      },
    ],
  },
  { icon: Building, label: "Empresa", href: "/crm/empresa" },
  { icon: User, label: "Perfil", href: "/crm/perfil" },
];

export function AppSidebar() {
  const location = useLocation();
  const rolUser = useStore((state) => state.userRol);

  // Memoriza las rutas según el rol del usuario
  const allRoutes = useMemo(() => {
    if (rolUser === "ADMIN") return menuItemsAdmin;
    if (rolUser === "SUPER_ADMIN") return menuItemsAdmin;
    return menuVendedor;
  }, [rolUser]);

  // Memoriza las rutas CRM según el rol del usuario
  const crmRoutes = useMemo(() => {
    return rolUser === "ADMIN" ? routesCrm_Admin : routesCrm_Otro;
  }, [rolUser]);

  // Extrae los href de todas las rutas CRM (para ocultarlas cuando se esté en CRM)
  const hidenRoutes = useMemo(
    () =>
      routesCrm_Admin.flatMap((ruta) =>
        ruta.href ? [ruta.href] : ruta.submenu?.map((sub) => sub.href) || []
      ),
    []
  );

  // Si la ruta actual es una de las rutas CRM, mostramos solo CRM
  const displayedRoutes = useMemo(() => {
    if (
      hidenRoutes.some((ruta) => ruta && location.pathname.startsWith(ruta))
    ) {
      return crmRoutes;
    }
    return allRoutes;
  }, [location.pathname, allRoutes, crmRoutes, hidenRoutes]);

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <div className="overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupLabel>Secciones</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {displayedRoutes.map((item) => {
                  // Si el item tiene submenú, lo mostramos como un SidebarMenuSub dentro de un Collapsible
                  if (item.submenu) {
                    return (
                      <SidebarMenuItem key={item.label}>
                        <Collapsible defaultOpen className="group/collapsible">
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton>
                              <item.icon className="h-4 w-4 shrink-0" />
                              <span>{item.label}</span>
                              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.submenu.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.label}>
                                  <SidebarMenuSubButton className="py-5">
                                    <Link
                                      to={subItem.href}
                                      className="flex items-center gap-2"
                                    >
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <subItem.icon className="h-4 w-4 shrink-0" />
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>{subItem.label}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      <span>{subItem.label}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuItem>
                    );
                  } else {
                    return (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild>
                          <Link
                            to={item.href}
                            className="flex items-center gap-2"
                          >
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
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  }
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

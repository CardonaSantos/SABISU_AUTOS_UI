import {
  Home,
  ShieldCheck,
  Ticket,
  Wallet,
  ClipboardList,
  Bolt,
  ClipboardPen,
  FileText,
  CreditCard,
  WrenchIcon,
  ChevronDown,
  Building2,
  FileSpreadsheet,
  Target,
  Goal,
  ChartPie,
  Repeat1,
  PackageSearch,
  Blocks,
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
import { Link } from "react-router-dom";
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
      {
        icon: Blocks,
        label: "Inventario y Stock",
        href: "/inventario-stock",
      },

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

      {
        icon: PackageSearch,
        label: "Movimientos de Stock",
        href: "/movimientos-stock",
      },
    ],
  },

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
      { icon: ClipboardList, label: "Registrar Caja", href: "/registro-caja/" },
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
  { icon: ChartPie, label: "Resumen Ventas", href: "/resumen-ventas" },
  { icon: Repeat1, label: "Requisiciones", href: "/requisiciones" },

  { icon: FileSpreadsheet, label: "Reportes", href: "/reportes" },

  { icon: Bolt, label: "Config", href: "/config/user" },
];

export function AppSidebar() {
  const rolUser = useStore((state) => state.userRol);

  const allRoutes = useMemo(() => {
    if (rolUser === "ADMIN" || rolUser === "SUPER_ADMIN") return menuItemsAdmin;
    return menuVendedor;
  }, [rolUser]);

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <div className="overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupLabel>Secciones</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {allRoutes.map((item) => {
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

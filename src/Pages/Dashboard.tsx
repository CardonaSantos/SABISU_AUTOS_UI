import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  AlertCircle,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  UserPlus,
} from "lucide-react";

export default function Dashboard() {
  // Datos de ejemplo para los gráficos y tablas
  const salesData = [
    { name: "Lun", ventas: 4000 },
    { name: "Mar", ventas: 3000 },
    { name: "Mié", ventas: 2000 },
    { name: "Jue", ventas: 2780 },
    { name: "Vie", ventas: 1890 },
    { name: "Sáb", ventas: 2390 },
    { name: "Dom", ventas: 3490 },
  ];

  const topProducts = [
    { name: "Producto A", ventas: 120 },
    { name: "Producto B", ventas: 80 },
    { name: "Producto C", ventas: 70 },
    { name: "Producto D", ventas: 50 },
    { name: "Producto E", ventas: 30 },
  ];

  const lowStockProducts = [
    { name: "Producto X", stock: 5 },
    { name: "Producto Y", stock: 3 },
    { name: "Producto Z", stock: 2 },
  ];

  const recentTransactions = [
    { id: "001", product: "Producto A", amount: 50, date: "2023-06-15" },
    { id: "002", product: "Producto B", amount: 30, date: "2023-06-15" },
    { id: "003", product: "Producto C", amount: 70, date: "2023-06-14" },
  ];

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard de Administrador</h1>

      {/* Resumen de ventas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ventas del mes{" "}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Q15,231</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos de la semana
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Q2,231</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos del dia{" "}
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Q350</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de ventas */}
      <Card>
        <CardHeader>
          <CardTitle>Ventas de la Semana</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ventas" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Productos e inventario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Ventas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.ventas}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inventario Bajo</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Actividades recientes y Calendario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Transacciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.product}</TableCell>
                    <TableCell>Q{transaction.amount}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button>
            <ShoppingCart className="mr-2 h-4 w-4" /> Nueva Venta
          </Button>
          <Button variant="outline">
            <Package className="mr-2 h-4 w-4" /> Agregar Producto
          </Button>
          <Button variant="outline">
            <AlertCircle className="mr-2 h-4 w-4" /> Reportar Problema
          </Button>
        </CardContent>
      </Card>

      {/* Notificaciones y alertas */}
      <Card>
        <CardHeader>
          <CardTitle>Notificaciones y Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center text-yellow-600">
              <AlertCircle className="mr-2 h-4 w-4" />
              Inventario bajo para Producto X
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Configuraciones y gestión de la tienda */}
      <Card>
        <CardHeader>
          <CardTitle>Configuraciones y Gestión</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button variant="outline">Gestión de Empleados</Button>
          <Button variant="outline">Configuración de Productos</Button>
        </CardContent>
      </Card>
    </div>
  );
}

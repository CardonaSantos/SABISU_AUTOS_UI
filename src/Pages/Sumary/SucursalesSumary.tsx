import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Phone,
  MapPin,
  DollarSign,
  TrendingUp,
  Calendar,
  BarChart3,
} from "lucide-react";
import currency from "currency.js";

const formatearMoneda = (monto: number) => {
  return currency(monto, {
    symbol: "Q",
    separator: ",",
    decimal: ".",
    precision: 2,
  }).format();
};

const API_URL = import.meta.env.VITE_API_URL;

interface SucursalSaldo {
  id: number;
  saldoAcumulado: number;
  totalIngresos: number;
  totalEgresos: number;
  actualizadoEn: string;
}

interface VentasDiaData {
  totalDeHoy: number;
}

interface Sucursal {
  id: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  SucursalSaldo?: SucursalSaldo;
  ventasMes?: number;
  ventasSemana?: number;
  ventasDia?: VentasDiaData;
}

function SucursalesSummary() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSucursalesSummary = async () => {
      try {
        setIsLoading(true);
        const resp = await axios.get<Sucursal[]>(
          `${API_URL}/analytics/sucursales-summary`
        );
        const sucursalesData = resp.data;

        const enhancedData = await Promise.all(
          sucursalesData.map(async (suc) => {
            const [ventasMesResp, ventasSemanaResp, ventasDiaResp] =
              await Promise.all([
                axios.get(`${API_URL}/analytics/get-ventas/mes/${suc.id}`),
                axios.get(`${API_URL}/analytics/get-ventas/semana/${suc.id}`),
                axios.get<VentasDiaData>(
                  `${API_URL}/analytics/venta-dia/${suc.id}`
                ),
              ]);

            return {
              ...suc,
              ventasMes: ventasMesResp.data,
              ventasSemana: ventasSemanaResp.data,
              ventasDia: ventasDiaResp.data,
            };
          })
        );

        setSucursales(enhancedData);
      } catch (error) {
        console.error("Error fetching sucursales summary + ventas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSucursalesSummary();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Resumen de Mis Sucursales</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sucursales.map((suc) => (
          <Card key={suc.id} className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="mr-2" />
                {suc.nombre || "Sucursal Sin Nombre"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="mr-2 text-gray-500" />
                  <span>{suc.direccion || "Dirección no disponible"}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 text-gray-500" />
                  <span>{suc.telefono || "Teléfono no disponible"}</span>
                </div>

                <Tabs defaultValue="ingresos" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
                    <TabsTrigger value="saldo">Saldo</TabsTrigger>
                  </TabsList>
                  <TabsContent value="saldo">
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center">
                          <DollarSign className="mr-2 text-green-500" />
                          Saldo Acumulado
                        </span>
                        <span className="font-semibold">
                          {suc.SucursalSaldo?.saldoAcumulado
                            ? formatearMoneda(suc.SucursalSaldo.saldoAcumulado)
                            : "Q0"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center">
                          <TrendingUp className="mr-2 text-blue-500" />
                          Total Ingresos
                        </span>
                        <span className="font-semibold">
                          {suc.SucursalSaldo?.totalIngresos
                            ? formatearMoneda(suc.SucursalSaldo.totalIngresos)
                            : "Q0"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center">
                          <TrendingUp className="mr-2 text-red-500" />
                          Total Egresos
                        </span>
                        <span className="font-semibold">
                          {suc.SucursalSaldo?.totalEgresos
                            ? formatearMoneda(suc.SucursalSaldo.totalEgresos)
                            : "Q0"}
                        </span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="ingresos">
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center">
                          <Calendar className="mr-2 text-purple-500" />
                          Ventas del Mes
                        </span>
                        <span className="font-semibold">
                          {suc.ventasMes
                            ? formatearMoneda(suc.ventasMes)
                            : "Q0"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center">
                          <BarChart3 className="mr-2 text-indigo-500" />
                          Ventas de la Semana
                        </span>
                        <span className="font-semibold">
                          {suc.ventasSemana
                            ? formatearMoneda(suc.ventasSemana)
                            : "Q0"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center">
                          <DollarSign className="mr-2 text-green-500" />
                          Ventas del Día
                        </span>
                        <span className="font-semibold">
                          {suc.ventasDia?.totalDeHoy
                            ? formatearMoneda(suc.ventasDia.totalDeHoy)
                            : "Q0"}
                        </span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default SucursalesSummary;

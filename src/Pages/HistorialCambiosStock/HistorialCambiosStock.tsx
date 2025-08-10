import DesvanecerHaciaArriba from "@/Crm/Motion/DashboardAnimations";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  ArrowUpCircle,
  Ban,
  ClipboardList,
  PackagePlus,
  Repeat,
  Settings,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { useState } from "react";

import EntradasTab from "./TabsPages/requisiciones/entradas-tab";
import VentasTabs from "./TabsPages/ventasProductos/ventas-tabs";
import AjustesTabs from "./TabsPages/ajusteStocks/ajustes-tabs";
import EliminacionesTabs from "./TabsPages/eliminacionStock/eliminaciones-tabs";
import VentasEliminadasTabs from "./TabsPages/ventasEliminadas/ventas-eliminadas-tabs";
import TransferenciasTabs from "./TabsPages/tranferenciaStock/transferencias-tabs";
import EntregasTabs from "./TabsPages/entregasStock/entregas-tabs";
import GarantiasTab from "./TabsPages/garantiasStock/garantias-tab";

function MovimientosStock() {
  const [activeTab, setActiveTab] = useState<
    | "requisiciones"
    | "ventas"
    | "ajustesStock"
    | "eliminacionStock"
    | "eliminacionVenta"
    | "transferenciaStock"
    | "entregasStocks"
    | "garantiasStock"
  >("requisiciones");

  return (
    <motion.div {...DesvanecerHaciaArriba} className="container mx-auto">
      <Tabs
        className="w-full md:max-w-4xl lg:max-w-6xl mx-auto"
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as any)}
        defaultValue="requisiciones"
      >
        <TabsList className="flex flex-col sm:flex-row gap-2 overflow-x-auto whitespace-nowrap">
          <TabsTrigger
            value="entregasStocks"
            className="text-center flex-shrink-0"
          >
            <PackagePlus className="w-4 h-4 mr-2" />
            Entregas
          </TabsTrigger>
          <TabsTrigger
            value="requisiciones"
            className="text-center flex-shrink-0"
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            Requisiciones
          </TabsTrigger>
          <TabsTrigger
            value="transferenciaStock"
            className="text-center flex-shrink-0"
          >
            <Repeat className="w-4 h-4 mr-2" />
            Transferencias
          </TabsTrigger>
          <TabsTrigger value="ventas" className="text-center flex-shrink-0">
            <ArrowUpCircle className="w-4 h-4 mr-2" />
            Ventas
          </TabsTrigger>
          <TabsTrigger
            value="ajustesStock"
            className="text-center flex-shrink-0"
          >
            <Settings className="w-4 h-4 mr-2" />
            Ajustes
          </TabsTrigger>
          <TabsTrigger
            value="eliminacionStock"
            className="text-center flex-shrink-0"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Elim. Stock
          </TabsTrigger>
          <TabsTrigger
            value="eliminacionVenta"
            className="text-center flex-shrink-0"
          >
            <Ban className="w-4 h-4 mr-2" />
            Elim. Venta
          </TabsTrigger>

          <TabsTrigger
            value="garantiasStock"
            className="text-center flex-shrink-0"
          >
            <ShieldCheck className="w-4 h-4 mr-2" />
            Garantías stock.
          </TabsTrigger>
        </TabsList>
        <TabsContent value="requisiciones" className="mt-4">
          <EntradasTab isActive={activeTab === "requisiciones"} />
        </TabsContent>

        <TabsContent value="ventas" className="mt-4">
          <VentasTabs isActive={activeTab === "ventas"} />
        </TabsContent>

        <TabsContent value="ajustesStock" className="mt-4">
          <AjustesTabs isActive={activeTab === "ajustesStock"} />
        </TabsContent>

        <TabsContent value="eliminacionStock" className="mt-4">
          <EliminacionesTabs isActive={activeTab === "eliminacionStock"} />
        </TabsContent>

        <TabsContent value="eliminacionVenta" className="mt-4">
          <VentasEliminadasTabs isActive={activeTab === "eliminacionVenta"} />
        </TabsContent>

        <TabsContent value="transferenciaStock" className="mt-4">
          <TransferenciasTabs isActive={activeTab === "transferenciaStock"} />
        </TabsContent>

        <TabsContent value="entregasStocks" className="mt-4">
          <EntregasTabs isActive={activeTab === "entregasStocks"} />
        </TabsContent>

        <TabsContent value="garantiasStock" className="mt-4">
          <GarantiasTab isActive={activeTab === "garantiasStock"} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default MovimientosStock;

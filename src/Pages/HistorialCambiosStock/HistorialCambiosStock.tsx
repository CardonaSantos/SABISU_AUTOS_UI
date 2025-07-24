import DesvanecerHaciaArriba from "@/Crm/Motion/DashboardAnimations";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ArrowDownCircle, ArrowUpCircle, Wrench } from "lucide-react";

import { useState } from "react";

import SalidasTab from "./TabsPages/TabSalidas";
import AjustesTab from "./TabsPages/TabAjustes";
import EntradasTab from "./TabsPages/requisiciones/entradas-tab";

function MovimientosStock() {
  const [activeTab, setActiveTab] = useState<
    "entradas" | "salidas" | "ajustes"
  >("entradas");

  return (
    <motion.div {...DesvanecerHaciaArriba} className="container mx-auto ">
      <Tabs
        className="w-full md:max-w-4xl lg:max-w-6xl mx-auto"
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as any)}
        defaultValue="entradas"
      >
        <TabsList className="flex flex-col sm:flex-row w-full gap-2">
          <TabsTrigger value="entradas" className="flex-1 text-center">
            <ArrowDownCircle className="w-4 h-4 mr-2" />
            Entradas
          </TabsTrigger>
          <TabsTrigger value="salidas" className="flex-1 text-center">
            <ArrowUpCircle className="w-4 h-4 mr-2" />
            Salidas
          </TabsTrigger>
          <TabsTrigger value="ajustes" className="flex-1 text-center">
            <Wrench className="w-4 h-4 mr-2" />
            Ajustes & Eliminación
          </TabsTrigger>
        </TabsList>
        <TabsContent value="entradas" className="mt-4">
          <EntradasTab isActive={activeTab === "entradas"} />
        </TabsContent>

        <TabsContent value="salidas" className="mt-4">
          <SalidasTab />
        </TabsContent>

        <TabsContent value="ajustes" className="mt-4">
          <AjustesTab />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default MovimientosStock;

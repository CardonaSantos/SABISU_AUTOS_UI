"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Route, MapPin, Plus } from "lucide-react";
import { RutasCobroList } from "./RutasCobroList";
import { RutasCobroCreate } from "./RutasCobroCreate";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

export default function RutasCobroPage() {
  const [activeTab, setActiveTab] = useState<string>("rutas");
  const [success, setSuccess] = useState<string | null>(null);

  const handleRouteCreated = (message: string) => {
    setSuccess(message);
    setActiveTab("rutas");

    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Route className="h-6 w-6 text-primary" />
            Rutas de Cobro
          </h1>
          <p className="text-muted-foreground">
            Gestione las rutas de cobro para sus clientes
          </p>
        </div>
      </div>

      {success && (
        <Alert className="mb-6 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900/30">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Éxito</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="rutas" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Rutas Existentes</span>
          </TabsTrigger>
          <TabsTrigger value="crear" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Crear Ruta</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rutas">
          <RutasCobroList />
        </TabsContent>

        <TabsContent value="crear">
          <RutasCobroCreate onRouteCreated={handleRouteCreated} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

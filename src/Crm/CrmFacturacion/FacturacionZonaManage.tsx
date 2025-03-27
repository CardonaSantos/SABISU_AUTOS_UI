"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";

import { ZonaForm } from "./FacturacionZonaForm";
import { ZonaTable } from "./FacturacionZonaTable";
import { EditZonaDialog } from "./EditZonaDialogProps";
import { DeleteZonaDialog } from "./DeleteZonaDialog";
import type {
  FacturacionZona,
  NuevaFacturacionZona,
} from "./FacturacionZonaTypes";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

const FacturacionZonaManage: React.FC = () => {
  // State para zonas de facturación
  const [zonas, setZonas] = useState<FacturacionZona[]>([]);
  const [searchZona, setSearchZona] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;

  // State para formulario
  const [nuevaZona, setNuevaZona] = useState<NuevaFacturacionZona>({
    nombre: "",
    empresaId: empresaId,
    diaGeneracionFactura: 10,
    diaPago: 20,
    diaRecordatorio: 5,
    diaSegundoRecordatorio: 15,
    horaRecordatorio: "08:00:00",
    enviarRecordatorio: true,
    diaCorte: 25,
    suspenderTrasFacturas: 2,
    whatsapp: false,
    email: false,
    sms: false,
    llamada: false,
    telegram: false,
  });

  // State para edición
  const [editingZona, setEditingZona] = useState<FacturacionZona | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // State para eliminación
  const [deleteZonaId, setDeleteZonaId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Cargar datos
  useEffect(() => {
    fetchZonas();
  }, []);

  // Función para cargar zonas de facturación
  const fetchZonas = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${VITE_CRM_API_URL}/facturacion-zona`);

      if (response.status === 200) {
        setZonas(response.data);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error al cargar zonas de facturación:", err);
      setError("Error al cargar las zonas de facturación. Intente nuevamente.");
      setIsLoading(false);
    }
  };

  // Submit handlers
  const handleSubmitZona = async (zonaData: NuevaFacturacionZona) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${VITE_CRM_API_URL}/facturacion-zona`,
        zonaData
      );

      if (response.status === 201) {
        toast.success("Nueva Zona de Facturación Creada");
      }

      // Reset form
      setNuevaZona({
        nombre: "",
        empresaId: empresaId,
        diaGeneracionFactura: 10,
        diaPago: 20,
        diaRecordatorio: 5,
        diaSegundoRecordatorio: 15,
        horaRecordatorio: "08:00:00",
        enviarRecordatorio: true,
        diaCorte: 10,
        suspenderTrasFacturas: 2,
        whatsapp: false,
        email: false,
        sms: false,
        llamada: false,
        telegram: false,
      });
      fetchZonas();
      setIsLoading(false);
    } catch (err) {
      toast.error("Error al crear zona");
      console.error("Error al crear zona de facturación:", err);
      setError("Error al crear la zona de facturación. Intente nuevamente.");
      setIsLoading(false);
    }
  };

  // Edit handlers
  const handleEditClick = (zona: FacturacionZona) => {
    setEditingZona(zona);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async (updatedZona: FacturacionZona) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.patch(
        `${VITE_CRM_API_URL}/facturacion-zona/update-zona-facturacion`,
        updatedZona
      );

      if (response.status === 200) {
        toast.success("Zona de Facturación Actualizada");
        setZonas(zonas.map((z) => (z.id === updatedZona.id ? updatedZona : z)));
      }

      // Close dialog and reset editing state
      setIsEditDialogOpen(false);
      setEditingZona(null);
      setIsLoading(false);
    } catch (err) {
      toast.error("Error al actualizar zona");
      console.error("Error al actualizar zona de facturación:", err);
      setError(
        "Error al actualizar la zona de facturación. Intente nuevamente."
      );
      setIsLoading(false);
    }
  };

  // Delete handlers
  const handleDeleteClick = (id: number) => {
    setDeleteZonaId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteZonaId === null) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.delete(
        `${VITE_CRM_API_URL}/facturacion-zona/${deleteZonaId}`
      );

      if (response.status === 200) {
        toast.success("Zona de Facturación Eliminada");
        setZonas(zonas.filter((z) => z.id !== deleteZonaId));
      }

      // Close dialog and reset delete state
      setIsDeleteDialogOpen(false);
      setDeleteZonaId(null);
      setIsLoading(false);
    } catch (err) {
      toast.error("Error al eliminar zona");
      console.error("Error al eliminar zona de facturación:", err);
      setError("Error al eliminar la zona de facturación. Intente nuevamente.");
      setIsLoading(false);
    }
  };

  // Filter zonas based on search
  const filteredZonas = zonas.filter((zona) =>
    zona.nombre.toLowerCase().includes(searchZona.toLowerCase())
  );

  console.log("El id de delete es: ", deleteZonaId);

  return (
    <div className="container mx-auto py-1 space-y-1">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Zonas de Facturación
            </h1>
            <p className="text-muted-foreground">
              Gestione las zonas de facturación para sus clientes
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar zonas..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchZona}
                onChange={(e) => setSearchZona(e.target.value)}
              />
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Formulario para crear zonas de facturación */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Nueva Zona de Facturación
              </CardTitle>
              <CardDescription>
                Configure los parámetros para una nueva zona de facturación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ZonaForm
                initialData={nuevaZona}
                onSubmit={handleSubmitZona}
                isLoading={isLoading}
                isEditing={false}
              />
            </CardContent>
          </Card>

          {/* Tabla de zonas de facturación */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Zonas de Facturación Existentes
              </CardTitle>
              <CardDescription>
                Lista de zonas de facturación configuradas en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && zonas.length === 0 ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ZonaTable
                  zonas={filteredZonas}
                  searchTerm={searchZona}
                  onEditClick={handleEditClick}
                  onDeleteClick={handleDeleteClick}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* EDITAR Dialog */}
        <EditZonaDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          zona={editingZona}
          onSave={handleSaveEdit}
          isLoading={isLoading}
        />

        {/* ELIMINAR CONFIRMACION Dialog */}
        <DeleteZonaDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirmDelete={handleConfirmDelete}
          isLoading={isLoading}
        />
      </motion.div>
    </div>
  );
};

export default FacturacionZonaManage;

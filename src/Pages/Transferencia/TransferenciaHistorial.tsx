"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRightIcon,
  PackageIcon,
  UserIcon,
  BuildingIcon,
} from "lucide-react";
import axios from "axios";
import { useStore } from "@/components/Context/ContextSucursal";
const API_URL = import.meta.env.VITE_API_URL;

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  codigoProducto: string;
  creadoEn: string;
  actualizadoEn: string;
}

interface Usuario {
  id: number;
  nombre: string;
  rol: string;
  activo: boolean;
  correo: string;
  sucursalId: number;
}

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  tipoSucursal: string;
  estadoOperacion: boolean;
}

interface Transferencia {
  id: number;
  productoId: number;
  cantidad: number;
  sucursalOrigenId: number;
  sucursalDestinoId: number;
  fechaTransferencia: string;
  usuarioEncargadoId: number;
  producto: Producto;
  usuarioEncargado: Usuario;
  sucursalDestino: Sucursal;
}

export default function TransferenciaProductosHistorial() {
  const [transferencias, setTransferencias] = useState<Transferencia[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const sucursalId = useStore((state) => state.sucursalId);

  useEffect(() => {
    const fetchTransferencias = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/transferencia-producto/get-my-translates/${sucursalId}`
        );
        setTransferencias(response.data);
      } catch (err) {
        setError(
          "Hubo un error al cargar los datos. Por favor, intenta de nuevo."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (sucursalId) {
      fetchTransferencias();
    }
  }, [sucursalId]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Transferencias de Productos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {transferencias.map((transferencia) => (
          <Card key={transferencia.id} className="overflow-hidden">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="flex items-center justify-between">
                <span>Transferencia #{transferencia.id}</span>
                <Badge variant="secondary">
                  {new Date(
                    transferencia.fechaTransferencia
                  ).toLocaleDateString()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <PackageIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">
                      {transferencia.producto.nombre}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Cantidad: {transferencia.cantidad}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">
                      {transferencia.usuarioEncargado.nombre}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transferencia.usuarioEncargado.correo}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <BuildingIcon className="h-5 w-5 text-muted-foreground" />
                  <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />
                  <BuildingIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">
                      {transferencia.sucursalDestino.nombre}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transferencia.sucursalDestino.direccion}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

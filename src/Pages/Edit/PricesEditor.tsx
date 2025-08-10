// src/components/PricesEditor.tsx
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { deleteOnePrice } from "./api";
import { AdvancedDialog } from "@/utils/components/AdvancedDialog";
import { Trash2 } from "lucide-react";

const ROLES_PRECIO = [
  { value: "PUBLICO", label: "Público" },
  { value: "MAYORISTA", label: "Mayorista" },
  { value: "ESPECIAL", label: "Especial" },
  { value: "DISTRIBUIDOR", label: "Distribuidor" },
];

export type PrecioProductoInventario = {
  id?: number;
  precio: number;
  orden: number;
  rol: string;
  tipo?: string;
  usado?: boolean;
};

interface PricesEditorProps {
  precios: PrecioProductoInventario[];
  setPrecios: (precios: PrecioProductoInventario[]) => void;
  getProducto: () => void;
}

export function PricesEditor({
  precios,
  setPrecios,
  getProducto,
}: PricesEditorProps) {
  const [loading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedID, setSelectedID] = useState<number | null>(null);

  // PricesEditor.tsx  (extracto)
  const deletePrice = async (id: number | null) => {
    if (!id || loading) return;

    try {
      setIsLoading(true); // se bloquea el botón inmediatamente
      await deleteOnePrice(id);
      toast.success("Precio eliminado correctamente");
      await getProducto();
    } catch (err) {
      toast.error("Error al eliminar el registro");
    } finally {
      setIsLoading(false);
      setOpen(false); // cierra el diálogo tras borrar
      setSelectedID(null);
    }
  };

  return (
    <div className="space-y-3">
      {precios
        .sort((a, b) => a.orden - b.orden)
        .map((precio, index) => (
          <div
            key={precio.id || index}
            className="grid grid-cols-4 gap-3 items-center"
          >
            <Input
              type="number"
              value={precio.precio}
              onChange={(e) =>
                setPrecios(
                  precios.map((p, idx) =>
                    idx === index
                      ? { ...p, precio: parseFloat(e.target.value) }
                      : p
                  )
                )
              }
              step="0.01"
              min="0"
              placeholder="0.00"
            />

            <Input
              type="number"
              value={precio.orden}
              onChange={(e) =>
                setPrecios(
                  precios.map((p, idx) =>
                    idx === index
                      ? { ...p, orden: parseInt(e.target.value) }
                      : p
                  )
                )
              }
              min="1"
              placeholder="Orden"
            />

            <Select
              value={precio.rol}
              onValueChange={(value) =>
                setPrecios(
                  precios.map((p, idx) =>
                    idx === index ? { ...p, rol: value } : p
                  )
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                {ROLES_PRECIO.map((rol) => (
                  <SelectItem key={rol.value} value={rol.value}>
                    {rol.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="destructive"
              type="button"
              onClick={() => {
                setOpen(true);
                setSelectedID(precio.id ?? 0);
              }}
            >
              Eliminar
            </Button>
          </div>
        ))}
      <Button
        type="button"
        onClick={() =>
          setPrecios([
            ...precios,
            {
              precio: 0,
              orden: precios.length + 1,
              rol: "PUBLICO",
              tipo: "ESTANDAR",
              usado: false,
            },
          ])
        }
        variant="outline"
        className="mt-2"
      >
        Agregar precio
      </Button>

      <AdvancedDialog
        open={open}
        onOpenChange={(state) => {
          setOpen(state);
          if (!state) setSelectedID(null);
        }}
        type="destructive"
        icon="delete"
        title="¿Eliminar producto?"
        subtitle="Esta acción no se puede deshacer"
        question="¿Estás seguro de que deseas eliminar este producto permanentemente?"
        description="El producto será eliminado de tu inventario y no podrás recuperarlo."
        confirmButton={{
          label: "Eliminar Producto",
          onClick: () => deletePrice(selectedID),
          variant: "destructive",
          loading: loading,
          loadingText: "Eliminando...",
          icon: <Trash2 className="mr-2 h-4 w-4" />,
          disabled: loading || !selectedID,
        }}
        cancelButton={{
          label: "Mantener Producto",
          onClick: () => setOpen(false),
          variant: "outline",
        }}
      />
    </div>
  );
}

import { PrecioProducto, RolPrecio } from "./preciosInterfaces.interface";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface PropsComponent {
  precios: PrecioProducto[];
  setPrecios: (value: PrecioProducto[]) => void;
}
const ROLES = [
  { label: "Público", value: "PUBLICO" },
  { label: "Mayorista", value: "MAYORISTA" },
  { label: "Especial", value: "ESPECIAL" },
  { label: "Distribuidor", value: "DISTRIBUIDOR" },
  { label: "Promoción", value: "PROMOCION" },
  { label: "Cliente Especial", value: "CLIENTE_ESPECIAL" },
];

function AddPrices({ precios, setPrecios }: PropsComponent) {
  console.log("Los precios pasando son: ", precios);

  const updateField = (idx: number, key: string, value: number | string) => {
    const next = precios.map((item, i) =>
      i === idx ? { ...item, [key]: value } : item
    );
    setPrecios(next);
  };

  const addPrecio = () => {
    setPrecios([
      ...precios,
      { precio: "", orden: precios.length + 1, rol: RolPrecio.PUBLICO },
    ]);
  };

  const removePrecio = (idx: number) =>
    setPrecios(precios.filter((_, i) => i !== idx));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Coins className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">Precios del Producto</h3>
      </div>

      {/* Column Headers */}
      {precios.length > 0 && (
        <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-muted/50 rounded-lg">
          <div className="col-span-4">
            <Label className="text-sm font-medium text-muted-foreground">
              Precio
            </Label>
          </div>
          <div className="col-span-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Orden
            </Label>
          </div>
          <div className="col-span-5">
            <Label className="text-sm font-medium text-muted-foreground">
              Tipo de Cliente
            </Label>
          </div>
          <div className="col-span-1">
            <Label className="text-sm font-medium text-muted-foreground">
              Acción
            </Label>
          </div>
        </div>
      )}

      {/* Price Rows */}
      <div className="space-y-3">
        {precios.map((p, idx) => (
          <Card key={idx} className="border-l-4 border-l-primary/20">
            <CardContent className="p-4">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                  <div className="relative">
                    <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={p.precio}
                      onChange={(e) =>
                        updateField(idx, "precio", Number(e.target.value))
                      }
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <Input
                    type="number"
                    value={p.orden}
                    onChange={(e) =>
                      updateField(idx, "orden", Number(e.target.value))
                    }
                    placeholder="1"
                    min="1"
                    className="text-center"
                  />
                </div>

                <div className="col-span-5">
                  <Select
                    value={p.rol}
                    onValueChange={(v) => updateField(idx, "rol", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((rol) => (
                        <SelectItem key={rol.value} value={rol.value}>
                          {rol.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-1 flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePrecio(idx)}
                    type="button"
                    className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {precios.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Coins className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-4">
              No hay precios configurados
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add Button */}
      <Button
        onClick={addPrecio}
        type="button"
        variant="outline"
        className="w-full border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 bg-transparent"
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar precio
      </Button>
    </div>
  );
}

export default AddPrices;

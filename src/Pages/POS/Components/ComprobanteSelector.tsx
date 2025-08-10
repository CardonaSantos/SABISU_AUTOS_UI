import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TipoComprobante } from "../interfaces";

export function ComprobanteSelector({
  tipo,
  setTipo,
}: {
  tipo: TipoComprobante | null;
  setTipo: React.Dispatch<React.SetStateAction<TipoComprobante | null>>;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold mr-2 ">Operado con</label>
      <ToggleGroup
        type="single"
        value={tipo ?? undefined}
        onValueChange={(v) => v && setTipo(v as TipoComprobante)}
        className="inline-flex rounded-lg border"
      >
        <ToggleGroupItem
          value="RECIBO"
          className="
      px-3 py-0 text-xs
      data-[state=on]:bg-[#e3054b] 
      data-[state=on]:text-white
      data-[state=off]:bg-transparent
      data-[state=off]:text-gray-700
    "
        >
          RECIBO
        </ToggleGroupItem>
        <ToggleGroupItem
          value="FACTURA"
          className="
      px-3 py-0 text-xs 
      data-[state=on]:bg-[#0f62fe] 
      data-[state=on]:text-white
      data-[state=off]:bg-transparent
      data-[state=off]:text-gray-700
    "
        >
          FACTURA
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

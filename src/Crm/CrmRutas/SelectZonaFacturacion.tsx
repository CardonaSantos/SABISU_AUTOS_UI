"use client";

import ReactSelectComponent from "react-select";
import type { OptionSelected, FacturacionZona } from "./rutas-types";

interface SelectZonaFacturacionProps {
  zonas: FacturacionZona[];
  value: string | null;
  onChange: (option: OptionSelected | null) => void;
}

export function SelectZonaFacturacion({
  zonas,
  value,
  onChange,
}: SelectZonaFacturacionProps) {
  const optionsZonasFacturacion: OptionSelected[] = zonas.map((c) => ({
    value: c.id.toString(),
    label: `${c.nombreRuta} (${c.clientes} clientes)`,
  }));

  return (
    <ReactSelectComponent
      className="text-black text-sm w-full sm:w-[250px]"
      options={optionsZonasFacturacion}
      onChange={onChange}
      isClearable
      placeholder="Filtrar por zona..."
      value={
        value
          ? {
              value: value,
              label:
                zonas.find((c) => c.id.toString() === value)?.nombreRuta || "",
            }
          : null
      }
    />
  );
}

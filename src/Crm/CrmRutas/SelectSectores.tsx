"use client";

import ReactSelect, { ActionMeta, SingleValue } from "react-select";
import type { OptionSelected, Sector } from "./rutas-types";

interface SelectSectoresProps {
  sectores: Sector[];
  value: string | null;
  onChange: (value: string | null) => void; // Mejor: Recibe directamente el valor
  className?: string;
}

export function SelectSectores({
  sectores,
  value,
  onChange,
  className = "",
}: SelectSectoresProps) {
  // Memoizar las opciones para mejor rendimiento
  const options = sectores.map(
    (sector): OptionSelected => ({
      value: sector.id.toString(),
      label: `${sector.nombre} (${sector.clientesCount} clientes)`,
    })
  );

  // Encontrar el valor seleccionado
  const selectedOption = value
    ? options.find((option) => option.value === value) || null
    : null;

  // Manejar cambio manteniendo consistencia con react-select
  const handleChange = (
    newValue: SingleValue<OptionSelected>,
    _actionMeta: ActionMeta<OptionSelected>
  ) => {
    onChange(newValue?.value ?? null);
  };

  return (
    <ReactSelect<OptionSelected>
      className={`text-black text-sm ${className}`}
      options={options}
      onChange={handleChange}
      value={selectedOption}
      isClearable
      placeholder="Filtrar por sector..."
      noOptionsMessage={() => "No hay sectores disponibles"}
      classNames={{
        control: () => "!min-h-9 !border-gray-300",
        placeholder: () => "!text-gray-400",
      }}
    />
  );
}

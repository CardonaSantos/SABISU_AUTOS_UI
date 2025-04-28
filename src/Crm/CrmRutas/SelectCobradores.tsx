"use client";

import { useState, useEffect } from "react";
import ReactSelectComponent from "react-select";
import axios from "axios";
import type { OptionSelected, Usuario } from "./rutas-types";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

interface SelectCobradoresProps {
  value: string | null | undefined;
  onChange: (value: string | null) => void;
}

export function SelectCobradores({ value, onChange }: SelectCobradoresProps) {
  const [cobradores, setCobradores] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCobradores();
  }, []);

  const fetchCobradores = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/user/get-users-to-rutas`
      );
      setCobradores(response.data);
    } catch (err) {
      console.error("Error al cargar cobradores:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const optionsCobradores: OptionSelected[] = cobradores.map((c) => ({
    value: c.id.toString(),
    label: `${c.nombre} `,
  }));

  const handleSelectCobrador = (optionSelected: OptionSelected | null) => {
    const newValue = optionSelected ? optionSelected.value : null;
    onChange(newValue);
  };

  return (
    <ReactSelectComponent
      className="text-sm text-black"
      options={optionsCobradores}
      onChange={handleSelectCobrador}
      isClearable
      isLoading={isLoading}
      placeholder="Seleccionar cobrador..."
      value={
        value
          ? {
              value: value,
              label:
                cobradores.find((c) => c.id.toString() === value)?.nombre || "",
            }
          : null
      }
    />
  );
}

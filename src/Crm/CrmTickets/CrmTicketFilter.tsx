"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TicketFiltersProps {
  onFilterChange: (value: string) => void;
  onStatusChange: (value: string | null) => void;
}

export default function TicketFilters({
  onFilterChange,
  onStatusChange,
}: TicketFiltersProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar"
            className="pl-8"
            onChange={(e) => onFilterChange(e.target.value)}
          />
        </div>

        <Select onValueChange={(value) => console.log(value)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Choose a tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="urgent">Urgente</SelectItem>
            <SelectItem value="maintenance">Mantenimiento</SelectItem>
            <SelectItem value="installation">Instalación</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => console.log(value)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Usuario asignado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="floridalma">Floridalma Caño</SelectItem>
            <SelectItem value="nicolasa">Nicolasa Dilia</SelectItem>
            <SelectItem value="cindy">Cindy Dileny</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal sm:w-[240px]"
            >
              <span>
                {date
                  ? format(date, "PPP", { locale: es })
                  : "Choose a date range"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-wrap gap-2">
        <Select onValueChange={(value) => console.log(value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Todos los tickets" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tickets</SelectItem>
            <SelectItem value="assigned">Asignados a mí</SelectItem>
            <SelectItem value="created">Creados por mí</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
            onClick={() => onStatusChange("nuevo")}
          >
            Nuevo
          </Button>
          <Button
            variant="outline"
            className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
            onClick={() => onStatusChange("abierto")}
          >
            Abiertos
          </Button>
          <Button
            variant="outline"
            className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700"
            onClick={() => onStatusChange("pendiente")}
          >
            Pendiente
          </Button>
          <Button
            variant="outline"
            className="bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-700"
            onClick={() => onStatusChange("solucionado")}
          >
            Solucionado
          </Button>
        </div>
      </div>
    </div>
  );
}

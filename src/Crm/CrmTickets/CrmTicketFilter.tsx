"use client";

import { Dispatch, SetStateAction } from "react";
// import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { es } from "date-fns/locale";
import CrmCreateTicket from "./CreateTickets/CrmCreateTicket";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import ReactSelectComponent, { MultiValue } from "react-select";
import { OptionSelected } from "../ReactSelectComponent/OptionSelected";
import DatePicker from "react-datepicker";
import { Ticket } from "./ticketTypes";
import { Ticket as TicketIcon } from "lucide-react";

interface Tecnicos {
  id: number;
  nombre: string;
}

interface Etiqueta {
  id: number;
  nombre: string;
}

type DateRange = {
  startDate: Date | undefined;
  endDate: Date | undefined;
};

interface TicketFiltersProps {
  tickets: Ticket[];
  //tickets filtrados
  onFilterChange: (value: string) => void;
  onStatusChange: (value: string | null) => void;
  //Para el modal
  openCreatT: boolean;
  setOpenCreateT: (value: boolean) => void;
  getTickets: () => void;
  //filter de asignados
  setSelectedAssignee: (value: string | null) => void;
  setSelectedCreator: (value: string | null) => void;
  //tecnicos
  tecnicos: Tecnicos[];
  tecnicoSelected: string | null;
  handleSelectedTecnico: (value: OptionSelected | null) => void;
  //filtrado de etiquetas
  etiquetas: Etiqueta[];
  //etiquetas seleccionadas
  etiquetasSelecteds: number[];
  handleChangeLabels: (
    selectedOptions: MultiValue<{ value: string; label: string }>
  ) => void;
  //rango de fechas
  dateRange: DateRange;
  setDateRange: Dispatch<SetStateAction<DateRange>>;
}

export default function TicketFilters({
  tickets,
  //tickets filtrados
  onFilterChange,
  // onStatusChange,
  //Propiedades del create ticket
  getTickets,
  openCreatT,
  setOpenCreateT,
  //para filter select
  setSelectedAssignee,
  setSelectedCreator,
  //pra el filtro
  tecnicos,
  tecnicoSelected,
  handleSelectedTecnico,
  //filtrado de etiquetas
  etiquetas,
  etiquetasSelecteds,
  handleChangeLabels,
  //filtrado por fechas
  dateRange,
  setDateRange,
}: TicketFiltersProps) {
  // const [date, setDate] = useState<Date | undefined>(undefined);
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;

  const coincidencias = tickets.filter(
    (ticket) => ticket.status !== "RESUELTA"
  );

  const handleFilterChange = (value: string) => {
    if (value === "assignedToMe") {
      setSelectedAssignee(String(userId)); // Establece el ID del usuario asignado a ti
      setSelectedCreator(null); // Limpiar el filtro por creador
    } else if (value === "createdByMe") {
      setSelectedCreator(String(userId)); // Establece el ID del creador a ti
      setSelectedAssignee(null); // Limpiar el filtro por asignado
    } else {
      setSelectedAssignee(null); // Limpiar el filtro por asignado
      setSelectedCreator(null); // Limpiar el filtro por creador
    }
  };

  const optionsTecnicos = tecnicos.map((tec) => ({
    value: String(tec.id),
    label: tec.nombre,
  }));
  const optionsLabels = etiquetas.map((label) => ({
    value: label.id.toString(),
    label: label.nombre,
  }));

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar"
            className="pl-8 "
            onChange={(e) => onFilterChange(e.target.value)}
          />
        </div>

        {/* Rango de fechas */}
        <div className="space-y-1">
          <div className="flex gap-2 relative z-10">
            <DatePicker
              locale={es}
              selected={dateRange.startDate || null}
              onChange={(date: Date | null) =>
                setDateRange((prev) => ({
                  ...prev,
                  startDate: date || undefined,
                }))
              }
              selectsStart
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              placeholderText="Fecha inicial"
              className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring z-50 relative"
              dateFormat="dd/MM/yyyy"
              isClearable
            />

            <DatePicker
              selected={dateRange.endDate || null}
              onChange={(date: Date | null) =>
                setDateRange((prev) => ({
                  ...prev,
                  endDate: date || undefined,
                }))
              }
              selectsEnd
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              minDate={dateRange.startDate}
              placeholderText="Fecha final"
              className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring z-50 relative"
              dateFormat="dd/MM/yyyy"
              isClearable
            />
          </div>
        </div>

        <ReactSelectComponent
          placeholder="Filtrar por etiquetas"
          className="w-full sm:w-[300px] text-black text-xs"
          options={optionsLabels}
          isClearable
          isMulti
          onChange={handleChangeLabels}
          value={optionsLabels.filter((option) =>
            etiquetasSelecteds.includes(Number.parseInt(option.value))
          )}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setOpenCreateT(true);
            }}
            variant={"destructive"}
            className="h-[32px] border-2"
          >
            Crear Ticket
          </Button>
          <CrmCreateTicket
            getTickets={getTickets}
            openCreatT={openCreatT}
            setOpenCreateT={setOpenCreateT}
          />
        </div>
        <Select onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[150px] h-[32px]">
            <SelectValue placeholder="Filtrar tickets" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="assignedToMe">{`Asignados a mí`}</SelectItem>
            <SelectItem value="createdByMe">{`Creados por mí`}</SelectItem>
          </SelectContent>
        </Select>

        <ReactSelectComponent
          placeholder="Filtrar por técnico"
          className="w-full sm:w-[200px] text-black text-xs"
          options={optionsTecnicos}
          isClearable
          onChange={handleSelectedTecnico}
          value={
            tecnicoSelected
              ? {
                  value: tecnicoSelected,
                  label:
                    tecnicos.find(
                      (tec) => tec.id.toString() === tecnicoSelected
                    )?.nombre || "",
                }
              : null
          }
        />
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <TicketIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
          <span className="font-medium dark:text-gray-300">
            Coincidencias encontradas
          </span>
          <span className="ml-1 inline-flex items-center justify-center bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {coincidencias.length}
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import TicketList from "./CrmTicketList";
import TicketDetail from "./CrmTicketDetails";
import TicketFilters from "./CrmTicketFilter";
import type { Ticket } from "./ticketTypes";
// import { mockTickets } from "./mock-data";
import { toast } from "sonner";
import axios from "axios";
// import { set } from "date-fns";
import { OptionSelected } from "../ReactSelectComponent/OptionSelected";
import { MultiValue } from "react-select";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

// Tipos para las fechas
type DateRange = {
  startDate: Date | undefined;
  endDate: Date | undefined;
};

export default function TicketDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });
  const [tickets, setTickets] = useState<Ticket[]>([]);
  console.log(setTickets);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null); // Solo ID
  const [filterText, setFilterText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);

  const filterTickets = (tickets: Ticket[]) => {
    return tickets.filter((ticket) => {
      const matchesText =
        ticket.title.toLowerCase().includes(filterText.toLowerCase()) ||
        ticket.description.toLowerCase().includes(filterText.toLowerCase()) ||
        ticket.id.toString().includes(filterText);

      const matchesStatus = selectedStatus
        ? String(ticket.status) === selectedStatus
        : true;

      const matchesAssignee = selectedAssignee
        ? ticket.assignee && String(ticket?.assignee.id) === selectedAssignee
        : true;

      const matchesCreator = selectedCreator
        ? ticket.creator && String(ticket?.creator.id) === selectedCreator
        : true;

      const matchesTecnico = tecnicoSelected
        ? ticket.assignee && ticket?.assignee.id.toString() === tecnicoSelected
        : true;

      const matchesEtiquetas =
        labelsSelecteds && labelsSelecteds.length > 0
          ? ticket.tags?.some(
              (tag) => tag.value.toString() === labelsSelecteds.toString()
            )
          : true;

      const matchesDate = () => {
        if (!dateRange.startDate && !dateRange.endDate) return true;

        const ticketDate = new Date(ticket.date);

        // Ajustar fechas de filtrado para cubrir días completos
        const start = dateRange.startDate
          ? new Date(dateRange.startDate)
          : new Date(0); // Fecha mínima
        start.setHours(0, 0, 0, 0); // Inicio del día

        const end = dateRange.endDate
          ? new Date(dateRange.endDate)
          : new Date(); // Fecha actual
        end.setHours(23, 59, 59, 999); // Fin del día

        return ticketDate >= start && ticketDate <= end;
      };

      return (
        matchesText &&
        matchesStatus &&
        matchesAssignee &&
        matchesCreator &&
        matchesTecnico &&
        matchesEtiquetas &&
        matchesDate()
      );
    });
  };

  //ESTADOS PARA CREAR TICKET Y LLAMADA A FUNCION GET
  const [openCreateTicket, setOpenCreateTicket] = useState(false);
  const getTickets = async () => {
    try {
      const response = await axios.get(`${VITE_CRM_API_URL}/tickets-soporte`);
      if (response.status === 200) {
        setTickets(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir tickets");
    }
  };
  console.log("tickets", tickets);
  console.log(
    "las fechas seleccionadas son: ",
    dateRange.startDate,
    dateRange.endDate
  );

  useEffect(() => {
    getTickets();
  }, []);
  console.log("El estado seleccionado es: ", selectedStatus);

  interface Etiqueta {
    id: number;
    nombre: string;
  }

  interface Usuario {
    id: number;
    nombre: string;
  }

  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [tecnicos, setTecnicos] = useState<Usuario[]>([]);
  const optionsLabels = etiquetas.map((label) => ({
    value: label.id.toString(),
    label: label.nombre,
  }));

  const optionsTecs = tecnicos.map((tec) => ({
    value: tec.id.toString(),
    label: tec.nombre,
  }));

  const getEtiquetas = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/tags-ticket/get-tags-to-ticket`
      );
      if (response.status === 200) {
        setEtiquetas(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.info("No se pudieron conseguir tags");
    }
  };

  const getTecs = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/user/get-users-to-create-tickets`
      );
      if (response.status === 200) {
        setTecnicos(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.info("No se pudieron conseguir los clientes");
    }
  };

  useEffect(() => {
    getEtiquetas();
    getTecs();
  }, []);

  const selectedTicket = tickets.find(
    (ticket) => ticket.id === selectedTicketId
  );

  const [tecnicoSelected, setTecnicoSelected] = useState<string | null>(null);
  console.log("El tecnico seleccionado es: ", tecnicoSelected);

  const handleSelectedTecnico = (optionSelect: OptionSelected | null) => {
    setTecnicoSelected(optionSelect ? optionSelect.value : null);
  };

  const [labelsSelecteds, setLabelsSelecteds] = useState<number[]>([]);
  const handleChangeLabels = (
    selectedOptions: MultiValue<{ value: string; label: string }>
  ) => {
    const selectedIds = selectedOptions.map((option) => parseInt(option.value));
    setLabelsSelecteds(selectedIds);
  };

  const detailRef = useRef<HTMLDivElement>(null);

  function handleSelectTicket(ticket: Ticket) {
    setSelectedTicketId(ticket.id);

    // give React a tick to mount the detail pane,
    // then smooth-scroll it into view
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  return (
    <div className="">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <TicketFilters
          tickets={filterTickets(tickets)}
          onFilterChange={setFilterText}
          onStatusChange={setSelectedStatus}
          openCreatT={openCreateTicket}
          setOpenCreateT={setOpenCreateTicket}
          getTickets={getTickets}
          setSelectedAssignee={setSelectedAssignee}
          setSelectedCreator={setSelectedCreator}
          //tecnicos para filtrado
          tecnicos={tecnicos}
          tecnicoSelected={tecnicoSelected}
          handleSelectedTecnico={handleSelectedTecnico}
          //etiquetas filtrado
          etiquetas={etiquetas}
          etiquetasSelecteds={labelsSelecteds}
          handleChangeLabels={handleChangeLabels}
          //rango de fechas creadas
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </motion.div>
      <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-220px)]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="min-h-0 h-full overflow-hidden"
        >
          <div className="flex flex-col h-full">
            <TicketList
              // FUNCION PARA ATRAER AL TICKET
              onSelectTicket={handleSelectTicket}
              tickets={filterTickets(tickets)}
              selectedTicketId={selectedTicketId}
              onSelectTicketDown={(ticket) => setSelectedTicketId(ticket.id)}
            />
          </div>
        </motion.div>

        {/* ── RIGHT COLUMN: ticket detail */}
        {selectedTicket && (
          <motion.div
            key="ticket-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-card rounded-lg shadow min-h-0 h-full overflow-hidden"
            ref={detailRef}
          >
            <TicketDetail
              // setSelectedTicketId={setSelectedTicketId}
              ticket={selectedTicket}
              getTickets={getTickets}
              optionsLabels={optionsLabels}
              optionsTecs={optionsTecs}
              setSelectedTicketId={setSelectedTicketId}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

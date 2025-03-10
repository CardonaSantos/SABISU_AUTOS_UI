"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import TicketList from "./CrmTicketList";
import TicketDetail from "./CrmTicketDetails";
import TicketFilters from "./CrmTicketFilter";
import type { Ticket } from "./ticketTypes";
import { mockTickets } from "./mock-data";
import { toast } from "sonner";

export default function TicketDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  console.log(setTickets);

  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null); // Solo ID
  const [filterText, setFilterText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const filterTickets = (tickets: Ticket[]) => {
    return tickets.filter((ticket) => {
      const matchesText =
        ticket.title.toLowerCase().includes(filterText.toLowerCase()) ||
        ticket.description.toLowerCase().includes(filterText.toLowerCase()) ||
        ticket.id.toString().includes(filterText);

      const matchesStatus = selectedStatus
        ? ticket.status === selectedStatus
        : true;

      return matchesText && matchesStatus;
    });
  };

  //ESTADOS PARA CREAR TICKET Y LLAMADA A FUNCION GET
  const [openCreateTicket, setOpenCreateTicket] = useState(false);
  const getTickets = async () => {
    try {
      const response = "Respuesta del servidor";
      console.log("La respuesta del servidor es: ", response);
      toast.success("Ticket Creado y solicitando al servidor");
    } catch (error) {
      console.log(error);
      toast.error("Error al crear ticket");
    }
  };

  return (
    <div className="container mx-auto p-2 md:p-4 lg:py-0">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex gap-2 "></div>
        <TicketFilters
          onFilterChange={setFilterText}
          onStatusChange={setSelectedStatus}
          //Estados para abrir y cerrar el Dialog, y funcion get
          openCreatT={openCreateTicket}
          setOpenCreateT={setOpenCreateTicket}
          getTickets={getTickets}
        />
      </motion.div>

      <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-card rounded-lg shadow"
        >
          <TicketList
            tickets={filterTickets(tickets)} // Tickets
            selectedTicketId={selectedTicketId} // Solo ID del ticket seleccionado
            onSelectTicket={(ticket) => setSelectedTicketId(ticket.id)} // Setea solo el ID
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-card rounded-lg shadow"
        >
          {selectedTicketId && (
            <TicketDetail
              ticket={tickets.find((ticket) => ticket.id === selectedTicketId)!}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

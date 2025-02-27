"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import TicketList from "./CrmTicketList";
import TicketDetail from "./CrmTicketDetails";
import TicketFilters from "./CrmTicketFilter";
import type { Ticket } from "./ticketTypes";
import { mockTickets } from "./mock-data";

export default function TicketDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  console.log(setTickets);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(
    mockTickets[0]
  );
  const [filterText, setFilterText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesText =
      ticket.title.toLowerCase().includes(filterText.toLowerCase()) ||
      ticket.description.toLowerCase().includes(filterText.toLowerCase()) ||
      ticket.id.toString().includes(filterText);

    const matchesStatus = selectedStatus
      ? ticket.status === selectedStatus
      : true;

    return matchesText && matchesStatus;
  });

  return (
    <div className="container mx-auto p-2 md:p-4 lg:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <TicketFilters
          onFilterChange={setFilterText}
          onStatusChange={setSelectedStatus}
        />
      </motion.div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-card rounded-lg shadow"
        >
          <TicketList
            tickets={filteredTickets}
            selectedTicketId={selectedTicket?.id}
            onSelectTicket={(ticket) => setSelectedTicket(ticket)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-card rounded-lg shadow"
        >
          {selectedTicket && <TicketDetail ticket={selectedTicket} />}
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Ticket } from "./ticketTypes";
// import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
// import { Button } from "@/components/ui/button";
// import CrmCreateTicket from "./CreateTickets/CrmCreateTicket";

interface TicketListProps {
  tickets: Ticket[]; // Lista de tickets
  selectedTicketId: number | null; // ID del ticket seleccionado (debería ser un número, no un objeto Ticket)
  onSelectTicket: (ticket: Ticket) => void; // Función para seleccionar un ticket
}

export default function TicketList({
  tickets,
  selectedTicketId,
  onSelectTicket,
}: TicketListProps) {
  console.log("El id que me están pasando a la list es: ", selectedTicketId);

  return (
    <div className="h-[calc(100vh-220px)] flex flex-col">
      <Tabs defaultValue="inbox" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-10">
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="lista">Lista</TabsTrigger>
          <TabsTrigger value="archivados">Archivados</TabsTrigger>
        </TabsList>
        <TabsContent value="inbox" className="m-0 my-1">
          <div className="overflow-y-auto h-[calc(100vh-280px)]">
            <AnimatePresence>
              {tickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`border-b p-4 cursor-pointer ${
                    Number(selectedTicketId) === Number(ticket.id)
                      ? "bg-gray-100 dark:bg-gray-900"
                      : ""
                  }`}
                  onClick={() => {
                    onSelectTicket(ticket);
                    console.log("El ticket seleccionado es: ", ticket.id);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {ticket.assignee.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-[13px]">
                          #{ticket.id} · {ticket.assignee.name}
                        </div>
                        <div className="text-xs ">
                          {format(new Date(ticket.date), "d MMM yyyy", {
                            locale: es,
                          })}
                        </div>
                      </div>
                      <h3 className="font-normal text-base truncate">
                        {ticket.title}
                      </h3>
                      <p className="text-[12px] line-clamp-2">
                        {ticket.description}
                      </p>
                    </div>
                    {ticket.status === "nuevo" && (
                      <div className="mt-2">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                        >
                          Nuevo
                        </Badge>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>
        {/* Similar for "lista" and "archivados" tabs */}
        <TabsContent value="lista" className="m-0">
          <div className="p-4 text-center text-muted-foreground">
            Vista de lista no implementada
          </div>
        </TabsContent>
        <TabsContent value="archivados" className="m-0">
          <div className="p-4 text-center text-muted-foreground">
            No hay tickets archivados
          </div>
        </TabsContent>{" "}
      </Tabs>
    </div>
  );
}

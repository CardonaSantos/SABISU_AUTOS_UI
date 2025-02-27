"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Ticket } from "./ticketTypes";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TicketListProps {
  tickets: Ticket[];
  selectedTicketId: number | undefined;
  onSelectTicket: (ticket: Ticket) => void;
}

export default function TicketList({
  tickets,
  selectedTicketId,
  onSelectTicket,
}: TicketListProps) {
  return (
    <div className="h-[calc(100vh-220px)] flex flex-col">
      <Tabs defaultValue="inbox" className="w-full">
        <div className="border-b px-4 py-2">
          <TabsList className="grid w-full grid-cols-3 h-9">
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="lista">Lista</TabsTrigger>
            <TabsTrigger value="archivados">Archivados</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="inbox" className="m-0">
          <div className="overflow-y-auto h-[calc(100vh-280px)]">
            <AnimatePresence>
              {tickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  className={cn(
                    "border-b p-4 cursor-pointer",
                    selectedTicketId === ticket.id && "bg-muted"
                  )}
                  onClick={() => onSelectTicket(ticket)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 bg-primary">
                      <span className="text-xs font-medium">
                        {ticket.assignee.initials}
                      </span>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm text-muted-foreground">
                          #{ticket.id} · {ticket.assignee.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(ticket.date), "d MMM yyyy", {
                            locale: es,
                          })}
                        </div>
                      </div>

                      <h3 className="font-medium text-base truncate">
                        {ticket.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {ticket.description}
                      </p>

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

                    {ticket.unread && (
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="lista" className="m-0">
          <div className="p-4 text-center text-muted-foreground">
            Vista de lista no implementada
          </div>
        </TabsContent>

        <TabsContent value="archivados" className="m-0">
          <div className="p-4 text-center text-muted-foreground">
            No hay tickets archivados
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

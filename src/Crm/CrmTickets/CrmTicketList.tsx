"use client";

enum EstadoTicketSoporte {
  NUEVO = "NUEVO",
  ABIERTA = "ABIERTA",
  EN_PROCESO = "EN_PROCESO",
  PENDIENTE = "PENDIENTE",
  PENDIENTE_CLIENTE = "PENDIENTE_CLIENTE",
  PENDIENTE_TECNICO = "PENDIENTE_TECNICO",
  RESUELTA = "RESUELTA",
  CANCELADA = "CANCELADA",
  ARCHIVADA = "ARCHIVADA",
}

import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Ticket } from "./ticketTypes";
// import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";
// import CrmCreateTicket from "./CreateTickets/CrmCreateTicket";

interface TicketListProps {
  tickets: Ticket[]; // Lista de tickets
  selectedTicketId: number | null; // ID del ticket seleccionado (debería ser un número, no un objeto Ticket)
  onSelectTicket: (ticket: Ticket) => void; // Función para seleccionar un ticket
  onSelectTicketDown: (ticket: Ticket) => void; // Función para seleccionar un ticket al hacer scroll
}
//==================>
// Componente para mostrar un ticket individual
const TicketItem = ({
  ticket,
  isSelected,
  onSelect,
  avatarColor,
  getBadgeProps,
}: {
  ticket: Ticket;
  isSelected: boolean;
  onSelect: (ticket: Ticket) => void;
  avatarColor: string;
  getBadgeProps: (status: EstadoTicketSoporte) => {
    text: string;
    bgColor: string;
    textColor: string;
  };
}) => {
  return (
    <motion.div
      key={ticket.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`border-b p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
        isSelected ? "bg-gray-100 dark:bg-gray-900" : ""
      }`}
      onClick={() => onSelect(ticket)}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback
            className={`${avatarColor} text-gray-800 font-semibold`}
          >
            {ticket.customer
              ? ticket.customer.name.slice(0, 2).toUpperCase()
              : "NA"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[13px] font-medium">
              #{ticket.id} ·{" "}
              {ticket.customer ? ticket.customer.name : "No asignado"}
            </div>
            <div className="text-xs text-gray-500">
              {format(new Date(ticket.date), "d MMM yyyy", {
                locale: es,
              })}
            </div>
          </div>
          <h3 className="font-normal text-base truncate">{ticket.title}</h3>
          <p className="text-[12px] text-gray-600 dark:text-gray-400 line-clamp-2">
            {ticket.description}
          </p>
        </div>
        <div className="mt-2 shrink-0">
          <Badge
            variant="outline"
            className={`${getBadgeProps(ticket.status).bgColor} ${
              getBadgeProps(ticket.status).textColor
            }`}
          >
            <span className="text-[10px]">
              {getBadgeProps(ticket.status).text}
            </span>
          </Badge>
        </div>
      </div>
    </motion.div>
  );
};

// Componente para mostrar una lista de tickets con un mensaje cuando está vacía
const TicketsList = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
  colorMap,
  getBadgeProps,
  emptyMessage,
}: {
  tickets: Ticket[];
  selectedTicketId: number | null;
  onSelectTicket: (ticket: Ticket) => void;
  colorMap: Record<string, string>;
  getBadgeProps: (status: EstadoTicketSoporte) => {
    text: string;
    bgColor: string;
    textColor: string;
  };
  emptyMessage: { title: string; description: string };
}) => {
  return (
    <ScrollArea className="h-[calc(100vh-280px)] w-full">
      <AnimatePresence>
        {tickets.length === 0 ? (
          <div className="py-6 mx-2">
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>{emptyMessage.title}</AlertTitle>
              <AlertDescription>{emptyMessage.description}</AlertDescription>
            </Alert>
          </div>
        ) : (
          tickets.map((ticket) => (
            <TicketItem
              key={ticket.id}
              ticket={ticket}
              isSelected={Number(selectedTicketId) === Number(ticket.id)}
              onSelect={onSelectTicket}
              avatarColor={colorMap[ticket.id] || "bg-gray-300"}
              getBadgeProps={getBadgeProps}
            />
          ))
        )}
      </AnimatePresence>
    </ScrollArea>
  );
};
export default function TicketList({
  tickets,
  selectedTicketId,
  onSelectTicket,
}: // onSelectTicketDown,
TicketListProps) {
  console.log("El id que me están pasando a la list es: ", selectedTicketId);

  const getBadgeProps = (status: EstadoTicketSoporte) => {
    switch (status) {
      case EstadoTicketSoporte.NUEVO:
        return {
          text: "Nuevo",
          bgColor: "bg-blue-50",
          textColor: "text-blue-600",
        };
      case EstadoTicketSoporte.ABIERTA:
        return {
          text: "Abierto",
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-600",
        };
      case EstadoTicketSoporte.EN_PROCESO:
        return {
          text: "En Proceso",
          bgColor: "bg-green-50",
          textColor: "text-green-600",
        };
      case EstadoTicketSoporte.PENDIENTE:
        return {
          text: "Pendiente",
          bgColor: "bg-gray-50",
          textColor: "text-gray-600",
        };
      case EstadoTicketSoporte.PENDIENTE_CLIENTE:
        return {
          text: "Pendiente Cliente",
          bgColor: "bg-pink-50",
          textColor: "text-pink-600",
        };
      case EstadoTicketSoporte.PENDIENTE_TECNICO:
        return {
          text: "Pendiente Técnico",
          bgColor: "bg-teal-50",
          textColor: "text-teal-600",
        };
      case EstadoTicketSoporte.RESUELTA:
        return {
          text: "Resuelta",
          bgColor: "bg-green-50",
          textColor: "text-green-600",
        };
      case EstadoTicketSoporte.CANCELADA:
        return {
          text: "Cancelada",
          bgColor: "bg-red-50",
          textColor: "text-red-600",
        };
      case EstadoTicketSoporte.ARCHIVADA:
        return {
          text: "Archivada",
          bgColor: "bg-gray-200",
          textColor: "text-gray-600",
        };
      default:
        return {
          text: "Desconocido",
          bgColor: "bg-gray-100",
          textColor: "text-gray-500",
        };
    }
  };

  console.log("La list de tickets es: ", tickets);

  const avatarColorsPastelStronger = [
    "bg-pink-300", // Rosa pastel más fuerte
    "bg-blue-300", // Azul pastel más fuerte
    "bg-green-300", // Verde pastel más fuerte
    "bg-yellow-300", // Amarillo pastel más fuerte
    "bg-indigo-300", // Índigo pastel más fuerte
    "bg-purple-300", // Morado pastel más fuerte
    "bg-teal-300", // Verde azulado pastel más fuerte
    "bg-lime-300", // Lima pastel más fuerte
  ];

  const [colorMap, setColorMap] = useState<Record<string, string>>({});

  const getRandomColor = () => {
    const randomIndex = Math.floor(
      Math.random() * avatarColorsPastelStronger.length
    );
    return avatarColorsPastelStronger[randomIndex];
  };

  // Efecto para inicializar los colores cuando los tickets cambian
  useEffect(() => {
    const newColorMap: Record<string, string> = { ...colorMap }; // Hacer una copia del colorMap actual

    tickets.forEach((ticket) => {
      if (!newColorMap[ticket.id]) {
        newColorMap[ticket.id] = getRandomColor();
      }
    });

    setColorMap(newColorMap); // Actualiza el colorMap
  }, [tickets]); // El efecto se ejecuta cuando la lista de tickets cambia

  // Filtros para cada pestaña
  const allActiveTickets = tickets.filter(
    (ticket) => ticket.status !== "RESUELTA" && ticket.status !== "ARCHIVADA"
  );
  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "EN_PROCESO"
  );
  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "RESUELTA"
  );
  const archivedTickets = tickets.filter(
    (ticket) => ticket.status === "ARCHIVADA"
  );

  // Mensajes para cuando no hay tickets
  const emptyMessages = {
    todos: {
      title: "Tickets Soporte",
      description: "Actualmente no hay tickets en línea",
    },
    enProceso: {
      title: "EN PROCESO",
      description: "Actualmente no hay tickets en proceso",
    },
    resueltos: {
      title: "Resueltos",
      description: "Actualmente no hay tickets resueltos",
    },
    archivados: {
      title: "Archivados",
      description: "Actualmente no hay tickets archivados",
    },
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="inbox" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-10 mb-2 md:mb-3">
          <TabsTrigger value="inbox" className="text-xs md:text-sm">
            TODOS
          </TabsTrigger>
          <TabsTrigger value="enProceso" className="text-xs md:text-sm">
            EN PROCESO
          </TabsTrigger>
          <TabsTrigger value="lista" className="text-xs md:text-sm">
            RESUELTOS
          </TabsTrigger>
          <TabsTrigger value="archivados" className="text-xs md:text-sm">
            ARCHIVADOS
          </TabsTrigger>
        </TabsList>

        {/* TODOS tab */}
        <TabsContent value="inbox" className="m-0 my-1">
          <TicketsList
            tickets={allActiveTickets}
            selectedTicketId={selectedTicketId}
            onSelectTicket={onSelectTicket}
            colorMap={colorMap}
            getBadgeProps={getBadgeProps}
            emptyMessage={emptyMessages.todos}
          />
        </TabsContent>

        {/* EN PROCESO tab */}
        <TabsContent value="enProceso" className="m-0 my-1">
          <TicketsList
            tickets={inProgressTickets}
            selectedTicketId={selectedTicketId}
            onSelectTicket={onSelectTicket}
            colorMap={colorMap}
            getBadgeProps={getBadgeProps}
            emptyMessage={emptyMessages.enProceso}
          />
        </TabsContent>

        {/* RESUELTOS tab */}
        <TabsContent value="lista" className="m-0 my-1">
          <TicketsList
            tickets={resolvedTickets}
            selectedTicketId={selectedTicketId}
            onSelectTicket={onSelectTicket}
            colorMap={colorMap}
            getBadgeProps={getBadgeProps}
            emptyMessage={emptyMessages.resueltos}
          />
        </TabsContent>

        {/* ARCHIVADOS tab */}
        <TabsContent value="archivados" className="m-0 my-1">
          <TicketsList
            tickets={archivedTickets}
            selectedTicketId={selectedTicketId}
            onSelectTicket={onSelectTicket}
            colorMap={colorMap}
            getBadgeProps={getBadgeProps}
            emptyMessage={emptyMessages.archivados}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

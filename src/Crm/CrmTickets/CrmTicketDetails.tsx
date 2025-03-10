"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Ellipsis, Send } from "lucide-react";
import type { Ticket } from "./ticketTypes";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.locale("es");
const formatearFecha = (fecha: string) => {
  return dayjs(fecha).format("DD MMMM YYYY hh:mm A");
};

interface TicketDetailProps {
  ticket: Ticket;
}

export default function TicketDetail({ ticket }: TicketDetailProps) {
  const [comment, setComment] = useState("");

  return (
    <div className="h-[calc(100vh-220px)] flex flex-col">
      <div className="border-b px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {ticket.assignee.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm text-muted-foreground">
                #{ticket.id} · {ticket.assignee.name} ·{" "}
                {formatearFecha(new Date(ticket.date).toISOString())}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-600">
              NUEVO
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Ellipsis />
            </Button>
          </div>
        </div>

        <h2 className="text-base font-semibold mt-2">{ticket.title}</h2>
        <p className="text-sm font-thin mb-1">{ticket.description}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* <div className="bg-muted/30 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">{ticket.creator.name}</span>
            <span className="text-sm text-muted-foreground">
              {formatearFecha(new Date(ticket.date).toISOString())}
            </span>
          </div>
          <p>{ticket.description}</p>
        </div> */}

        {ticket.comments &&
          ticket.comments.map((comment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-100 dark:bg-slate-900 rounded-lg py-2 px-3 mb-2"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm">{comment.user.name}</span>
                <span className="text-sm text-muted-foreground">
                  {formatearFecha(new Date(comment.date).toISOString())}
                </span>
              </div>
              <p className="text-sm ">{comment.text}</p>
            </motion.div>
          ))}
      </div>

      <div className="border-t p-4">
        <div className="relative flex items-center gap-3">
          <Textarea
            placeholder="Escriba un comentario"
            className="min-h-[50px] resize-none pr-12 flex-1"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center p-2"
            onClick={() => console.log("Enviar")}
          >
            <Send className="h-4 w-4 mr-2" />
            ENVIAR
          </Button>
        </div>
      </div>
    </div>
  );
}

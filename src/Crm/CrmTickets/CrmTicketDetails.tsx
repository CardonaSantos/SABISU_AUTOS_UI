"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Paperclip, Send } from "lucide-react";
import type { Ticket } from "./ticketTypes";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TicketDetailProps {
  ticket: Ticket;
}

export default function TicketDetail({ ticket }: TicketDetailProps) {
  const [comment, setComment] = useState("");

  return (
    <div className="h-[calc(100vh-220px)] flex flex-col">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-primary">
              <span className="text-xs font-medium">
                {ticket.assignee.initials}
              </span>
            </Avatar>
            <div>
              <div className="text-sm text-muted-foreground">
                #{ticket.id} · {ticket.assignee.name} ·{" "}
                {format(new Date(ticket.date), "dd MMM yyyy h:mm a", {
                  locale: es,
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Grupo:</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-600">
              NUEVO
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <span className="sr-only">Más opciones</span>
              <svg
                width="15"
                height="3"
                viewBox="0 0 15 3"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 1.5C1.5 1.91421 1.16421 2.25 0.75 2.25C0.335786 2.25 0 1.91421 0 1.5C0 1.08579 0.335786 0.75 0.75 0.75C1.16421 0.75 1.5 1.08579 1.5 1.5Z"
                  fill="currentColor"
                />
                <path
                  d="M8.25 1.5C8.25 1.91421 7.91421 2.25 7.5 2.25C7.08579 2.25 6.75 1.91421 6.75 1.5C6.75 1.08579 7.08579 0.75 7.5 0.75C7.91421 0.75 8.25 1.08579 8.25 1.5Z"
                  fill="currentColor"
                />
                <path
                  d="M15 1.5C15 1.91421 14.6642 2.25 14.25 2.25C13.8358 2.25 13.5 1.91421 13.5 1.5C13.5 1.08579 13.8358 0.75 14.25 0.75C14.6642 0.75 15 1.08579 15 1.5Z"
                  fill="currentColor"
                />
              </svg>
            </Button>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-2">{ticket.title}</h2>

        <div className="flex items-center gap-2 mt-2">
          <Button variant="outline" size="sm">
            + ADD TICKET TAG
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-muted/30 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">{ticket.creator.name}</span>
            <span className="text-sm text-muted-foreground">
              {format(new Date(ticket.date), "dd MMM yyyy h:mm a", {
                locale: es,
              })}
            </span>
          </div>
          <p>{ticket.description}</p>
        </div>

        {ticket.comments &&
          ticket.comments.map((comment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-muted/30 rounded-lg p-4 mb-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">{comment.user.name}</span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(comment.date), "dd MMM yyyy h:mm a", {
                    locale: es,
                  })}
                </span>
              </div>
              <p>{comment.text}</p>
            </motion.div>
          ))}
      </div>

      <div className="border-t p-4">
        <Tabs defaultValue="responder">
          <TabsList className="mb-4">
            <TabsTrigger value="responder">Responder</TabsTrigger>
            <TabsTrigger value="añadir">Añadir tarea</TabsTrigger>
          </TabsList>

          <TabsContent value="responder" className="m-0">
            <div className="relative">
              <Textarea
                placeholder="Escriba un comentario o adjunte un archivo"
                className="min-h-[80px] resize-none pr-12"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="h-4 w-4" />
                  <span className="sr-only">Adjuntar archivo</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Checkbox id="private" />
                <label htmlFor="private" className="text-sm">
                  Comentario privado
                </label>
              </div>

              <Button className="bg-amber-500 hover:bg-amber-600">
                <Send className="h-4 w-4 mr-2" />
                ENVIAR
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="añadir" className="m-0">
            <div className="p-4 text-center text-muted-foreground">
              Funcionalidad de añadir tarea no implementada
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

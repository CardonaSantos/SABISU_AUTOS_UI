"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Create a custom animated dialog content component
export const AnimatedDialogContent = motion(DialogContent);

export default function AnimatedDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Abrir Dialog Animado</Button>
        </DialogTrigger>

        {/* AnimatePresence is crucial for exit animations */}
        <AnimatePresence mode="wait">
          {open && (
            <AnimatedDialogContent
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col"
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Ticket className="h-5 w-5 text-primary" />
                  Dialog con Animación
                </DialogTitle>
                <DialogDescription>
                  Este dialog tiene animaciones suaves de entrada y salida
                </DialogDescription>
              </DialogHeader>

              <div className="py-6">
                <p>El contenido del dialog va aquí.</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cerrar
                </Button>
                <Button>Confirmar</Button>
              </div>
            </AnimatedDialogContent>
          )}
        </AnimatePresence>
      </Dialog>
    </div>
  );
}

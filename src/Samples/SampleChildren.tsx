import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface ChildrenProps {
  handleChangeInputs(
    evento: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void;

  usuario: Usuario;
}

interface Usuario {
  id: number;
  nombre: string;
  direccion?: string;
  numero: number;
  activo: boolean;
}

function SampleChildren({ handleChangeInputs, usuario }: ChildrenProps) {
  return (
    <div>
      <Card>
        <CardHeader>Contenido Formulario</CardHeader>
        <CardDescription>Descripcion de mi Card</CardDescription>
        <CardContent>
          <form>
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                name="nombre"
                value={usuario.nombre}
                onChange={handleChangeInputs}
              />

              <Label htmlFor="numero">numero</Label>
              <Input
                type="number"
                placeholder="Todos los inputs dan string"
                name="numero"
                value={usuario.numero}
                onChange={handleChangeInputs}
              />
            </div>
          </form>
        </CardContent>
      </Card>
      <h2>Children</h2>
      <p>{usuario.nombre}</p>
      <p>{usuario.direccion}</p>
      <p>{usuario.id}</p>
      <p>{usuario.numero}</p>
      <p>{usuario.activo}</p>
    </div>
  );
}

export default SampleChildren;

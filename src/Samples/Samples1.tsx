import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SampleChildren from "./SampleChildren";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

interface Usuario {
  id: number;
  nombre: string;
  direccion?: string;
  numero: number;
  activo: boolean;
}

function Samples1() {
  const [usuario, setUsuario] = useState<Usuario>({
    id: 0,
    nombre: "",
    direccion: "",
    numero: 0,
    activo: false,
  });

  //USE CALLBACK PARA FUNCIONES QUE SE PASAN COMO PROSP
  const handleChangeInputsVarios = useCallback(
    (evento: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = evento.target;

      setUsuario((prev) => ({
        ...prev,
        [name]: ["numero", "id"].includes(name) ? Number(value) : value,
      }));
    },
    []
  );

  //   const handleCheckBox=(eventoCheck:React.ChangeEvent<HTMLInputElement>)=>{
  //     const {name, checked}= eventoCheck.target

  //     setUsuario((prev)=> ({
  //         ...prev,
  //         [name]: checked
  //     }))
  //   }

  const handleChecked = (check: boolean) => {
    setUsuario((prev) => ({
      ...prev,
      activo: check,
    }));
  };

  console.log("El objeto creando es: ", usuario);

  return (
    <div className="container py-1 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2>Ejercicios</h2>
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
                  onChange={handleChangeInputsVarios}
                />

                <Label htmlFor="numero">numero</Label>
                <Input
                  type="number"
                  placeholder="Todos los inputs dan string"
                  name="numero"
                  value={usuario.numero}
                  onChange={handleChangeInputsVarios}
                />

                <Label htmlFor="activo">Activo</Label>
                <Checkbox
                  name="activo"
                  checked={usuario.activo}
                  onCheckedChange={handleChecked}
                />

                <Label htmlFor="activo">Activo Swtich</Label>
                <Switch
                  name="activo"
                  checked={usuario.activo}
                  onCheckedChange={handleChecked}
                />
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Datos de pruebas</CardTitle>
            <CardDescription>Estos son datos de pruebas XD</CardDescription>
          </CardHeader>

          <CardFooter>
            <div className="grid columns-1">
              <p>{usuario.nombre}</p>
              <p>{usuario.direccion}</p>
              <p>{usuario.numero}</p>
              <p>{usuario.id}</p>
              <p>{usuario.activo}</p>
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>Children</CardHeader>
          <CardContent>
            <SampleChildren
              usuario={usuario}
              handleChangeInputs={handleChangeInputsVarios}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default Samples1;

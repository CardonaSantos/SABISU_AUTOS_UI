import { useStore } from "@/components/Context/ContextSucursal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import React, { useState, FormEvent, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill"; // Importar React-Quill
import "react-quill/dist/quill.snow.css"; // Importar los estilos de Quill (puedes cambiar el tema si deseas)
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;
import Parchment from "parchment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";

Quill.register("modules/lineHeight", true);

const lineHeightConfig = {
  scope: Parchment.Scope.INLINE,
  whitelist: ["1", "1.5", "2", "3"],
};

const lineHeightStyle = new Parchment.Attributor.Style(
  "line-height",
  "line-height",
  lineHeightConfig
);
Quill.register(lineHeightStyle, true);

const CreatePlaceholder: React.FC = () => {
  const sucursalId = useStore((state) => state.sucursalId) ?? 0;
  const [editorValue, setEditorValue] = useState<string>(""); // Estado para el valor del editor
  const [nombrePlantilla, setNombrePlantilla] = useState<string>(""); // Estado para el nombre de la plantilla

  // Función para manejar cambios en el editor
  const handleEditorChange = (value: string): void => {
    setEditorValue(value);
  };

  // Función para manejar el envío de datos (creación de plantilla)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const data = {
      nombre: nombrePlantilla,
      texto: editorValue,
      sucursalId: sucursalId,
    };

    if (!data.nombre || !data.texto) {
      toast.info("Faltan datos");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/cuotas/plantilla-create`,
        data
      );
      if (response.status === 201) {
        toast.success("Plantilla creada");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al crear plantilla");
    }

    // Aquí puedes enviar `editorValue` a tu backend para crear la plantilla
    console.log("Nombre de la plantilla:", nombrePlantilla);
    console.log("Texto de la plantilla:", editorValue);
  };

  interface Plantillas {
    id: number;
    texto: string;
    nombre: string;
  }
  const [plantillas, setPlantillas] = useState<Plantillas[]>([]);

  const getAllPlantillas = async () => {
    try {
      const response = await axios.get(`${API_URL}/cuotas/get/plantillas`);
      if (response.status === 200) {
        setPlantillas(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };

  useEffect(() => {
    getAllPlantillas();
  }, []);

  console.log("las plantillas son: ", plantillas);

  const truncateText = (text: string, maxLength: number) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  const [idPlaceholder, setIdPlaceHolder] = useState<number>(0);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const deleteOnePlaceholder = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/cuotas/delete-one-placeholder/${idPlaceholder}`
      );
      if (response.status === 200) {
        toast.success("Plantilla eliminada");
        getAllPlantillas();
        setIsOpenDelete(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al eliminar la plantilla");
    }
  };

  console.log("El id es: ", idPlaceholder);

  return (
    <Tabs defaultValue="plantillas" className="w-full max-w-5xl mx-auto">
      <div className="flex w-full justify-center">
        <TabsList className="w-full flex">
          <TabsTrigger className="w-full text-center p-4" value="plantillas">
            Plantillas
          </TabsTrigger>
          <TabsTrigger
            className="w-full text-center p-4"
            value="crear-plantilla"
          >
            Crear Plantilla
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="plantillas" className="w-full">
        <p className="text-lg mb-6 font-semibold text-center">
          Aquí puedes ver tus plantillas existentes.
        </p>

        <Card className="shadow-xl">
          <CardContent>
            {plantillas && plantillas.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 py-4">
                {plantillas.map((plan) => (
                  <Card key={plan.id} className="p-4">
                    <CardHeader>
                      <h3 className="font-semibold text-lg">
                        Plantilla No. #{plan.id}: {plan.nombre}
                      </h3>
                    </CardHeader>
                    <CardContent>
                      {/* Previsualización truncada del contenido */}
                      <div
                        className="text-sm text-justify"
                        dangerouslySetInnerHTML={{
                          __html: `Contenido: ${truncateText(plan.texto, 700)}`,
                        }}
                      ></div>

                      {/* Botón para ver más detalles */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setIsOpenDelete(true);
                            setIdPlaceHolder(plan.id);
                          }}
                          className="mt-4"
                          variant="destructive"
                        >
                          Eliminar
                        </Button>
                        <Link to={`/edit/plantilla/${plan.id}`}>
                          <Button className="mt-4" variant="default">
                            Ver y Editar
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center">
                No hay plantillas disponibles.
              </p>
            )}
          </CardContent>
        </Card>
        <Dialog onOpenChange={setIsOpenDelete} open={isOpenDelete}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center p-2">
                ¿Estás seguro de querer eliminar esta plantilla?
              </DialogTitle>
              <DialogDescription className="text-center">
                No se podrá recuperar el registro
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2">
              <Button className="w-full" variant={"destructive"}>
                Cancelar
              </Button>

              <Button
                onClick={deleteOnePlaceholder}
                type="button"
                className="w-full"
                variant={"default"}
              >
                Si, continuar y eliminar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </TabsContent>

      <TabsContent value="crear-plantilla" className="w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Crear Plantilla de Contrato Crédito
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nombrePlantilla">Nombre de la plantilla</Label>
                <Input
                  id="nombrePlantilla"
                  type="text"
                  placeholder="Nombre de la plantilla"
                  value={nombrePlantilla}
                  onChange={(e) => setNombrePlantilla(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="textoPlantilla">Texto de la plantilla</Label>
                <div className="border rounded-md dark:border-gray-700">
                  <ReactQuill
                    id="textoPlantilla"
                    value={editorValue}
                    onChange={handleEditorChange}
                    placeholder="Escribir un modelo de contrato venta cuota"
                    theme="snow"
                    modules={{
                      toolbar: [
                        [{ size: ["small", false, "large", "huge"] }], // Tamaños predeterminados
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ align: [] }],
                        ["link"],
                        [{ color: [] }, { background: [] }],
                        ["clean"],
                      ],
                    }}
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Crear Plantilla
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default CreatePlaceholder;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;

interface Plantilla {
  id: number;
  texto: string;
  nombre: string;
}

function EditPlaceHolder() {
  const { id } = useParams();
  const [plantilla, setPlantilla] = useState<Plantilla>({
    id: 0,
    nombre: "",
    texto: "",
  }); // Estado para el nombre de la plantilla
  // Función para manejar cambios en el editor
  const handleEditorChange = (value: string): void => {
    setPlantilla((previaData) => ({
      ...previaData,
      texto: value,
    }));
  };

  const getPlantilla = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/cuotas/get/plantilla-to-edit/${id}`
      );
      if (response.status === 200) {
        setPlantilla(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir datos");
    }
  };

  useEffect(() => {
    if (id) {
      getPlantilla();
    }
  }, [id]);

  const submitEditPlantilla = async () => {
    try {
      const response = await axios.patch(
        `${API_URL}/cuotas/update-plantilla/${id}`,
        plantilla
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Plantilla actualizada correctamente");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al actualizar plantilla");
    }
  };

  return (
    <div className="space-y-2">
      <div className="py-5">
        <Button
          onClick={() => submitEditPlantilla()}
          className="w-full max-w-56"
          variant={"default"}
        >
          Actualizar
        </Button>
      </div>
      <div className="space-y-2">
        <Label htmlFor="nombrePlantilla">Nombre de la plantilla</Label>
        <Input
          id="nombrePlantilla"
          type="text"
          placeholder="Nombre de la plantilla"
          value={plantilla.nombre}
          onChange={(e) =>
            setPlantilla((previaData) => ({
              ...previaData,
              nombre: e.target.value,
            }))
          }
          className="w-full"
        />
      </div>

      <Label htmlFor="textoPlantilla">Texto de la plantilla</Label>
      <div className="border rounded-md dark:border-gray-700">
        <ReactQuill
          id="textoPlantilla"
          value={plantilla.texto}
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
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-xl"
        />
      </div>
    </div>
  );
}

export default EditPlaceHolder;

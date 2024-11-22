"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/components/Context/ContextSucursal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const API_URL = import.meta.env.VITE_API_URL;

interface DepositoFormData {
  monto: number;
  numeroBoleta: string;
  banco: string;
  usadoParaCierre: boolean;
  sucursalId: number;
  descripcion: string;
  usuarioId: number | null;
}

interface FormDataEgreso {
  monto: number;
  sucursalId: number;
  descripcion: string;
  usuarioId: number | null;
}

export default function RegistroDeposito() {
  const sucursalId = useStore((state) => state.sucursalId) ?? 0;
  const usuarioId = useStore((state) => state.userId) ?? 0;

  const [formDataEgreso, setFormDataEgreso] = useState<FormDataEgreso>({
    descripcion: "",
    monto: 0,
    sucursalId: sucursalId,
    usuarioId,
  });

  const [formData, setFormData] = useState<DepositoFormData>({
    monto: 0,
    numeroBoleta: "",
    banco: "",
    usadoParaCierre: false,
    sucursalId,
    usuarioId,
    descripcion: "",
  });

  const [errors, setErrors] = useState<Partial<DepositoFormData>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleInputChangeEgreso = (
    //ESPERAR UN OBJETO QUE PUEDE TENER DOS TIPOS, DE INPUT O TEXT AREA
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    //DEFINIR CONSTANTES QUE USAREMOS PARA LLENAR EL FORMULARIO
    const { name, value } = e.target; //que vienen del objeto e.target
    setFormDataEgreso((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log("Forma data de egreso: ", formDataEgreso);

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, usadoParaCierre: checked }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, banco: value }));
    setErrors((prev) => ({ ...prev, banco: "" }));
  };

  const validarFormulario = (): boolean => {
    if (
      formData.monto <= 0 ||
      !formData.monto ||
      !formData.numeroBoleta ||
      !formData.banco ||
      !formData.descripcion
    ) {
      toast.warning("Falta información");
      setTruncarDeposit(false);
      return false;
    }
    return true;
  };
  const [openConfirm, setOpenConfirm] = useState(false);
  const [truncarDeposito, setTruncarDeposit] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    if (truncarDeposito) return;
    e.preventDefault();
    setTruncarDeposit(true);
    if (!validarFormulario()) return;

    try {
      const response = await axios.post(
        `${API_URL}/caja/create-deposit`,
        formData
      );
      if (response.status === 201) {
        toast.success("El depósito se ha registrado correctamente.");
        setFormData({
          monto: 0,
          numeroBoleta: "",
          banco: "",
          usadoParaCierre: false,
          sucursalId,
          descripcion: "",
          usuarioId,
        });
        setOpenConfirm(false);
        setTruncarDeposit(false);
      }
    } catch (error) {
      toast.error("No se pudo registrar el depósito. Intente nuevamente.");
      setTruncarDeposit(false);
    }
  };

  const [openEgreso, setOpenEgreso] = useState(false);
  const [truncarEgreso, setTruncarEgreso] = useState(false);
  const handleSubmitEgreso = async (e: React.FormEvent) => {
    if (truncarEgreso) return;
    setTruncarEgreso(true);

    e.preventDefault();
    if (!formDataEgreso.monto || !formDataEgreso.descripcion) {
      toast.warning("Falta información");
      setTruncarEgreso(false);

      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/caja/create-egreso`,
        formDataEgreso
      );
      if (response.status === 201) {
        toast.success("El egreso se ha registrado correctamente.");
        setFormDataEgreso({
          monto: 0,
          sucursalId,
          descripcion: "",
          usuarioId,
        });
        setTruncarEgreso(false);
        setOpenEgreso(false);
      }
    } catch (error) {
      toast.error("No se pudo registrar el depósito. Intente nuevamente.");
      setTruncarEgreso(false);
    }
  };
  console.log("La data a enviar: ", formData);

  return (
    <Tabs defaultValue="account" className="max-w-5xl mx-auto mt-10">
      <TabsList className="flex justify-center gap-4 mb-6">
        <TabsTrigger value="account" className="flex-1 text-center">
          Registrar Depósito
        </TabsTrigger>
        <TabsTrigger value="password" className="flex-1 text-center">
          Registrar Egreso
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card className="w-full shadow-lg border rounded-lg">
          <CardHeader className="text-center">
            <CardTitle>Registro de Depósito</CardTitle>
            <CardDescription>
              Ingrese los detalles del depósito para la sucursal
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monto">Monto</Label>
                  <Input
                    id="monto"
                    name="monto"
                    type="number"
                    step="0.01"
                    value={formData.monto}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                  {errors.monto && (
                    <p className="text-sm text-red-500">{errors.monto}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroBoleta">Número de Boleta</Label>
                  <Input
                    id="numeroBoleta"
                    name="numeroBoleta"
                    value={formData.numeroBoleta}
                    onChange={handleInputChange}
                    placeholder="Ingrese el número de boleta"
                  />
                  {errors.numeroBoleta && (
                    <p className="text-sm text-red-500">
                      {errors.numeroBoleta}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="banco">Banco</Label>
                  <Select onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un banco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BANRURAL">BANRURAL</SelectItem>
                      <SelectItem value="BANCO INDUSTRIAL">
                        BANCO INDUSTRIAL
                      </SelectItem>
                      <SelectItem value="YAMAN KUTX MICOOPE">
                        YAMAN KUTX MICOOPE
                      </SelectItem>
                      <SelectItem value="OTRO">OTRO</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.banco && (
                    <p className="text-sm text-red-500">{errors.banco}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    placeholder="Ingrese una descripción (opcional)"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="usadoParaCierre"
                  checked={formData.usadoParaCierre}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="usadoParaCierre">Usado para cierre</Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                onClick={() => setOpenConfirm(true)}
                type="button"
                className="w-full max-w-xs"
              >
                Registrar Depósito
              </Button>
            </CardFooter>
          </form>
          <Dialog onOpenChange={setOpenConfirm} open={openConfirm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center">
                  Confirmación de Registro de Depósito
                </DialogTitle>
                <DialogDescription className="text-center">
                  ¿Estás seguro de crear el registro con esta información? La
                  acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <Button
                disabled={truncarDeposito}
                onClick={handleSubmit}
                className="w-full"
              >
                Si, continuar
              </Button>
            </DialogContent>
          </Dialog>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card className="w-full shadow-lg border rounded-lg">
          <CardHeader className="text-center">
            <CardTitle>Registro de Egreso</CardTitle>
            <CardDescription>Ingrese los detalles del egreso</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmitEgreso}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1  gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monto">Monto</Label>
                  <Input
                    id="monto"
                    name="monto"
                    type="number"
                    step="1"
                    value={formDataEgreso.monto}
                    onChange={handleInputChangeEgreso}
                    placeholder="0.00"
                  />
                  {errors.monto && (
                    <p className="text-sm text-red-500">{errors.monto}</p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    name="descripcion"
                    value={formDataEgreso.descripcion}
                    onChange={handleInputChangeEgreso}
                    placeholder="Ingrese una descripción"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                disabled={truncarEgreso}
                type="button"
                className="w-full max-w-xs"
                onClick={() => setOpenEgreso(true)}
              >
                Registrar Egreso
              </Button>
            </CardFooter>
          </form>

          <Dialog onOpenChange={setOpenEgreso} open={openEgreso}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center">
                  Confirmación de Registro de Egreso
                </DialogTitle>
                <DialogDescription className="text-center">
                  ¿Estás seguro de crear el registro con esta información? La
                  acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <Button
                disabled={truncarEgreso}
                onClick={handleSubmitEgreso}
                className="w-full"
              >
                Si, continuar
              </Button>
            </DialogContent>
          </Dialog>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

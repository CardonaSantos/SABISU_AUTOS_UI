import { useStore } from "@/components/Context/ContextSucursal";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Coins,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.locale("es");
const formatearFecha = (fecha: string) => {
  return dayjs(fecha).format("DD MMMM YYYY hh:mm A");
};

type User = {
  id: number;
  nombre: string;
  rol: string;
};

type Deposit = {
  id: number;
  banco: string;
  descripcion: string;
  fechaDeposito: string;
  monto: number;
  numeroBoleta: string;
  usadoParaCierre: boolean;
  usuario: User;
};

type Expense = {
  id: number;
  descripcion: string;
  fechaEgreso: string;
  monto: number;
  usuario: User;
};

interface SucursalSaldo {
  id: number;
  sucursalId: number;
  saldoAcumulado: number;
  totalIngresos: number;
  totalEgresos: number;
  actualizadoEn: string;
}

function BalanceSucursal() {
  const sucursalId = useStore((state) => state.sucursalId);

  const [depositos, setDepositos] = useState<Deposit[]>([]);

  const [egresos, setEgresos] = useState<Expense[]>([]);

  const [saldos, setSaldos] = useState<SucursalSaldo>();

  const getDepositos = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/sucursal-saldo/get-sucursal-deposits/${sucursalId}`
      );
      if (response.status === 200) {
        setDepositos(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("No se pudieron cargar los registros");
    }
  };

  const getEgresos = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/sucursal-saldo/get-sucursal-egresos/${sucursalId}`
      );
      if (response.status === 200) {
        setEgresos(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("No se pudieron cargar los registros");
    }
  };

  const getSucursalSaldo = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/sucursal-saldo/${sucursalId}`
      );

      if (response.status === 200) {
        setSaldos(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir registros");
    }
  };

  useEffect(() => {
    getDepositos();
    getEgresos();
    getSucursalSaldo();
  }, [sucursalId]);

  console.log("Los depositos: ", depositos);
  console.log("Los egresos: ", egresos);

  type ComponenteMapeaDepositosProps = {
    deposito: Deposit[];
  };

  type ComponenteMapeaEgresosProps = {
    egreso: Expense[];
  };

  function ComponenteMapeaDepositos({
    deposito,
  }: ComponenteMapeaDepositosProps) {
    //=============PAGINACION
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;
    const totalPages = deposito?.length
      ? Math.ceil(deposito.length / itemsPerPage)
      : 1;

    // Calcular el índice del último elemento de la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    // Calcular el índice del primer elemento de la página actual
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // Obtener los elementos de la página actual
    const currentItems = deposito
      ? deposito.slice(indexOfFirstItem, indexOfLastItem)
      : [];

    // Cambiar de página
    const onPageChange = (page: number) => {
      setCurrentPage(page);
    };

    return (
      <>
        <Table>
          <TableCaption>Una lista de sus depósitos.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="">No.</TableHead>
              <TableHead>Banco</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead className="text-right">Fecha</TableHead>
              <TableHead className="text-right">Registrado Por</TableHead>
              <TableHead className="text-right">Descripción</TableHead>
              <TableHead className="text-right">Usado para cierre</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((dep) => (
                <TableRow key={dep?.id || `row-${Math.random()}`}>
                  <TableCell className="font-medium">
                    #{dep?.id || "N/A"}
                  </TableCell>
                  <TableCell>{dep?.banco || "No disponible"}</TableCell>
                  <TableCell>
                    {dep?.monto !== undefined
                      ? new Intl.NumberFormat("es-GT", {
                          style: "currency",
                          currency: "GTQ",
                        }).format(dep.monto)
                      : "No disponible"}
                  </TableCell>
                  <TableCell className="text-right">
                    {dep?.fechaDeposito
                      ? formatearFecha(dep.fechaDeposito)
                      : "Sin fecha"}
                  </TableCell>
                  <TableCell className="text-right">
                    {dep?.usuario?.nombre || "N/A"}{" "}
                    {dep?.usuario?.rol ? `(${dep.usuario.rol})` : ""}
                  </TableCell>
                  <TableCell className="text-right">
                    {dep?.descripcion || "No disponible"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={dep?.usadoParaCierre ? "default" : "secondary"}
                    >
                      {dep?.usadoParaCierre ? "Sí" : "No"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No hay depósitos disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-center py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button onClick={() => onPageChange(1)}>Primero</Button>
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </PaginationPrevious>
              </PaginationItem>

              {/* Sistema de truncado */}
              {currentPage > 3 && (
                <>
                  <PaginationItem>
                    <PaginationLink onClick={() => onPageChange(1)}>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <span className="text-muted-foreground">...</span>
                  </PaginationItem>
                </>
              )}

              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                if (
                  page === currentPage ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => onPageChange(page)}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              })}

              {currentPage < totalPages - 2 && (
                <>
                  <PaginationItem>
                    <span className="text-muted-foreground">...</span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink onClick={() => onPageChange(totalPages)}>
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    onPageChange(Math.min(totalPages, currentPage + 1))
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </PaginationNext>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant={"destructive"}
                  onClick={() => onPageChange(totalPages)}
                >
                  Último
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </>
    );
  }

  function ComponenteMapeaEgresos({ egreso }: ComponenteMapeaEgresosProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;

    // Manejo de egresos vacíos o nulos
    const totalItems = egreso?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Calcular el índice del último elemento de la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    // Calcular el índice del primer elemento de la página actual
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // Obtener los elementos de la página actual
    const currentItems = egreso?.slice(indexOfFirstItem, indexOfLastItem) || [];

    // Cambiar de página
    const onPageChange = (page: number) => {
      setCurrentPage(page);
    };

    return (
      <>
        {totalItems > 0 ? (
          <>
            <Table>
              <TableCaption>Una lista de sus egresos.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="">No.</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead className="text-right">Fecha</TableHead>
                  <TableHead className="text-right">Registrado por</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((egreso) => (
                  <TableRow key={egreso.id}>
                    <TableCell className="font-medium">#{egreso.id}</TableCell>
                    <TableCell>
                      {egreso.descripcion ? egreso.descripcion : "N/A"}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("es-GT", {
                        style: "currency",
                        currency: "GTQ",
                      }).format(egreso.monto)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatearFecha(egreso.fechaEgreso)}
                    </TableCell>
                    <TableCell className="text-right">
                      {egreso.usuario?.nombre || "N/A"}{" "}
                      {egreso.usuario?.rol ? `(${egreso.usuario.rol})` : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-center py-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Button onClick={() => onPageChange(1)}>Primero</Button>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </PaginationPrevious>
                  </PaginationItem>

                  {/* Sistema de truncado */}
                  {currentPage > 3 && (
                    <>
                      <PaginationItem>
                        <PaginationLink onClick={() => onPageChange(1)}>
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <span className="text-muted-foreground">...</span>
                      </PaginationItem>
                    </>
                  )}

                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;
                    if (
                      page === currentPage ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={index}>
                          <PaginationLink
                            onClick={() => onPageChange(page)}
                            isActive={page === currentPage}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  {currentPage < totalPages - 2 && (
                    <>
                      <PaginationItem>
                        <span className="text-muted-foreground">...</span>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => onPageChange(totalPages)}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        onPageChange(Math.min(totalPages, currentPage + 1))
                      }
                    >
                      <ChevronRight className="h-4 w-4" />
                    </PaginationNext>
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      variant={"destructive"}
                      onClick={() => onPageChange(totalPages)}
                    >
                      Último
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              No hay egresos registrados para mostrar.
            </p>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="w-full mt-2">
      <Tabs defaultValue="saldo" className="w-full">
        <TabsList className="w-full flex justify-between">
          <TabsTrigger value="saldo" className="flex-1">
            Saldo Sucursal
          </TabsTrigger>
          <TabsTrigger value="depositos" className="flex-1">
            Depósitos
          </TabsTrigger>
          <TabsTrigger value="egresos" className="flex-1">
            Egresos
          </TabsTrigger>
        </TabsList>
        <TabsContent
          className="flex justify-center items-center p-4"
          value="saldo"
        >
          <Card className="w-full max-w-4xl mx-auto shadow-xl">
            <CardHeader>
              <CardTitle className="text-center">Saldo de Sucursal</CardTitle>
              <CardDescription className="text-center">
                Aquí puedes ver los saldos de la sucursal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                {/* Contenido dinámico */}
                <p className="text-center font-semibold flex items-center justify-center">
                  <Coins
                    style={{
                      color: "#FACC15", // Dorado neutro para saldo actual
                    }}
                    className="mr-2 "
                  />
                  Saldo actual:{" "}
                  {new Intl.NumberFormat("es-GT", {
                    style: "currency",
                    currency: "GTQ",
                  }).format(saldos?.saldoAcumulado || 0)}
                </p>
                <p className="text-center font-semibold flex items-center justify-center">
                  <ArrowDown
                    style={{
                      color: "#EF4444", // Rojo neutro para egresos
                    }}
                    className="mr-2"
                  />
                  Total Egresos:{" "}
                  {new Intl.NumberFormat("es-GT", {
                    style: "currency",
                    currency: "GTQ",
                  }).format(saldos?.totalEgresos || 0)}
                </p>
                <p className="text-center font-semibold flex items-center justify-center">
                  <ArrowUp
                    style={{
                      color: "#22C55E", // Verde neutro para ingresos
                    }}
                    className="mr-2"
                  />
                  Total Ingresos:{" "}
                  {new Intl.NumberFormat("es-GT", {
                    style: "currency",
                    currency: "GTQ",
                  }).format(saldos?.totalIngresos || 0)}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between"></CardFooter>
          </Card>
        </TabsContent>
        <TabsContent
          className=" justify-center items-center p-4"
          value="depositos"
        >
          <h2 className="text-center text-lg font-bold mb-4">
            Registros de depósitos
          </h2>

          <ComponenteMapeaDepositos deposito={depositos} />
        </TabsContent>
        <TabsContent
          className="justify-center items-center p-4"
          value="egresos"
        >
          <h2 className="text-center text-lg font-bold mb-4">
            Registros de Egresos
          </h2>
          <ComponenteMapeaEgresos egreso={egresos} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default BalanceSucursal;

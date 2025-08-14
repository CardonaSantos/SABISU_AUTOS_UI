import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Database, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Table from "./Table/Table";
import {
  RegistroCajaResponse,
  PaginatedRegistrosCajaResponse,
} from "./interfaces/registroscajas.interfaces";
import { getRegistrosCajas } from "./API/api"; // Asumiendo que existe
import { useStore } from "@/components/Context/ContextSucursal";

const DesvanecerHaciaArriba = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

function CajaRegistros() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const sucursalIdFromStore = useStore((state) => state.sucursalId) ?? 0;
  const [pageData, setPageData] =
    useState<PaginatedRegistrosCajaResponse | null>(null);

  const rows: RegistroCajaResponse[] = pageData?.items ?? [];

  const getData = async () => {
    setLoading(true);
    try {
      const dt = await getRegistrosCajas({
        page,
        limit,
        sucursalId:
          typeof sucursalIdFromStore === "number" && sucursalIdFromStore >= 1
            ? sucursalIdFromStore
            : undefined,
      });
      setPageData(dt);
    } catch (error) {
      console.error("Error al obtener registros de caja:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [page, limit, sucursalIdFromStore]);

  const refreshData = () => {
    getData();
  };

  return (
    <motion.div
      className="container mx-auto space-y-4 p-3" // Reducido padding y espacio
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header compacto */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h1 className="text-lg font-bold tracking-tight">
                  Registros de Cajas
                </h1>
                <p className="text-muted-foreground text-sm">
                  Gestiona y monitorea tus registros de cajas de todas las
                  sucursales
                </p>
              </div>
              <div className="flex items-center gap-2">
                {pageData && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Database className="h-3 w-3" />
                    <span>{pageData.total} registros</span>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshData}
                  disabled={loading}
                  className="gap-1.5 h-8 text-xs bg-transparent" // Más compacto
                >
                  <RefreshCw
                    className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
                  />
                  Actualizar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs compactos */}
      <motion.div variants={itemVariants}>
        <Tabs className="w-full" defaultValue="registrarcaja">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 h-auto p-0.5 bg-muted">
            <TabsTrigger
              value="registrarcaja"
              className="w-full text-xs md:text-sm py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all" // Reducido padding y tamaño de texto
            >
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3 w-3" />
                <span className="truncate">Registros de Caja</span>
                {rows.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs px-1">
                    {rows.length}
                  </Badge>
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="movimientoscaja"
              className="w-full text-xs md:text-sm py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
            >
              <div className="flex items-center gap-1.5">
                <Database className="h-3 w-3" />
                <span className="truncate">Movimientos de Caja</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="registrarcaja" className="mt-4">
            <motion.div {...DesvanecerHaciaArriba} className="w-full">
              {loading ? (
                <Card>
                  <CardContent className="py-8">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />{" "}
                      <div className="text-muted-foreground text-sm">
                        Cargando registros...
                      </div>{" "}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Table
                  data={rows}
                  page={page}
                  limit={limit}
                  pages={pageData?.pages ?? 0}
                  total={pageData?.total ?? 0}
                  loading={loading}
                  onChangePage={setPage}
                  onChangeLimit={setLimit}
                />
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="movimientoscaja" className="mt-4">
            <motion.div {...DesvanecerHaciaArriba}>
              <Card>
                <CardContent className="py-8">
                  <div className="text-center space-y-3">
                    <div className="text-2xl">🚧</div> {/* Reducido tamaño */}
                    <div className="text-lg font-semibold">
                      Próximamente
                    </div>{" "}
                    <div className="text-muted-foreground text-sm">
                      La sección de movimientos estará disponible pronto
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

export default CajaRegistros;

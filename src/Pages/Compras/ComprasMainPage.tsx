"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, AlertCircle } from "lucide-react";
import { getRegistrosComprasConDetalle } from "./API/api";
import { PaginatedComprasResponse } from "./Interfaces/Interfaces1";
import { GetRegistrosComprasQuery } from "./API/interfaceQuery";
import { ComprasTable } from "./compras-table";

export function ComprasMainPage() {
  const [dataComprasWithPagination, setDataComprasWithPagination] =
    useState<PaginatedComprasResponse>({
      total: 0,
      page: 1,
      limit: 10,
      pages: 0,
      items: [],
    });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Query parameters for filtering
  const [queryParams, setQueryParams] = useState<GetRegistrosComprasQuery>({
    page: 1,
    limit: 10,
    withDetalles: true,
  });

  const getDataCompras = async (
    params: GetRegistrosComprasQuery = queryParams
  ) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getRegistrosComprasConDetalle(params);
      setDataComprasWithPagination(res);
    } catch (error) {
      console.log("El error es: ", error);
      setError("Error al cargar los datos de compras");
      toast.error("Error al cargar los datos de compras");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when query params change
  useEffect(() => {
    getDataCompras(queryParams);
  }, [queryParams]);

  const handleChangePage = (newPage: number) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleChangeLimit = (newLimit: number) => {
    setQueryParams((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  if (loading && dataComprasWithPagination.items.length === 0) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Gestión de Compras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error al cargar datos</h3>
          <p className="text-muted-foreground text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Gestión de Compras
          </CardTitle>
        </CardHeader>
      </Card>

      <ComprasTable
        data={dataComprasWithPagination.items}
        page={dataComprasWithPagination.page}
        limit={dataComprasWithPagination.limit}
        pages={dataComprasWithPagination.pages}
        total={dataComprasWithPagination.total}
        loading={loading}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />
    </div>
  );
}

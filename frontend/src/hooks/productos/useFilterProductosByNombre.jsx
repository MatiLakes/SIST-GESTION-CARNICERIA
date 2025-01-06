import { useCallback } from "react";
import { filterProductosByNombre } from "@services/producto.service";

const useFilterProductosByNombre = (setProductos) => {
  const filterByNombre = useCallback(
    async (nombre) => {
      try {
        const productosFiltrados = await filterProductosByNombre(nombre);
        setProductos(productosFiltrados);
      } catch (error) {
        console.error("Error al filtrar por nombre:", error);
      }
    },
    [setProductos]
  );

  return { filterByNombre };
};

export default useFilterProductosByNombre;

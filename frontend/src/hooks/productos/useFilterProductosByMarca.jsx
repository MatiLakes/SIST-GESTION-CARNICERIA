import { useCallback } from "react";
import { filterProductosByMarca } from "@services/producto.service";

const useFilterProductosByMarca = (setProductos) => {
  const filterByMarca = useCallback(
    async (nombreMarca) => {
      try {
        const productosFiltrados = await filterProductosByMarca(nombreMarca);
        setProductos(productosFiltrados);
      } catch (error) {
        console.error("Error al filtrar por marca:", error);
      }
    },
    [setProductos]
  );

  return { filterByMarca };
};

export default useFilterProductosByMarca;

import { useCallback } from "react";
import { filterProductosByTipo } from "@services/producto.service";

const useFilterProductosByTipo = (setProductos) => {
  const filterByTipo = useCallback(
    async (nombreTipo) => {
      try {
        const productosFiltrados = await filterProductosByTipo(nombreTipo);
        console.log("Productos filtrados:", productosFiltrados); // Verifica qué se recibe
        setProductos(productosFiltrados);
      } catch (error) {
        console.error("Error al filtrar por tipo:", error);
      }
    },
    [setProductos]
  );

  return { filterByTipo };
};

export default useFilterProductosByTipo;

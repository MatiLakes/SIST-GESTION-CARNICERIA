import { deleteProducto } from "@services/producto.service.js";

const useDeleteProducto = (fetchProductos) => {
  const remove = async (id) => {
    try {
      await deleteProducto(id);
      fetchProductos(); // Actualiza la lista de productos después de eliminar uno
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  return { remove };
};

export default useDeleteProducto;

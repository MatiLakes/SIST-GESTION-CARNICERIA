import { updateProducto } from "@services/producto.service.js";

const useEditProducto = (fetchProductos) => {
  const edit = async (id, updatedProducto) => {
    try {
      await updateProducto(id, updatedProducto);
      fetchProductos(); // Actualiza la lista de productos después de editar uno
    } catch (error) {
      console.error("Error al editar el producto:", error);
    }
  };

  return { edit };
};

export default useEditProducto;

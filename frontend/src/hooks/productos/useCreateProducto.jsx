import { createProducto } from "@services/producto.service.js";

const useCreateProducto = (fetchProductos) => {
  const create = async (productoData) => {
    try {
      await createProducto(productoData);
      fetchProductos(); // Actualiza la lista de productos después de crear uno nuevo
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  };

  return { create };
};

export default useCreateProducto;

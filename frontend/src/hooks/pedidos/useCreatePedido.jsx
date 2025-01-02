import { createPedido } from "@services/pedido.service.js";

const useCreatePedido = () => {
  const create = async (pedidoData) => {
    try {
      const response = await createPedido(pedidoData);
      return response;
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      throw new Error("No se pudo crear el pedido.");
    }
  };

  return { create };
};

export default useCreatePedido; // Exportación predeterminada

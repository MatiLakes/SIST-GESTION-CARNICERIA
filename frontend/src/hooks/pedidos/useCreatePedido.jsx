import { createPedido } from "@services/pedido.service.js";

const useCreatePedido = (fetchPedidos) => {
  const create = async (pedidoData) => {
    try {
      const response = await createPedido(pedidoData);
      console.log("Pedido creado con éxito:", response);

      // Vuelve a obtener los pedidos después de crear uno nuevo
      if (fetchPedidos) {
        await fetchPedidos();
      }

      return response;
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      throw new Error("No se pudo crear el pedido.");
    }
  };

  return { create };
};

export default useCreatePedido;


import { useState } from "react";
import { updatePedido } from "@services/pedido.service.js";

const useEditPedido = (fetchPedidos) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const edit = async (id, updatedPedido) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updatePedido(id, updatedPedido);
      console.log("Pedido actualizado:", response);

      // Llama a fetchPedidos para recargar los datos
      if (fetchPedidos) {
        await fetchPedidos();
      }

      return response; // Retorna el pedido actualizado
    } catch (err) {
      setError(err.message);
      console.error("Error al editar pedido:", err);
      throw err; // Lanza el error para que el componente lo maneje si es necesario
    } finally {
      setLoading(false);
    }
  };

  return { edit, loading, error };
};

export default useEditPedido;

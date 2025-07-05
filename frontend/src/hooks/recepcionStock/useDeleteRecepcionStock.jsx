import { useState } from "react";
import { deleteRecepcionStock } from "@services/recepcionStock.service.js";

const useDeleteRecepcionStock = (fetchCallback) => {
  const [loading, setLoading] = useState(false);

  const remove = async (id) => {
    setLoading(true);
    try {
      await deleteRecepcionStock(id);
      if (fetchCallback) {
        await fetchCallback();
      }
    } catch (error) {
      console.error("Error al eliminar la recepción de stock:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading };
};

export default useDeleteRecepcionStock;

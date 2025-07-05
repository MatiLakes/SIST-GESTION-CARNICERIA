import { useState } from "react";
import { updateRecepcionStock } from "@services/recepcionStock.service.js";

const useEditRecepcionStock = (fetchCallback) => {
  const [loading, setLoading] = useState(false);

  const edit = async (id, recepcionData) => {
    setLoading(true);
    try {
      const response = await updateRecepcionStock(id, recepcionData);
      if (fetchCallback) {
        await fetchCallback();
      }
      return response;
    } catch (error) {
      console.error("Error al editar la recepción de stock:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { edit, loading };
};

export default useEditRecepcionStock;

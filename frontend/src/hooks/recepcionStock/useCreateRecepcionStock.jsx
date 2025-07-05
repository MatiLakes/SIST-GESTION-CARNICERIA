import { useState } from "react";
import { createRecepcionStock } from "@services/recepcionStock.service.js";

const useCreateRecepcionStock = (fetchCallback) => {
  const [loading, setLoading] = useState(false);

  const create = async (recepcionData) => {
    setLoading(true);
    try {
      const response = await createRecepcionStock(recepcionData);
      if (fetchCallback) {
        await fetchCallback();
      }
      return response;
    } catch (error) {
      console.error("Error al crear recepción de stock:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
};

export default useCreateRecepcionStock;

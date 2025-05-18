"use strict";

import { useState } from "react";
import { updatePagoPendiente } from "@services/pagoPendiente.service.js";

const useEditPagoPendiente = (fetchPagosPendientes) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const edit = async (id, updatedPago) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updatePagoPendiente(id, updatedPago);
      console.log("Pago pendiente actualizado:", response);

      if (fetchPagosPendientes) {
        await fetchPagosPendientes();
      }

      return response;
    } catch (err) {
      setError(err.message);
      console.error("Error al editar pago pendiente:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { edit, loading, error };
};

export default useEditPagoPendiente;

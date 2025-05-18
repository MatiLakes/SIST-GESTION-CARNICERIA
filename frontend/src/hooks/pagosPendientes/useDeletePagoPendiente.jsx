"use strict";

import { useState } from "react";
import { deletePagoPendiente } from "@services/pagoPendiente.service.js";

const useDeletePagoPendiente = (fetchPagosPendientes) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const remove = async (id) => {
    setLoading(true);
    try {
      await deletePagoPendiente(id);
      console.log(`Pago pendiente con ID ${id} eliminado con éxito`);

      if (fetchPagosPendientes) {
        await fetchPagosPendientes();
      }
    } catch (err) {
      setError(err.message);
      console.error("Error al eliminar pago pendiente:", err);
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
};

export default useDeletePagoPendiente;

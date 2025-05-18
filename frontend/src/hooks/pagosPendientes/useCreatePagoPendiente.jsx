"use strict";

import { createPagoPendiente } from "@services/pagoPendiente.service.js";

const useCreatePagoPendiente = (fetchPagosPendientes) => {
  const create = async (pagoData) => {
    try {
      const response = await createPagoPendiente(pagoData);
      console.log("Pago pendiente creado con éxito:", response);

      if (fetchPagosPendientes) {
        await fetchPagosPendientes();
      }

      return response;
    } catch (error) {
      console.error("Error al crear el pago pendiente:", error);
      throw new Error("No se pudo crear el pago pendiente.");
    }
  };

  return { create };
};

export default useCreatePagoPendiente;

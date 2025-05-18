"use strict";

import { updateCliente } from "@services/cliente.service.js";

const useEditCliente = (fetchClientes) => {
  const edit = async (id, clienteData) => {
    try {
      const response = await updateCliente(id, clienteData);
      console.log("Cliente actualizado:", response);
      if (fetchClientes) fetchClientes();
      return response;
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      throw error;
    }
  };

  return { edit };
};

export default useEditCliente;

"use strict";

import { createCliente } from "@services/cliente.service.js";

const useCreateCliente = (fetchClientes) => {
  const create = async (clienteData) => {
    try {
      const response = await createCliente(clienteData);
      console.log("Cliente creado:", response);
      if (fetchClientes) fetchClientes();
      return response;
    } catch (error) {
      console.error("Error al crear cliente:", error);
      throw error;
    }
  };

  return { create };
};

export default useCreateCliente;

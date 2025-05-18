"use strict";

import { deleteCliente } from "@services/cliente.service.js";

const useDeleteCliente = (fetchClientes) => {
  const remove = async (id) => {
    try {
      await deleteCliente(id);
      console.log(`Cliente con ID ${id} eliminado.`);
      if (fetchClientes) fetchClientes();
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      throw error;
    }
  };

  return { remove };
};

export default useDeleteCliente;

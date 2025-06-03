import { updateTipo } from "@services/tipo.service.js";

const useEditTipo = (fetchTipos) => {
  const edit = async (id, updatedTipo) => {
    try {
      await updateTipo(id, updatedTipo);
      fetchTipos(); // Actualiza la lista de tipos después de editar uno
    } catch (error) {
      console.error("Error al editar el tipo:", error);
    }
  };

  return { edit };
};

export default useEditTipo;
import { updateMerma } from "@services/merma.service.js";

const useEditMerma = (fetchMermas) => {
  const edit = async (id, mermaData) => {
    try {
      const response = await updateMerma(id, mermaData);
      fetchMermas(); // Actualiza la lista después de editar
      return response;
    } catch (error) {
      console.error("Error al editar la merma:", error);
      throw error;
    }
  };

  return { edit };
};

export default useEditMerma;

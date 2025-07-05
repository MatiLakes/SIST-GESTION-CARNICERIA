import { deleteMerma } from "@services/merma.service.js";

const useDeleteMerma = (fetchMermas) => {
  const remove = async (id) => {
    try {
      await deleteMerma(id);
      fetchMermas(); // Actualiza la lista después de eliminar
    } catch (error) {
      console.error("Error al eliminar la merma:", error);
      throw error;
    }
  };

  return { remove };
};

export default useDeleteMerma;

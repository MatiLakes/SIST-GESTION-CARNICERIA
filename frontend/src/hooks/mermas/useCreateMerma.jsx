import { createMerma } from "@services/merma.service.js";

const useCreateMerma = (fetchMermas) => {
  const create = async (mermaData) => {
    try {
      const response = await createMerma(mermaData);
      fetchMermas(); // Actualiza la lista de mermas después de crear una nueva
      return response;
    } catch (error) {
      console.error("Error al crear la merma:", error);
      throw error;
    }
  };

  return { create };
};

export default useCreateMerma;

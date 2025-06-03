import { updateMarca } from "@services/marca.service.js";

const useEditMarca = (fetchMarcas) => {
  const edit = async (id, updatedMarca) => {
    try {
      await updateMarca(id, updatedMarca);
      fetchMarcas(); // Actualiza la lista de marcas después de editar una
    } catch (error) {
      console.error("Error al editar la marca:", error);
    }
  };

  return { edit };
};

export default useEditMarca;
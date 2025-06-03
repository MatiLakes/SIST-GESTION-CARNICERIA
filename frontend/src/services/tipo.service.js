import axiosInstance from "./root.service";

// Obtener todos los tipos de producto
export const getTipos = async () => {
  try {
    const response = await axiosInstance.get("/tipos-productos");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los tipos de productos:", error);
    throw error;
  }
};

// Crear un nuevo tipo de producto
export const createTipo = async (tipoData) => {
  try {
    const response = await axiosInstance.post("/tipos-productos", tipoData);
    return response.data;
  } catch (error) {
    console.error("Error al crear el tipo de producto:", error);
    throw error;
  }
};

// Eliminar un tipo de producto
export const deleteTipo = async (id) => {
  try {
    const response = await axiosInstance.delete(`/tipos-productos/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el tipo de producto:", error);
    throw error;
  }
};

// Actualizar un tipo de producto
export const updateTipo = async (id, tipoData) => {
  try {
    const response = await axiosInstance.put(`/tipos-productos/${id}`, tipoData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el tipo de producto:", error);
    throw error;
  }
};

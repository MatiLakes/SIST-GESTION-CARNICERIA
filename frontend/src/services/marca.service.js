import axiosInstance from "./root.service";

// Obtener todas las marcas de producto
export const getMarcas = async () => {
  try {
    const response = await axiosInstance.get("/marcas-productos");
    return response.data;
  } catch (error) {
    console.error("Error al obtener las marcas de productos:", error);
    throw error;
  }
};

// Crear una nueva marca de producto
export const createMarca = async (marcaData) => {
  try {
    const response = await axiosInstance.post("/marcas-productos", marcaData);
    return response.data;
  } catch (error) {
    console.error("Error al crear la marca de producto:", error);
    throw error;
  }
};

// Eliminar una marca de producto
export const deleteMarca = async (id) => {
  try {
    const response = await axiosInstance.delete(`/marcas-productos/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la marca de producto:", error);
    throw error;
  }
};

// Actualizar una marca de producto
export const updateMarca = async (id, marcaData) => {
  try {
    const response = await axiosInstance.put(`/marcas-productos/${id}`, marcaData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la marca de producto:", error);
    throw error;
  }
};

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

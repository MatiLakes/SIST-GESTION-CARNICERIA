import axiosInstance from "./root.service";

// Obtener todas las marcas
export const getMarcas = async () => {
  try {
    const response = await axiosInstance.get("/marcas-productos");
    return response.data;
  } catch (error) {
    console.error("Error al obtener las marcas:", error);
    throw error;
  }
};

// Crear una nueva marca
export const createMarca = async (marcaData) => {
  try {
    const response = await axiosInstance.post("/marcas-productos", marcaData);
    return response.data;
  } catch (error) {
    console.error("Error al crear la marca:", error);
    throw error;
  }
};

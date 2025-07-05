import axiosInstance from "./root.service";

// Obtener todas las mermas
export const getMermas = async () => {
  try {
    const response = await axiosInstance.get("/mermas");
    return response.data;
  } catch (error) {
    console.error("Error al obtener las mermas:", error);
    throw error;
  }
};

// Crear una nueva merma
export const createMerma = async (mermaData) => {
  try {
    const response = await axiosInstance.post("/mermas", mermaData);
    return response.data;
  } catch (error) {
    console.error("Error al crear la merma:", error);
    throw error;
  }
};

// Obtener merma por ID
export const getMermaPorId = async (id) => {
  try {
    const response = await axiosInstance.get(`/mermas/id/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener la merma:", error);
    throw error;
  }
};

// Filtrar mermas por tipo
export const filterMermasByTipo = async (tipo) => {
  try {
    const response = await axiosInstance.get(`/mermas/tipo/${tipo}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al filtrar las mermas por tipo:", error);
    throw error;
  }
};

// Filtrar mermas por personal
export const filterMermasByPersonal = async (personalId) => {
  try {
    const response = await axiosInstance.get(`/mermas/personal/${personalId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al filtrar las mermas por personal:", error);
    throw error;
  }
};

// Filtrar mermas por fecha
export const filterMermasByFecha = async (fechaInicio, fechaFin) => {
  try {
    const response = await axiosInstance.get(`/mermas/fecha?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al filtrar las mermas por fecha:", error);
    throw error;
  }
};

// Modificar una merma existente
export const updateMerma = async (id, mermaData) => {
  try {
    const response = await axiosInstance.put(`/mermas/${id}`, mermaData);
    return response.data;
  } catch (error) {
    console.error("Error al modificar la merma:", error);
    throw error;
  }
};

// Eliminar una merma existente
export const deleteMerma = async (id) => {
  try {
    await axiosInstance.delete(`/mermas/${id}`);
  } catch (error) {
    console.error("Error al eliminar la merma:", error);
    throw error;
  }
};

// Exportar mermas a Excel
export const descargarExcelMermas = async () => {
  try {
    const response = await axiosInstance.get("/mermas/exportar/excel", {
      responseType: "blob", // Necesario para manejar archivos
    });

    // Lógica para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "mermas.xlsx"); // Nombre del archivo
    document.body.appendChild(link);
    link.click();
    link.remove(); // Eliminar el enlace después de usarlo
  } catch (error) {
    console.error("Error al descargar el archivo Excel:", error);
    throw new Error("Error al descargar el archivo Excel");
  }
};

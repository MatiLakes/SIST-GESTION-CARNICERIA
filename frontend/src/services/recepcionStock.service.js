import axiosInstance from "./root.service";

// Obtener todas las recepciones de stock
export const getRecepcionesStock = async () => {
  try {
    // Usar una opción de tiempo de espera para evitar que se quede colgada la petición
    const response = await axiosInstance.get("/recepcion-stock", {
      timeout: 10000, // 10 segundos de timeout
    });
    
    // Comprobar si la respuesta está vacía o no es válida
    if (!response || !response.data) {
      return { data: [] };
    }
    
    // Verificar si debemos crear un formato consistente
    if (response.data && !Array.isArray(response.data) && !response.data.data) {
      // Envuelve el objeto en una estructura estándar si no viene como esperamos
      return { 
        data: { 
          data: Array.isArray(response.data) ? response.data : [response.data],
          success: true 
        } 
      };
    }
    
    return response;
  } catch (error) {
    console.error("Error al obtener las recepciones de stock:", error);
    
    // En caso de error, devolver un array vacío pero con estructura correcta
    return { data: { data: [], success: false, error: error.message } };
  }
};

// Crear una nueva recepción de stock
export const createRecepcionStock = async (recepcionData) => {
  try {
    const response = await axiosInstance.post("/recepcion-stock", recepcionData);
    return response.data;
  } catch (error) {
    console.error("Error al crear la recepción de stock:", error);
    throw error;
  }
};

// Modificar una recepción de stock existente
export const updateRecepcionStock = async (id, recepcionData) => {
  try {
    const response = await axiosInstance.put(`/recepcion-stock/${id}`, recepcionData);
    return response.data;
  } catch (error) {
    console.error("Error al modificar la recepción de stock:", error);
    throw error;
  }
};

// Eliminar una recepción de stock existente
export const deleteRecepcionStock = async (id) => {
  try {
    await axiosInstance.delete(`/recepcion-stock/${id}`);
  } catch (error) {
    console.error("Error al eliminar la recepción de stock:", error);
    throw error;
  }
};

// Exportar a Excel (si se necesita en el futuro)
export const descargarExcel = async () => {
  try {
    const response = await axiosInstance.get("/recepcion-stock/exportar/excel", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "recepciones-stock.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error al descargar el archivo Excel:", error);
    throw new Error("Error al descargar el archivo Excel");
  }
};

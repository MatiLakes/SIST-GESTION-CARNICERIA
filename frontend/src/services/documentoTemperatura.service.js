import axiosInstance from "./root.service.js";

export const getDocumentosTemperatura = async () => {
  try {
    const res = await axiosInstance.get("/documentos-temperatura");
    
    // Verificar la estructura de respuesta
    let datos;
    if (res.data && res.data.data) {
      datos = res.data.data;
    } else if (res.data && Array.isArray(res.data)) {
      datos = res.data;
    } else {
      console.warn("La estructura de respuesta no es la esperada:", res.data);
      return [];
    }
    
    return datos;
  } catch (error) {
    console.error("Error en getDocumentosTemperatura:", error);
    throw error;
  }
};

export const createDocumentoTemperatura = async (data) => {
  const res = await axiosInstance.post("/documentos-temperatura", data);
  return res.data;
};

export const updateDocumentoTemperatura = async (id, data) => {
  const res = await axiosInstance.put(`/documentos-temperatura/${id}`, data);
  return res.data;
};

export const deleteDocumentoTemperatura = async (id) => {
  await axiosInstance.delete(`/documentos-temperatura/${id}`);
};

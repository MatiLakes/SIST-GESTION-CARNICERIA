import axiosInstance from "./root.service.js";

export const getDocumentos = async () => {
  try {
    const res = await axiosInstance.get("/documentos-trazabilidad");
    
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
    
    // Validar los datos de registros
    datos.forEach((documento, i) => {
      if (!documento.registros || !Array.isArray(documento.registros)) {
        console.warn(`El documento ${i} (ID: ${documento.id}) no tiene registros asociados o no es un array`);
        documento.registros = [];
      } else {
        console.log(`Documento ${i} con ${documento.registros.length} registros`);
      }
    });
    
    return datos;
  } catch (error) {
    console.error("Error en getDocumentos:", error);
    throw error;
  }
};

export const getDocumentoById = async (id) => {
  try {
    const res = await axiosInstance.get(`/documentos-trazabilidad/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error al obtener documento con ID ${id}:`, error);
    throw error;
  }
};

export const createDocumento = async (data) => {
  const res = await axiosInstance.post("/documentos-trazabilidad", data);
  return res.data;
};

export const addRegistroToDocumento = async (documentoId, registroData) => {
  const res = await axiosInstance.post(`/documentos-trazabilidad/${documentoId}/registro`, registroData);
  return res.data;
};

export const updateDocumento = async (id, data) => {
  const res = await axiosInstance.put(`/documentos-trazabilidad/${id}`, data);
  return res.data;
};

export const updateRegistro = async (documentoId, registroId, data) => {
  const res = await axiosInstance.put(`/documentos-trazabilidad/${documentoId}/registro/${registroId}`, data);
  return res.data;
};

export const deleteDocumento = async (id) => {
  await axiosInstance.delete(`/documentos-trazabilidad/${id}`);
};

export const deleteRegistro = async (documentoId, registroId) => {
  await axiosInstance.delete(`/documentos-trazabilidad/${documentoId}/registro/${registroId}`);
};

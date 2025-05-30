import axiosInstance from "./root.service.js";

export const getControles = async () => {
  try {
    const res = await axiosInstance.get("/control-higiene");
    console.log("Respuesta del backend:", res);
    
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
    
    // Validar los datos de personal
    datos.forEach((registro, i) => {
      if (!registro.personal) {
        console.warn(`El registro ${i} (ID: ${registro.id}) no tiene personal asociado`);
      } else {
        console.log(`Registro ${i} con personal:`, registro.personal);
      }
    });
    
    return datos;
  } catch (error) {
    console.error("Error en getControles:", error);
    throw error;
  }
};

export const createControl = async (data) => {
  const res = await axiosInstance.post("/control-higiene", data);
  return res.data;
};

export const updateControl = async (id, data) => {
  const res = await axiosInstance.put(`/control-higiene/${id}`, data);
  return res.data;
};

export const deleteControl = async (id) => {
  await axiosInstance.delete(`/control-higiene/${id}`);
};

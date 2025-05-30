import axiosInstance from "./root.service.js";

export const getPersonal = async () => {
  try {
    const res = await axiosInstance.get("/personal");
    console.log("Respuesta del backend para personal:", res);
    // Verifica la estructura que devuelve tu backend
    if (res.data && res.data.data) {
      return res.data.data;
    } else if (res.data && Array.isArray(res.data)) {
      return res.data;
    } else {
      console.warn("La estructura de respuesta de personal no es la esperada:", res.data);
      return [];
    }
  } catch (error) {
    console.error("Error en getPersonal:", error);
    throw error;
  }
};

export const createPersonal = async (data) => {
  const res = await axiosInstance.post("/personal", data);
  return res.data;
};

export const updatePersonal = async (id, data) => {
  const res = await axiosInstance.put(`/personal/${id}`, data);
  return res.data;
};

export const deletePersonal = async (id) => {
  await axiosInstance.delete(`/personal/${id}`);
};

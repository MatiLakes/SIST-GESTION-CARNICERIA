import axiosInstance from "./root.service";

export const getNotificaciones = async () => {
  try {
    const response = await axiosInstance.get("/notificaciones");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener las notificaciones:", error);
    throw error;
  }
};

import axios from "./root.service.js"; // Importar desde `root.service.js`

// Obtener todas las listas de precios
export const getListasPrecios = async () => {
  try {
    const response = await axios.get("/animal-corte");
    return response.data; // Retorna los datos del backend
  } catch (error) {
    console.error("Error al obtener las listas de precios:", error);
    throw error;
  }
};

export const createListaPrecios = async (nombreLista, cortes) => {
    try {
      // Asegurarse de que todas las claves estén presentes
      const datos = {
        nombreLista,
      };
  
      cortes.forEach((corte) => {
        const keyCantidad = corte.nombre.toLowerCase().replace(/\s+/g, "");
        const keyPrecio = `precio${corte.nombre.replace(/\s+/g, "")}`;
        
        // Si los valores son indefinidos, asignar un valor por defecto (ejemplo: 0)
        datos[keyCantidad] = corte.cantidad ?? 0;
        datos[keyPrecio] = corte.precio ?? 0;
      });
  
      console.log("Datos enviados al backend:", datos); // Depuración
  
      // Enviar datos al backend
      const response = await axios.post("/animal-corte", datos);
      return response.data;
    } catch (error) {
      console.error("Error al crear la lista de precios:", error.response?.data || error.message);
      throw error;
    }
  };

// Obtener una lista de precios específica por ID
export const getListaPreciosById = async (id) => {
  try {
    const response = await axios.get(`/animal-corte/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener la lista de precios:", error);
    throw error;
  }
};
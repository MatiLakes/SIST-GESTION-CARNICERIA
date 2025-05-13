import axios from './root.service.js'; // Asegúrate de que apunta a tu configuración base de Axios

// Obtener todos los AnimalCortes
export async function getAllAnimalCortesService() {
  try {
    const response = await axios.get('/animal-corte');
    if (response.status === 200) {
      return [response.data.data, null];
    } else {
      console.error("Error inesperado en la respuesta:", response);
      return [null, "Error inesperado en la respuesta"];
    }
  } catch (error) {
    console.error("Error al obtener los AnimalCortes:", error.response?.data || error.message);
    return [null, error.response?.data || error.message];
  }
}

// Obtener un AnimalCorte por ID
export async function getAnimalCorteByIdService(id) {
  try {
    const response = await axios.get(`/animal-corte/${id}`);
    if (response.status === 200) {
      return [response.data.data, null];
    } else {
      console.error("Error inesperado en la respuesta:", response);
      return [null, "Error inesperado en la respuesta"];
    }
  } catch (error) {
    console.error("Error al obtener el AnimalCorte:", error.response?.data || error.message);
    return [null, error.response?.data || error.message];
  }
}

// Crear un nuevo AnimalCorte
export async function createAnimalCorteService(animalCorte) {
  try {
    const response = await axios.post('/animal-corte', animalCorte);
    if (response.status === 201) {
      return [response.data.data, null];
    } else {
      console.error("Error inesperado en la respuesta:", response);
      return [null, "Error inesperado en la respuesta"];
    }
  } catch (error) {
    console.error("Error al crear el AnimalCorte:", error.response?.data || error.message);
    return [null, error.response?.data || error.message];
  }
}

// Actualizar un AnimalCorte
export async function updateAnimalCorteService(id, animalCorte) {
  try {
    const response = await axios.put(`/animal-corte/${id}`, animalCorte);
    if (response.status === 200) {
      return [response.data.data, null];
    } else {
      console.error("Error inesperado en la respuesta:", response);
      return [null, "Error inesperado en la respuesta"];
    }
  } catch (error) {
    console.error("Error al actualizar el AnimalCorte:", error.response?.data || error.message);
    return [null, error.response?.data || error.message];
  }
}

// Eliminar una categoría
export async function deleteAnimalCorteService(id) {
  try {
      const response = await axios.delete(`/animal-corte/${id}`);
      console.log('Respuesta al eliminar Animal corte', response);
      if (response.status === 200) {
          return response.data;
      } else {
          console.error("Error inesperado en la respuesta:", response);
          return null;
      }
  } catch (error) {
      console.error("Error al eliminar:", error.response?.data || error.message, error);
      return null;
  }
}

export const descargarExcel = async () => {
  try {
    const response = await axios.get("/animal-corte/exportar/excel", {
      responseType: "blob", // Importante para manejar archivos binarios
    });

    // Crear URL para el blob y descargar
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "lista-cortes.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error al descargar el archivo Excel:", error);
    throw new Error("Error al descargar el archivo Excel");
  }
};


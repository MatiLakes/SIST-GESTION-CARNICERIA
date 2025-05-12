import axios from './root.service.js'; // Asegúrate de que apunta a tu configuración base de Axios

// Obtener todas las varas de animales
export async function getAllAnimalVarasService() {
  try {
    const response = await axios.get('/animal-vara');
    if (response.status === 200) {
      return [response.data.data, null];
    } else {
      console.error("Error inesperado en la respuesta:", response);
      return [null, "Error inesperado en la respuesta"];
    }
  } catch (error) {
    console.error("Error al obtener las varas de animales:", error.response?.data || error.message);
    return [null, error.response?.data || error.message];
  }
}

// Obtener una vara de animal por ID
export async function getAnimalVaraByIdService(id) {
  try {
    const response = await axios.get(`/animal-vara/${id}`);
    if (response.status === 200) {
      return [response.data.data, null];
    } else {
      console.error("Error inesperado en la respuesta:", response);
      return [null, "Error inesperado en la respuesta"];
    }
  } catch (error) {
    console.error("Error al obtener la vara de animal por ID:", error.response?.data || error.message);
    return [null, error.response?.data || error.message];
  }
}

// Crear una nueva vara de animal
export async function createAnimalVaraService(animalVara) {
  try {
    const response = await axios.post('/animal-vara', animalVara);
    if (response.status === 201) {
      return [response.data.data, null];
    } else {
      console.error("Error inesperado en la respuesta:", response);
      return [null, "Error inesperado en la respuesta"];
    }
  } catch (error) {
    console.error("Error al crear la vara de animal:", error.response?.data || error.message);
    return [null, error.response?.data || error.message];
  }
}

// Actualizar una vara de animal
export async function updateAnimalVaraService(id, animalVara) {
  try {
    const response = await axios.put(`/animal-vara/${id}`, animalVara);
    if (response.status === 200) {
      return [response.data.data, null];
    } else {
      console.error("Error inesperado en la respuesta:", response);
      return [null, "Error inesperado en la respuesta"];
    }
  } catch (error) {
    console.error("Error al actualizar la vara de animal:", error.response?.data || error.message);
    return [null, error.response?.data || error.message];
  }
}

// Eliminar una vara de animal
export async function deleteAnimalVaraService(id) {
  try {
    const response = await axios.delete(`/animal-vara/${id}`);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error al eliminar:", error.response?.data || error.message);
    if (error.response?.status === 400) {
      return {
        error: error.response.data.error || 'La vara no puede eliminarse porque está siendo utilizada en registros relacionados'
      };
    }
    return null;
  }
}

// Obtener varas de animales por fecha
export async function getVarasByFechaService(fecha) {
  try {
    const response = await axios.get(`/animal-vara/fecha/${fecha}`);
    if (response.status === 200) {
      return [response.data.data, null];
    } else {
      console.error("Error inesperado en la respuesta:", response);
      return [null, "Error inesperado en la respuesta"];
    }
  } catch (error) {
    console.error("Error al obtener las varas por fecha:", error.response?.data || error.message);
    return [null, error.response?.data || error.message];
  }
}


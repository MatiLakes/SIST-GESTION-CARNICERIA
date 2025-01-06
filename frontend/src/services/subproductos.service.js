import axios from "./root.service.js"; // Configuración base de Axios

// Obtener todos los subproductos
export async function getAllSubproductosService() {
  try {
    const response = await axios.get("/subproductos");
    return [response.data.data, null];
  } catch (error) {
    return [null, error.response?.data || error.message];
  }
}

// Obtener un subproducto por ID
export async function getSubproductoByIdService(id) {
  try {
    const response = await axios.get(`/subproductos/${id}`);
    return [response.data.data, null];
  } catch (error) {
    return [null, error.response?.data || error.message];
  }
}

// Crear un nuevo subproducto
export async function createSubproductoService(subproducto) {
  try {
    const response = await axios.post("/subproductos", subproducto);
    return [response.data.data, null];
  } catch (error) {
    return [null, error.response?.data || error.message];
  }
}

// Actualizar un subproducto existente
export async function updateSubproductoService(id, subproducto) {
  try {
    const response = await axios.put(`/subproductos/${id}`, subproducto);
    return [response.data.data, null];
  } catch (error) {
    return [null, error.response?.data || error.message];
  }
}

// Eliminar un subproducto
export async function deleteSubproductoService(id) {
  try {
    const response = await axios.delete(`/subproductos/${id}`);
    return [response.data.message, null];
  } catch (error) {
    return [null, error.response?.data || error.message];
  }
}

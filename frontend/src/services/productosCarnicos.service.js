import axios from './root.service.js'; // Ajusta el path a tu configuración base de Axios

// Crear Producto Cárnico
export async function createProductoCarnico(data) {
  try {
    const response = await axios.post('/producto-carnico/', data); // Ruta para crear un producto cárnico

    if (response.status === 201) {
      return response.data.data; // Devuelve los datos del producto creado
    } else {
      console.error("Error inesperado en la respuesta:", response);
      return null;
    }
  } catch (error) {
    console.error("Error al crear el producto cárnico:", error.response?.data || error.message);
    return null;
  }
}

// Actualizar Producto Cárnico
export async function updateProductoCarnico(id, data) {
  try {
    const response = await axios.put(`/producto-carnico/${id}`, data); // Ruta para actualizar un producto cárnico

    if (response.status === 200) {
      return response.data.data; // Devuelve el producto actualizado
    } else {
      console.error("Error inesperado en la respuesta:", response);
      return null;
    }
  } catch (error) {
    console.error("Error al actualizar el producto cárnico:", error.response?.data || error.message);
    return null;
  }
}

// Eliminar Producto Cárnico
export async function deleteProductoCarnico(id) {
  try {
    const response = await axios.delete(`/producto-carnico/${id}`); // Ruta para eliminar un producto cárnico

    if (response.status === 200) {
      return response.data.data; // Devuelve el mensaje de éxito
    } else {
      console.error("Error inesperado en la respuesta:", response);
      return null;
    }
  } catch (error) {
    console.error("Error al eliminar el producto cárnico:", error.response?.data || error.message);
    return null;
  }
}

// Obtener todos los Productos Cárnicos
export async function getAllProductosCarnicos() {
  try {
    const response = await axios.get('/producto-carnico/'); // Ruta para obtener todos los productos cárnicos

    if (response.status === 200) {
      return response.data.data; // Devuelve los datos de todos los productos cárnicos
    } else {
      console.error("Error inesperado en la respuesta:", response);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener los productos cárnicos:", error.response?.data || error.message);
    return null;
  }
}

// Obtener Producto Cárnico por ID
export async function getProductoCarnicoById(id) {
  try {
    const response = await axios.get(`/producto-carnico/${id}`); // Ruta para obtener un producto cárnico por ID

    if (response.status === 200) {
      return response.data.data; // Devuelve el producto encontrado
    } else {
      console.error("Error inesperado en la respuesta:", response);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el producto cárnico por ID:", error.response?.data || error.message);
    return null;
  }
}

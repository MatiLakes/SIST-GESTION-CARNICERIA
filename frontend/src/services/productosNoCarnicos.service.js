import axios from './root.service.js'; // Asegúrate de que apunta a tu configuración base de Axios

// Crear Producto No Cárnico
export async function createProductoNoCarnico(data) {
  try {
    const response = await axios.post('/producto-no-carnico/', data); // Ruta para crear un producto no cárnico

    if (response.status === 201) {
      return response.data.data; // Devuelve los datos del producto creado
    } else {
      console.error("Error inesperado en la respuesta:", response);
      return null;
    }
  } catch (error) {
    console.error("Error al crear el producto no cárnico:", error.response?.data || error.message);
    return null;
  }
}

// Actualizar Producto No Cárnico
export async function updateProductoNoCarnico(id, data) {
  try {
    const response = await axios.put(`/producto-no-carnico/${id}`, data); // Ruta para actualizar un producto no cárnico

    if (response.status === 200) {
      return response.data.data; // Devuelve el producto actualizado
    } else {
      console.error("Error inesperado en la respuesta:", response);
      return null;
    }
  } catch (error) {
    console.error("Error al actualizar el producto no cárnico:", error.response?.data || error.message);
    return null;
  }
}

// Eliminar Producto No Cárnico
export async function deleteProductoNoCarnico(id) {
  try {
    const response = await axios.delete(`/producto-no-carnico/${id}`); // Ruta para eliminar un producto no cárnico

    if (response.status === 200) {
      return response.data.data; // Devuelve el mensaje de éxito
    } else {
      console.error("Error inesperado en la respuesta:", response);
      return null;
    }
  } catch (error) {
    console.error("Error al eliminar el producto no cárnico:", error.response?.data || error.message);
    return null;
  }
}

// Obtener todos los Productos No Cárnicos
export async function getAllProductosNoCarnicos() {
  try {
    const response = await axios.get('/producto-no-carnico/'); // Ruta para obtener todos los productos no cárnicos

    if (response.status === 200) {
      return response.data.data; // Devuelve los datos de todos los productos no cárnicos
    } else {
      console.error("Error inesperado en la respuesta:", response);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener los productos no cárnicos:", error.response?.data || error.message);
    return null;
  }
}

// Obtener Producto No Cárnico por ID
export async function getProductoNoCarnicoById(id) {
  try {
    const response = await axios.get(`/producto-no-carnico/${id}`); // Ruta para obtener un producto no cárnico por ID

    if (response.status === 200) {
      return response.data.data; // Devuelve el producto encontrado
    } else {
      console.error("Error inesperado en la respuesta:", response);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el producto no cárnico por ID:", error.response?.data || error.message);
    return null;
  }
}

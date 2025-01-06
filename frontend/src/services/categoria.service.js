import axios from './root.service.js'; // Asegúrate de que apunta a tu configuración base de Axios

// Obtener todas las categorías
export async function getCategorias() {
    try {
        const response = await axios.get('/categoria/');
        console.log('Datos obtenidos:', response.data);
        if (response.status === 200) {
            return response.data.data;
        } else {
            console.error("Error inesperado en la respuesta:", response);
            return null;
        }
    } catch (error) {
        console.error("Error al obtener las categorías:", error.response?.data || error.message);
        return null;
    }
}

// Obtener categorías cárnicas
export async function getCategoriasCarnicas() {
    try {
        const response = await axios.get('/categoria/carnicas/carnicas');
        console.log('Datos obtenidos:', response.data);
        if (response.status === 200) {
            return response.data.data;
        } else {
            console.error("Error inesperado en la respuesta:", response);
            return null;
        }
    } catch (error) {
        console.error("Error al obtener las categorías cárnicas:", error.response?.data || error.message);
        return null;
    }
}

// Obtener categorías no cárnicas
export async function getCategoriasNoCarnicas() {
    try {
        const response = await axios.get('/categoria/carnicas/no-carnicas');
        console.log('Datos obtenidos:', response.data);
        if (response.status === 200) {
            return response.data.data;
        } else {
            console.error("Error inesperado en la respuesta:", response);
            return null;
        }
    } catch (error) {
        console.error("Error al obtener las categorías no cárnicas:", error.response?.data || error.message);
        return null;
    }
}

// Obtener una categoría por ID
export async function getCategoriaById(id) {
    try {
        const response = await axios.get(`/categoria/${id}`);
        if (response.status === 200) {
            return response.data.data;
        } else {
            console.error("Error inesperado en la respuesta:", response);
            return null;
        }
    } catch (error) {
        console.error("Error al obtener la categoría por ID:", error.response?.data || error.message);
        return null;
    }
}

// Crear una nueva categoría
export async function createCategoria(categoria) {
    try {
        const response = await axios.post('/categoria/', categoria);
        if (response.status === 201) {
            return response.data.data;
        } else {
            console.error("Error inesperado en la respuesta:", response);
            return null;
        }
    } catch (error) {
        console.error("Error al crear la categoría:", error.response?.data || error.message);
        return null;
    }
}

// Actualizar una categoría
export async function updateCategoria(id, categoria) {
    try {
        const response = await axios.put(`/categoria/${id}`, categoria); // Cambiado a PUT
        
        // Verificar el código de estado HTTP
        if (response.status === 200) {
            return response.data; // Retorna la respuesta completa del backend si el status es 200
        } else {
            throw new Error(`Error al actualizar la categoría: Código de estado ${response.status}`);
        }
    } catch (error) {
        console.error("Error al actualizar la categoría:", error.response?.data || error.message);
        throw error; // Lanza el error para que sea manejado por el hook
    }
}

// Eliminar una categoría
export async function deleteCategoria(id) {
    try {
        const response = await axios.delete(`/categoria/${id}`);
        console.log('Respuesta al eliminar categoría:', response);
        if (response.status === 200) {
            return response.data;
        } else {
            console.error("Error inesperado en la respuesta:", response);
            return null;
        }
    } catch (error) {
        console.error("Error al eliminar la categoría:", error.response?.data || error.message, error);
        return null;
    }
}

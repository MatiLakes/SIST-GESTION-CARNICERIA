import axios from './root.service.js'; // Asegúrate de que apunta a tu configuración base de Axios

// Obtener categorías
export async function getCategorias() {
    try {
        const response = await axios.get('/categoria/obtener');
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

// Crear una nueva categoría
export async function createCategoria(categoria) {
    try {
        const response = await axios.post('/categoria/crear', categoria);
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

export async function updateCategoria(id, categoria) {
    try {
        const response = await axios.put(`/categoria/actualizar/${id}`, categoria); // Cambiado a PUT
        
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
        const response = await axios.delete(`/categoria/eliminar/${id}`);
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

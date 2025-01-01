import axios from './root.service.js'; // Asegúrate de que apunta a tu configuración base de Axios

// Obtener todos los proveedores
export async function getProveedores() {
    try {
        const response = await axios.get('/proveedor/obtener');
        console.log('Proveedores obtenidos:', response.data);
        if (response.status === 200) {
            return response.data.data.data; // Asegúrate de que la API devuelva estos datos
        } else {
            console.error("Error inesperado en la respuesta:", response);
            return null;
        }
    } catch (error) {
        console.error("Error al obtener los proveedores:", error.response?.data || error.message);
        return null;
    }
}

// Crear un nuevo proveedor
export async function createProveedor(proveedor) {
    try {
        const response = await axios.post('/proveedor/crear', proveedor); // Ruta ajustada para crear
        if (response.status === 201) {
            return response.data.data; // Ajusta según la estructura de tu API
        } else {
            console.error("Error inesperado en la respuesta:", response);
            return null;
        }
    } catch (error) {
        console.error("Error al crear el proveedor:", error.response?.data || error.message);
        return null;
    }
}

// Actualizar un proveedor existente
export async function updateProveedor(id, proveedor) {
    try {
        const response = await axios.put(`/proveedor/actualizar/${id}`, proveedor); // Ruta ajustada para actualizar
        if (response.status === 200) {
            return response.data; // Retorna la respuesta completa si el status es 200
        } else {
            throw new Error(`Error al actualizar el proveedor: Código de estado ${response.status}`);
        }
    } catch (error) {
        console.error("Error al actualizar el proveedor:", error.response?.data || error.message);
        throw error; // Lanza el error para que sea manejado por el hook
    }
}

// Eliminar un proveedor
export async function deleteProveedor(id) {
    try {
        const response = await axios.delete(`/proveedor/eliminar/${id}`); // Ruta ajustada para eliminar
        console.log('Proveedor eliminado:', response);
        if (response.status === 200) {
            return response.data; // Devuelve los datos si la eliminación fue exitosa
        } else {
            console.error("Error inesperado en la respuesta:", response);
            return null;
        }
    } catch (error) {
        console.error("Error al eliminar el proveedor:", error.response?.data || error.message);
        return null;
    }
}

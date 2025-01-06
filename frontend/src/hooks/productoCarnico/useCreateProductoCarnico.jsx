import { createProductoCarnico } from '@services/productosCarnicos.service.js'; // Asegúrate de que el servicio esté correctamente importado
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert'; // Importa las funciones de SweetAlert

const useCreateProductoCarnico = (fetchProductosCarnicos) => {
    const handleCreate = async (productoCarnicoData) => {
        try {
            const newProductoCarnico = await createProductoCarnico(productoCarnicoData); // Llamada al servicio para crear el producto cárnico
            if (newProductoCarnico) {
                // Si el producto cárnico se crea correctamente, obtenemos nuevamente los productos cárnicos
                fetchProductosCarnicos(); // Actualizamos la lista de productos cárnicos

                // Mostrar mensaje de éxito
                showSuccessAlert('Producto cárnico creado con éxito'); // Muestra el mensaje de éxito
            } else {
                throw new Error('No se pudo crear el producto cárnico');
            }
        } catch (error) {
            // Si el error es de validación de Joi
            if (error.response && error.response.data.error) {
                // Extraemos los mensajes de error
                const errorMessages = error.response.data.error
                    .map((err) => err.message) // Mapea los mensajes de los errores de Joi
                    .join(', '); // Los une en un solo string

                // Muestra el mensaje de error
                showErrorAlert('Error de validación', errorMessages); // Muestra los errores de validación
            } else {
                // Si no es un error de validación, muestra un mensaje genérico
                const errorMessage = error.response?.data?.message || 'No se pudo crear el producto cárnico';
                console.error(errorMessage); // Mostramos el error en la consola

                // Mostrar mensaje de error genérico
                showErrorAlert('Error', errorMessage); // Muestra el mensaje de error
            }
        }
    };

    return { handleCreate }; // Retorna la función 'handleCreate' para usarla en el componente
};

export { useCreateProductoCarnico };

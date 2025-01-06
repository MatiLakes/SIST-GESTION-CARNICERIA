import { updateProductoCarnico } from '@services/productosCarnicos.service.js'; // Asegúrate de que el servicio esté correctamente importado
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert';

const useUpdateProductoCarnico = (fetchProductosCarnicos) => {
    const handleUpdate = async (id, productoCarnicoData) => {
        try {
            await updateProductoCarnico(id, productoCarnicoData); // Actualiza el producto cárnico
            fetchProductosCarnicos(); // Actualiza la lista de productos cárnicos después de la actualización
            showSuccessAlert('Producto cárnico actualizado con éxito'); // Mensaje de éxito
        } catch (error) {
            showErrorAlert('Error', 'No se pudo actualizar el producto cárnico'); // Mensaje de error
        }
    };

    return { handleUpdate };
};

export { useUpdateProductoCarnico };

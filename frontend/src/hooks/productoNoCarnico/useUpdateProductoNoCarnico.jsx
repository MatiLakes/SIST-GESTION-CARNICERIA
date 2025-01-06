import { updateProductoNoCarnico } from '@services/productosNoCarnicos.service.js'; // Asegúrate de que el servicio esté correctamente importado
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert';

const useUpdateProductoNoCarnico = (fetchProductosNoCarnicos) => {
    const handleUpdate = async (id, productoNoCarnicoData) => {
        try {
            await updateProductoNoCarnico(id, productoNoCarnicoData); // Actualiza el producto no cárnico
            fetchProductosNoCarnicos(); // Actualiza la lista de productos no cárnicos después de la actualización
            showSuccessAlert('Producto no cárnico actualizado con éxito'); // Mensaje de éxito
        } catch (error) {
            showErrorAlert('Error', 'No se pudo actualizar el producto no cárnico'); // Mensaje de error
        }
    };

    return { handleUpdate };
};

export { useUpdateProductoNoCarnico };

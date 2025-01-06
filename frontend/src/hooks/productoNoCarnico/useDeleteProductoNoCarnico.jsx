import { deleteProductoNoCarnico } from '@services/productosNoCarnicos.service.js'; // Asegúrate de que el servicio esté correctamente importado
import { showErrorAlert, showSuccessAlert, deleteDataAlert } from '@helpers/sweetAlert';

const useDeleteProductoNoCarnico = (fetchProductosNoCarnicos) => {
    const handleDelete = async (id) => {
        try {
            const result = await deleteDataAlert(); // Mostrar alerta para confirmar la eliminación
            if (result && result.isConfirmed) {
                const response = await deleteProductoNoCarnico(id); // Llamamos al servicio para eliminar el producto no cárnico
                if (response.status >= 400) {
                    return showErrorAlert('Error', response.data?.message || 'Error desconocido');
                }
                showSuccessAlert('¡Eliminado!', 'El producto no cárnico ha sido eliminado correctamente.');
                fetchProductosNoCarnicos(); // Actualizamos la lista de productos no cárnicos después de la eliminación
            } else {
                showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
            }
        } catch (error) {
            console.error('Error al eliminar el producto no cárnico:', error);
            showErrorAlert('Error de referencia', 'El producto no puede eliminarse porque está siendo utilizado en otra parte.');
        }
    };

    return { handleDelete };
};

export { useDeleteProductoNoCarnico };

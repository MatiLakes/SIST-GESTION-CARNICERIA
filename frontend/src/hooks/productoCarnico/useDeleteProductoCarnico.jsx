import { deleteProductoCarnico } from '@services/productosCarnicos.service.js'; // Asegúrate de que el servicio esté correctamente importado
import { showErrorAlert, showSuccessAlert, deleteDataAlert } from '@helpers/sweetAlert'; // Importa las funciones de SweetAlert

const useDeleteProductoCarnico = (fetchProductosCarnicos) => {
    const handleDelete = async (id) => {
        try {
            const result = await deleteDataAlert(); // Mostrar alerta para confirmar la eliminación
            if (result && result.isConfirmed) {
                const response = await deleteProductoCarnico(id); // Llamamos al servicio para eliminar el producto cárnico
                if (response.status >= 400) { // Verificar si hubo un error con la eliminación
                    return showErrorAlert('Error', response.data?.message || 'Error desconocido');
                }
                showSuccessAlert('¡Eliminado!', 'El producto cárnico ha sido eliminado correctamente.');
                fetchProductosCarnicos(); // Actualizamos la lista de productos cárnicos después de la eliminación
            } else {
                showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
            }
        } catch (error) {
            console.error('Error al eliminar el producto cárnico:', error);
            showErrorAlert('Error de referencia', 'El producto cárnico no puede eliminarse porque está siendo utilizado en otra parte.');
        }
    };

    return { handleDelete };
};

export { useDeleteProductoCarnico };

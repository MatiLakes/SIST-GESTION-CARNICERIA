import { deleteProveedorService } from '@services/proveedor.service'; // Asegúrate de que el servicio esté correctamente importado
import { showErrorAlert, showSuccessAlert, deleteDataAlert } from '@helpers/sweetAlert';

const useDeleteProveedor = (fetchProveedores) => {
    const handleDelete = async (id) => {
        try {
            const result = await deleteDataAlert(); // Mostrar alerta para confirmar la eliminación
            if (result && result.isConfirmed) {
                const response = await deleteProveedorService(id); // Llamamos al servicio para eliminar el proveedor
                if (response.status >= 400) { // Verificar si hubo un error con la eliminación
                    return showErrorAlert('Error', response.data?.message || 'Error desconocido');
                }
                showSuccessAlert('¡Eliminado!', 'El proveedor ha sido eliminado correctamente.');
                fetchProveedores(); // Actualizamos la lista de proveedores después de la eliminación
            } else {
                showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
            }
        } catch (error) {
            console.error('Error al eliminar el proveedor:', error);
            showErrorAlert('Error de referencia', 'El proveedor no puede eliminarse porque está siendo utilizado en otra parte.');
        }
    };

    return { handleDelete };
};

export { useDeleteProveedor };

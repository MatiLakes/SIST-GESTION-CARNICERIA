import { deleteProveedorService } from '@services/proveedor.service';
import { showSuccessAlert } from '@helpers/sweetAlert';

const useDeleteProveedor = (fetchProveedores) => {
    const handleDelete = async (id) => {
        try {
            const response = await deleteProveedorService(id);
            if (response.status >= 400) {
                throw new Error(response.data?.message || 'Error desconocido');
            }
            showSuccessAlert('¡Eliminado!', 'El proveedor ha sido eliminado correctamente');
            fetchProveedores();
        } catch (error) {
            console.error('Error al eliminar el proveedor:', error);
            throw error;
        }
    };

    return { handleDelete };
};

export { useDeleteProveedor };

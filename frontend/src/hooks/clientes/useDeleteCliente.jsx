import { deleteCliente } from "@services/cliente.service.js";
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert';

const useDeleteCliente = (fetchClientes) => {
    const handleDelete = async (id) => {
        try {
            const response = await deleteCliente(id);
            if (!response || response.error) {
                showErrorAlert('Error de referencia', 'El cliente no puede eliminarse porque está siendo utilizado en Pagos Pendientes');
                return;
            }
            showSuccessAlert('¡Eliminado!', 'El cliente ha sido eliminado correctamente');
            fetchClientes();
        } catch (error) {
            console.error('Error al eliminar el cliente:', error);
            showErrorAlert('Error de referencia', 'El cliente no puede eliminarse porque está siendo utilizado en Pagos Pendientes');
        }
    };

    return { handleDelete };
};

export { useDeleteCliente };

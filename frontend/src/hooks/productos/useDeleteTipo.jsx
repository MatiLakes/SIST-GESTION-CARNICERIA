import { deleteTipo } from "@services/tipo.service.js";
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert';

const useDeleteTipo = (fetchTipos) => {
    const handleDelete = async (id) => {
        try {
            const response = await deleteTipo(id);
            if (!response || response.error) {
                showErrorAlert('Error de referencia', 'El tipo no puede eliminarse porque está siendo utilizado en productos');
                return;
            }
            showSuccessAlert('¡Eliminado!', 'El tipo ha sido eliminado correctamente');
            fetchTipos();
        } catch (error) {
            console.error('Error al eliminar el tipo:', error);
            showErrorAlert('Error de referencia', 'El tipo no puede eliminarse porque está siendo utilizado en productos');
        }
    };

    return { handleDelete };
};

export { useDeleteTipo };
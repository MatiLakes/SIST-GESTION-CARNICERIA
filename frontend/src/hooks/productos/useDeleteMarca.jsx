import { deleteMarca } from "@services/marca.service.js";
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert';

const useDeleteMarca = (fetchMarcas) => {
    const handleDelete = async (id) => {
        try {
            const response = await deleteMarca(id);
            if (!response || response.error) {
                showErrorAlert('Error de referencia', 'La marca no puede eliminarse porque está siendo utilizada en productos');
                return;
            }
            showSuccessAlert('¡Eliminado!', 'La marca ha sido eliminada correctamente');
            fetchMarcas();
        } catch (error) {
            console.error('Error al eliminar la marca:', error);
            showErrorAlert('Error de referencia', 'La marca no puede eliminarse porque está siendo utilizada en productos');
        }
    };

    return { handleDelete };
};

export { useDeleteMarca };
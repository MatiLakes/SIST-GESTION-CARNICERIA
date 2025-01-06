import { deleteCategoria } from '@services/categoria.service';
import { showErrorAlert, showSuccessAlert, deleteDataAlert } from '@helpers/sweetAlert';

const useDeleteCategoria = (fetchCategorias) => {
    const handleDelete = async (id) => {
        try {
            const result = await deleteDataAlert(); // Mostrar alerta para confirmar la eliminación
            if (result && result.isConfirmed) {
                const response = await deleteCategoria(id); // Eliminar la categoría directamente
                if (response.status >= 400) { // Verificar si hubo un error con la eliminación
                    return showErrorAlert('Error', response.data?.message || 'Error desconocido');
                }
                showSuccessAlert('¡Eliminado!', 'La categoría ha sido eliminada correctamente.');
                fetchCategorias(); // Actualizamos la lista de categorías después de la eliminación
            } else {
                showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
            }
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
            showErrorAlert('Error de referencia', 'La categoría no puede eliminarse porque está siendo utilizada en otra parte.');
        }
    };

    return { handleDelete };
};

export { useDeleteCategoria };

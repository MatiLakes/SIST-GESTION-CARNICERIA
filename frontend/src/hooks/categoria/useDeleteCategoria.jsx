// src/hooks/useDeleteCategoria.jsx
import { deleteCategoria } from '@services/categoria.service';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert';

const useDeleteCategoria = (fetchCategorias) => {
    const handleDelete = async (id) => {
        try {
            await deleteCategoria(id); // Elimina la categoría directamente
            fetchCategorias(); // Actualizamos la lista de categorías después de la eliminación
            showSuccessAlert('Categoría eliminada con éxito');
        } catch (error) {
            showErrorAlert('Error', 'No se pudo eliminar la categoría');
        }
    };

    return { handleDelete };
};

export { useDeleteCategoria };

// src/hooks/useUpdateCategoria.jsx
import { updateCategoria } from '@services/categoria.service';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert';

const useUpdateCategoria = (fetchCategorias) => {
    const handleUpdate = async (id, categoriaData) => {
        try {
            await updateCategoria(id, categoriaData); // Actualiza la categoría
            fetchCategorias(); // Actualiza la lista de categorías después de la actualización
            showSuccessAlert('Categoría actualizada con éxito'); // Mensaje de éxito
        } catch (error) {
            showErrorAlert('Error', 'No se pudo actualizar la categoría'); // Mensaje de error
        }
    };

    return { handleUpdate };
};

export { useUpdateCategoria };

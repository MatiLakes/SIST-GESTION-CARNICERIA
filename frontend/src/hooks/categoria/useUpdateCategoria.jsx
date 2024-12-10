import { updateCategoria } from '@services/categoria.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert';

const useUpdateCategoria = (fetchCategorias, setShowPopup, setCategoriaToEdit) => {
  const handleUpdate = async (id, categoriaData) => {
    try {
      await updateCategoria(id, categoriaData); // Llamamos a la función updateCategoria

      fetchCategorias(); // Refrescamos las categorías
      showSuccessAlert('Categoría actualizada con éxito');
      setShowPopup(false);
      setCategoriaToEdit(null);
    } catch (error) {
      console.error('Error al actualizar la categoría:', error);
      showErrorAlert('Error', 'No se pudo actualizar la categoría');
    }
  };

  return { handleUpdate };
};

export { useUpdateCategoria };

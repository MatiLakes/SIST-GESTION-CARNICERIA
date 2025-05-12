import { deleteAnimalCorteService } from '@services/animalCorte.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert';

const useDeleteAnimalCorte = (fetchAnimalCortes) => {
  const handleDelete = async (id) => {
    try {
      const response = await deleteAnimalCorteService(id);
      if (!response || response.error) {
        showErrorAlert('Error de referencia', 'La lista de precio no puede eliminarse porque está siendo utilizado en otra parte.');
        return;
      }
      
      showSuccessAlert('¡Eliminado!', 'La lista de precios ha sido eliminada correctamente');
      fetchAnimalCortes();
    } catch (error) {
      console.error('Error al eliminar la lista de precios:', error);
      showErrorAlert('Error de referencia', 'La lista de precio no puede eliminarse porque está siendo utilizado en otra parte.');
    }
  };

  return { handleDelete };
};

export { useDeleteAnimalCorte };

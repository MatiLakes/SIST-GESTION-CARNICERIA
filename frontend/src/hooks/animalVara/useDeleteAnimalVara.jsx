import { deleteAnimalVaraService } from '@services/animalVara.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert';

const useDeleteAnimalVara = (fetchAnimalVaras) => {
  const handleDelete = async (id) => {
    try {
      const response = await deleteAnimalVaraService(id);
      if (!response || response.error) {
        showErrorAlert('Error de referencia', 'La vara no puede eliminarse porque está siendo utilizada en otra parte.');
        return;
      }
      
      showSuccessAlert('¡Eliminado!', 'La vara ha sido eliminada correctamente');
      fetchAnimalVaras();
    } catch (error) {
      console.error('Error al eliminar la vara:', error);
      showErrorAlert('Error de referencia', 'La vara no puede eliminarse porque está siendo utilizada en otra parte.');
    }
  };

  return { handleDelete };
};

export { useDeleteAnimalVara };

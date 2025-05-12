import { updateAnimalCorteService } from '@services/animalCorte.service.js';
import { showSuccessAlert } from '@helpers/sweetAlert';

const useUpdateAnimalCorte = (fetchAnimalCortes) => {
  const handleUpdate = async (id, animalCorteData) => {
    try {
      const [_, error] = await updateAnimalCorteService(id, animalCorteData);
      if (error) {
        console.error('Error al actualizar la lista de precios:', error);
        // Propagar todos los errores al componente para que el formulario los muestre
        throw new Error(error.message || 'Error al actualizar la lista de precios.');
      }
      
      fetchAnimalCortes();
      showSuccessAlert('¡Actualizado!', 'La lista de precios ha sido editada correctamente');
    } catch (error) {
      console.error('Error al actualizar la lista de precios:', error);
      // Re-lanzar el error para que el componente lo maneje
      throw error;
    }
  };

  return { handleUpdate };
};

export { useUpdateAnimalCorte };

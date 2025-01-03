import { updateAnimalCorteService } from '@services/animalCorte.service.js'; // Asegúrate de que este servicio esté correcto
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert'; // Importar las funciones de SweetAlert

const useUpdateAnimalCorte = (fetchAnimalCortes) => {
  const handleUpdate = async (id, animalCorteData) => {
    try {
      await updateAnimalCorteService(id, animalCorteData); // Actualiza el AnimalCorte
      fetchAnimalCortes(); // Actualiza la lista de AnimalCortes después de la actualización
      showSuccessAlert('AnimalCorte actualizado con éxito'); // Mensaje de éxito
    } catch (error) {
      showErrorAlert('Error', 'No se pudo actualizar el AnimalCorte'); // Mensaje de error
    }
  };

  return { handleUpdate };
};

export { useUpdateAnimalCorte };

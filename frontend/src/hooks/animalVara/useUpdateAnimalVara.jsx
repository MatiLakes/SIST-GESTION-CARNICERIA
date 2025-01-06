import { updateAnimalVaraService } from '@services/animalVara.service.js'; // Asegúrate de que este servicio esté correcto
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert'; // Importar las funciones de SweetAlert

const useUpdateAnimalVara = (fetchAnimalVaras) => {
  const handleUpdate = async (id, animalVaraData) => {
    try {
      await updateAnimalVaraService(id, animalVaraData); // Actualiza la AnimalVara
      fetchAnimalVaras(); // Actualiza la lista de AnimalVaras después de la actualización
      showSuccessAlert('Vara ingresada actualizada con éxito'); // Mensaje de éxito
    } catch (error) {
      showErrorAlert('Error', 'No se pudo actualizar la AnimalVara'); // Mensaje de error
    }
  };

  return { handleUpdate };
};

export { useUpdateAnimalVara };

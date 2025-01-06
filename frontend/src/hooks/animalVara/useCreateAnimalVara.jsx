import { createAnimalVaraService } from '@services/animalVara.service.js'; // Asegúrate de que este servicio esté correcto
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert'; // Importar las funciones de SweetAlert

const useCreateAnimalVara = (fetchAnimalVaras) => {
  const handleCreate = async (animalVaraData) => {
    try {
      const newAnimalVara = await createAnimalVaraService(animalVaraData);
      if (newAnimalVara) {
        // Si la AnimalVara se crea correctamente, obtenemos nuevamente la lista
        fetchAnimalVaras(); // Actualizamos la lista de AnimalVaras

        // Mostrar mensaje de éxito
        showSuccessAlert('Vara ingresada con éxito'); // Muestra el mensaje de éxito
      } else {
        throw new Error('No se pudo crear la AnimalVara');
      }
    } catch (error) {
      // Si el error es de validación de Joi
      if (error.response && error.response.data.error) {
        // Extraemos los mensajes de error
        const errorMessages = error.response.data.error
          .map((err) => err.message) // Mapea los mensajes de los errores de Joi
          .join(', '); // Los une en un solo string

        // Muestra el mensaje de error
        showErrorAlert('Error de validación', errorMessages); // Muestra los errores de validación
      } else {
        // Si no es un error de validación, muestra un mensaje genérico
        const errorMessage = error.response?.data?.message || 'No se pudo crear la AnimalVara';
        console.error(errorMessage); // Mostramos el error en la consola

        // Mostrar mensaje de error genérico
        showErrorAlert('Error', errorMessage); // Muestra el mensaje de error
      }
    }
  };

  return { handleCreate }; // Se exporta 'handleCreate'
};

export { useCreateAnimalVara };

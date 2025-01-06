import { createAnimalCorteService } from '@services/animalCorte.service.js'; // Asegúrate de que este servicio esté correcto
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert'; // Importar las funciones de SweetAlert

const useCreateAnimalCorte = (fetchAnimalCortes) => {
  const handleCreate = async (animalCorteData) => {
    try {
      const newAnimalCorte = await createAnimalCorteService(animalCorteData);
      if (newAnimalCorte) {
        // Si el AnimalCorte se crea correctamente, obtenemos nuevamente la lista
        fetchAnimalCortes(); // Actualizamos la lista de AnimalCortes

        // Mostrar mensaje de éxito
        showSuccessAlert('Lista de precios creada éxitosamente'); // Muestra el mensaje de éxito
      } else {
        throw new Error('No se pudo crear el AnimalCorte');
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
        const errorMessage = error.response?.data?.message || 'No se pudo crear el AnimalCorte';
        console.error(errorMessage); // Mostramos el error en la consola

        // Mostrar mensaje de error genérico
        showErrorAlert('Error', errorMessage); // Muestra el mensaje de error
      }
    }
  };

  return { handleCreate }; // Se exporta 'handleCreate'
};

export { useCreateAnimalCorte };

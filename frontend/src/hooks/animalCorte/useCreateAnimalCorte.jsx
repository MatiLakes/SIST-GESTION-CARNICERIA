import { createAnimalCorteService } from '@services/animalCorte.service.js';
import { showSuccessAlert } from '@helpers/sweetAlert';

const useCreateAnimalCorte = (fetchAnimalCortes) => {
  const handleCreate = async (animalCorteData) => {
    try {
      const [newAnimalCorte, error] = await createAnimalCorteService(animalCorteData);
      
      if (error) {
        // Si hay un error del servicio, lo propagamos
        throw new Error(error.message);
      }

      if (newAnimalCorte) {
        fetchAnimalCortes();
        showSuccessAlert('Lista de precios creada éxitosamente');
        return true;
      } else {
        throw new Error('No se pudo crear la lista de precios');
      }
    } catch (error) {
      if (error.message === "Ya existe un tipo de animal con este nombre de lista.") {
        // Propagamos el error específico de duplicado
        throw error;
      } else {
        // Para otros errores, mostramos un mensaje genérico
        throw new Error('Error al crear la lista de precios. Por favor, inténtelo de nuevo.');
      }
    }
  };

  return { handleCreate };
};

export { useCreateAnimalCorte };

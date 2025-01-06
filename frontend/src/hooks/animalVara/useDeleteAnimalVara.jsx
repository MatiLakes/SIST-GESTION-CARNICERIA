import { deleteAnimalVaraService } from '@services/animalVara.service.js'; // Asegúrate de que este servicio esté correcto
import { showErrorAlert, showSuccessAlert, deleteDataAlert } from '@helpers/sweetAlert'; // Importar las funciones de SweetAlert

const useDeleteAnimalVara = (fetchAnimalVaras) => {
  const handleDelete = async (id) => {
    try {
      const result = await deleteDataAlert(); // Mostrar alerta para confirmar la eliminación
      if (result && result.isConfirmed) {
        const response = await deleteAnimalVaraService(id); // Eliminar el AnimalVara directamente
        if (response.status >= 400) { // Verificar si hubo un error con la eliminación
          return showErrorAlert('Error', response.data?.message || 'Error desconocido');
        }
        showSuccessAlert('¡Eliminado!', 'La AnimalVara ha sido eliminada correctamente.');
        fetchAnimalVaras(); // Actualizamos la lista de AnimalVaras después de la eliminación
      } else {
        showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
      }
    } catch (error) {
      console.error('Error al eliminar la AnimalVara:', error);
      showErrorAlert('Error de referencia', 'La AnimalVara no puede eliminarse porque está siendo utilizada en otra parte.');
    }
  };

  return { handleDelete };
};

export { useDeleteAnimalVara };

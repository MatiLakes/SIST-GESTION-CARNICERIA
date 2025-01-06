import { deleteAnimalCorteService } from '@services/animalCorte.service.js'; // Asegúrate de que este servicio esté correcto
import { showErrorAlert, showSuccessAlert, deleteDataAlert } from '@helpers/sweetAlert'; // Importar las funciones de SweetAlert

const useDeleteAnimalCorte = (fetchAnimalCortes) => {
  const handleDelete = async (id) => {
    try {
      const result = await deleteDataAlert(); // Mostrar alerta para confirmar la eliminación
      if (result && result.isConfirmed) {
        const response = await deleteAnimalCorteService(id); // Eliminar el AnimalCorte directamente
        if (response.status >= 400) { // Verificar si hubo un error con la eliminación
          return showErrorAlert('Error', response.data?.message || 'Error desconocido');
        }
        showSuccessAlert('¡Eliminado!', 'El AnimalCorte ha sido eliminado correctamente.');
        fetchAnimalCortes(); // Actualizamos la lista de AnimalCortes después de la eliminación
      } else {
        showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
      }
    } catch (error) {
      console.error('Error al eliminar el AnimalCorte:', error);
      showErrorAlert('Error de referencia', 'El AnimalCorte no puede eliminarse porque está siendo utilizado en otra parte.');
    }
  };

  return { handleDelete };
};

export { useDeleteAnimalCorte };

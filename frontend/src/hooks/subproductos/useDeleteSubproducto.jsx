import { deleteSubproductoService } from '@services/subproductos.service';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert';

const useDeleteSubproducto = (fetchSubproductos) => {
  const handleDelete = async (id) => {
    try {
      const response = await deleteSubproductoService(id);
      if (!response || response.error) {
        showErrorAlert('Error de referencia', 'El subproducto no puede eliminarse porque está siendo utilizado en otra parte.');
        return;
      }
      
      showSuccessAlert('¡Eliminado!', 'El subproducto ha sido eliminado correctamente');
      fetchSubproductos();
    } catch (error) {
      console.error('Error al eliminar el subproducto:', error);
      showErrorAlert('Error de referencia', 'El subproducto no puede eliminarse porque está siendo utilizado en otra parte.');
    }
  };

  return { handleDelete };
};

export { useDeleteSubproducto };

import { updateProveedorService } from '@services/proveedor.service'; // Asegúrate de que el servicio esté correctamente importado
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert';

const useUpdateProveedor = (fetchProveedores) => {
    const handleUpdate = async (id, proveedorData) => {
        try {
            await updateProveedorService(id, proveedorData); // Actualiza el proveedor
            fetchProveedores(); // Actualiza la lista de proveedores después de la actualización
            showSuccessAlert('Proveedor actualizado con éxito'); // Mensaje de éxito
        } catch (error) {
            showErrorAlert('Error', 'No se pudo actualizar el proveedor'); // Mensaje de error
        }
    };

    return { handleUpdate };
};

export { useUpdateProveedor };

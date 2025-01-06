import { createProductoNoCarnico } from '@services/productosNoCarnicos.service.js'; // Asegúrate de que el servicio esté correctamente importado
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';

const useCreateProductoNoCarnico = (fetchProductosNoCarnicos) => {
    const handleCreate = async (productoNoCarnicoData) => {
        try {
            const newProductoNoCarnico = await createProductoNoCarnico(productoNoCarnicoData); // Llamada al servicio para crear el producto no cárnico
            if (newProductoNoCarnico) {
                fetchProductosNoCarnicos(); // Actualiza la lista de productos no cárnicos
                showSuccessAlert('Producto no cárnico creado con éxito'); // Muestra mensaje de éxito
            } else {
                throw new Error('No se pudo crear el producto no cárnico');
            }
        } catch (error) {
            showErrorAlert('Error', 'No se pudo crear el producto no cárnico'); // Muestra mensaje de error
        }
    };

    return { handleCreate };
};

export { useCreateProductoNoCarnico };

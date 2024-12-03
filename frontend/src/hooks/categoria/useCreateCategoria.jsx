import { createCategoria } from '@services/categoria.service.js'; // Asegúrate de que este servicio esté correcto

const useCreateCategoria = (fetchCategorias) => {
    const handleCreate = async (categoriaData) => {
        try {
            const newCategoria = await createCategoria(categoriaData);
            if (newCategoria) {
                // Si la categoría se crea correctamente, obtenemos nuevamente las categorías
                fetchCategorias(); // Vuelve a obtener las categorías para reflejar la nueva
            } else {
                throw new Error('No se pudo crear la categoría');
            }
        } catch (error) {
            // Manejo del error, puedes mostrar el error en consola o manejarlo de otra manera
            const errorMessage = error.response?.data?.message || 'No se pudo crear la categoría';
            console.error(errorMessage); // Mostramos el error en la consola
        }
    };

    return { handleCreate }; // Se exporta 'handleCreate'
};

export { useCreateCategoria };

import { useState } from 'react';
import { updateCategoria } from '@services/categoria.service';
import Swal from 'sweetalert2';  // Importa SweetAlert2

const useEditCategoria = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataCategoria, setDataCategoria] = useState([]); // Almacena la categoría seleccionada

    const handleUpdate = async (updatedData) => {
        if (updatedData && dataCategoria[0]?.id) {
            try {
                // Llamada al servicio con el ID y los nuevos datos (PUT requiere la entidad completa)
                const updatedCategoria = await updateCategoria(dataCategoria[0].id, updatedData);

                // Actualiza la categoría en el estado si es necesario
                setDataCategoria((prev) =>
                    prev.map((cat) =>
                        cat.id === updatedCategoria.id ? updatedCategoria : cat
                    )
                );

                // Muestra SweetAlert si la actualización fue exitosa
                Swal.fire({
                    title: '¡Actualización exitosa!',
                    text: 'La categoría ha sido actualizada correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                });

                return updatedCategoria;
            } catch (error) {
                console.error('Error al actualizar la categoría:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al actualizar la categoría.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
                throw error;
            }
        } else {
            console.error('Datos incompletos para actualizar la categoría');
            Swal.fire({
                title: 'Error',
                text: 'No se han proporcionado los datos completos para actualizar la categoría.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
            throw new Error('Datos incompletos.');
        }
    };

    return {
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataCategoria,
        setDataCategoria,
    };
};

export default useEditCategoria;

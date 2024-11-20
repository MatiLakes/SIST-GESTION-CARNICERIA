// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useGetCategoria } from '@hooks/categoria/useGetCategoria';
import useEditCategoria from '@hooks/categoria/useEditCategoria'; // Hook para editar categorías
import { useDeleteCategoria } from '@hooks/categoria/useDeleteCategoria'; // Hook para eliminar categorías
import { useCreateCategoria } from '@hooks/categoria/useCreateCategoria'; // Hook para crear categorías
import Swal from 'sweetalert2'; // Importar SweetAlert2
import styles from '@styles/categoria.module.css'; // Importación de CSS Modules

const Categorias = () => {
    const { categorias, loading, error } = useGetCategoria(); // Hook para obtener categorías
    const { handleUpdate, isPopupOpen, setIsPopupOpen, setDataCategoria } = useEditCategoria(); // Hook para manejar la edición
    const { deleteCategoriaById, loading: deleteLoading, error: deleteError } = useDeleteCategoria(); // Hook para eliminar categorías
    const { createNewCategoria, loading: createLoading, error: createError } = useCreateCategoria(); // Hook para crear categoría
    const [filter, setFilter] = useState(""); // Filtro de categorías
    const [selectedCategoria, setSelectedCategoria] = useState(null); // Categoría seleccionada para editar
    const [newNombre, setNewNombre] = useState(""); // Nombre para la edición
    const [newCategoryName, setNewCategoryName] = useState(""); // Nombre para la creación de categoría

    useEffect(() => {
        console.log("Categorías cargadas:", categorias); // Debug para verificar categorías
    }, [categorias]);

    // Filtra las categorías basadas en el filtro
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    // Configura la categoría a editar y abre el popup
    const handleEditClick = (categoria) => {
        setSelectedCategoria(categoria);
        setNewNombre(categoria.nombre);
        setDataCategoria([categoria]); // Prepara la categoría para la edición
        setIsPopupOpen(true);
    };

    // Actualiza el nombre de la categoría
    const handleNombreChange = (event) => {
        setNewNombre(event.target.value);
    };

    // Llama al hook de actualización
    const handleUpdateClick = async () => {
        if (newNombre.trim()) {
            try {
                await handleUpdate({ nombre: newNombre });
                setSelectedCategoria(null);
                setNewNombre("");
                setIsPopupOpen(false); // Cierra el popup
                // Recarga la página después de actualizar
                window.location.reload();
            } catch (error) {
                console.error("Error al actualizar la categoría:", error);
            }
        } else {
            alert("Por favor, ingresa un nombre válido.");
        }
    };
    

    // Llama al hook de eliminación con confirmación de SweetAlert
    const handleDeleteClick = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro de eliminarlo?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            await deleteCategoriaById(id);
            Swal.fire({
                title: 'Eliminado',
                text: 'La categoría ha sido eliminada.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            }).then(() => {
                window.location.reload();
            });
        }
    };

    // Actualiza el nombre para crear una nueva categoría
    const handleNewCategoryNameChange = (event) => {
        setNewCategoryName(event.target.value);
    };

    // Llama al hook de creación de categoría
    const handleCreateCategoryClick = async () => {
        if (newCategoryName.trim()) {
            try {
                // Verificamos los datos antes de hacer la llamada
                console.log("Datos que se están enviando para crear la categoría:", { nombre: newCategoryName });
    
                await createNewCategoria({ nombre: newCategoryName });
    
                setNewCategoryName(""); // Limpia el campo
    
                Swal.fire({
                    title: 'Categoría creada',
                    text: 'La categoría ha sido creada exitosamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                }).then(() => {
                    // Recarga la página después de la confirmación
                    window.location.reload();
                });
            } catch (error) {
                console.error("Error al crear la categoría:", error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al crear la categoría.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            }
        } else {
            alert("Por favor, ingresa un nombre válido.");
        }
    };

    if (loading) return <p>Cargando categorías...</p>;
    if (error) return <p>Error: {error}</p>;

    if (deleteLoading) return <p>Eliminando categoría...</p>;
    if (deleteError) return <p>Error: {deleteError}</p>;
    if (createLoading) return <p>Creando categoría...</p>;
    if (createError) return <p>Error: {createError}</p>;

    const filteredCategorias = categorias.filter((categoria) =>
        categoria.nombre.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="main-container">
            {/* Sección del filtro */}
            <div className={styles.filterSection}>
                <input
                    type="text"
                    placeholder="Filtrar por nombre"
                    value={filter}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                />
            </div>

            {/* Formulario de creación de categoría */}
            <div className={styles['edit-category']}>
                <h3>Crear Nueva Categoría</h3>
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={handleNewCategoryNameChange}
                    placeholder="Nombre de la categoría"
                    className={styles.editInput}
                />
                <button className={styles['update-button']} onClick={handleCreateCategoryClick}>
                    Crear Categoría
                </button>
            </div>

            {/* Tabla de categorías */}
            <div className="categories-list">
                <h2 className={styles.categoryTitle}>Categorías Encontradas</h2>
                <table className={styles.categoryTable}>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategorias.length > 0 ? (
                            filteredCategorias.map((categoria) => (
                                <tr key={categoria.id}>
                                    <td>{categoria.nombre}</td>
                                    <td>
                                        <button className={styles['edit-button']} onClick={() => handleEditClick(categoria)}>Editar</button>
                                        <button className={styles['delete-button']} onClick={() => handleDeleteClick(categoria.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">No se encontraron categorías.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Popup de edición */}
            {isPopupOpen && selectedCategoria && (
                <div className={styles['edit-category']}>
                    <h3>Editar Categoría</h3>
                    <input
                        type="text"
                        value={newNombre}
                        onChange={handleNombreChange}
                        placeholder="Nuevo nombre"
                        className={styles.editInput}
                    />
                    <button className={styles['update-button']} onClick={handleUpdateClick}>Actualizar</button>
                    <button className={styles['cancel-button']} onClick={() => setIsPopupOpen(false)}>Cancelar</button>
                </div>
            )}
        </div>
    );
};

export default Categorias;

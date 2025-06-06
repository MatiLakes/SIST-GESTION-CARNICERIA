import React, { useState, useEffect } from "react";
import { useGetAnimalVara } from "@hooks/animalVara/useGetAnimalVara"; 
import { useCreateAnimalVara } from "@hooks/animalVara/useCreateAnimalVara";
import { useDeleteAnimalVara } from "@hooks/animalVara/useDeleteAnimalVara";
import { useUpdateAnimalVara } from "@hooks/animalVara/useUpdateAnimalVara";
import { getAllAnimalCortesService } from '../services/animalCorte.service';  // Aquí la importación correcta
import Swal from 'sweetalert2';

import Table from "../components/Table";
import Modal from "react-modal";
import styles from "@styles/categoria.module.css";
import "@styles/formulariotable.css";

const AnimalVara = () => {
    const { animalVaras, loading, error, fetchAnimalVaras } = useGetAnimalVara();
    const { handleCreate } = useCreateAnimalVara(fetchAnimalVaras);
    const { handleDelete } = useDeleteAnimalVara(fetchAnimalVaras);
    const { handleUpdate } = useUpdateAnimalVara(fetchAnimalVaras);

    const [tiposAnimales, setTiposAnimales] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [animalVaraToEdit, setAnimalVaraToEdit] = useState(null);
    const [animalVaraToDelete, setAnimalVaraToDelete] = useState(null);

    const [newAnimalVaraData, setNewAnimalVaraData] = useState({
        fechaLlegada: "",
        temperaturaLlegada: "",
        precioTotalVara: "",
        tipoAnimal: "", 
    });

    const [formData, setFormData] = useState({
        fechaLlegada: "",
        temperaturaLlegada: "",
        precioTotalVara: "",
        tipoAnimal: "",  // Solo guardamos el nombreLista (string) directamente
    });

    useEffect(() => {
        const cargarTiposAnimales = async () => {
            try {
                const [cortes, error] = await getAllAnimalCortesService();
                if (error) {
                    console.error('Error al cargar los cortes de animales:', error);
                    return;
                }
                console.log(cortes);  // Verifica que los cortes sean correctos
                if (Array.isArray(cortes) && cortes.length > 0) {
                    // Asegúrate de que cada objeto tenga la estructura esperada
                    const validCortes = cortes.filter(corte => corte.nombreLista);  // Solo tomamos cortes con nombreLista
                    setTiposAnimales(validCortes);  // Guarda solo los cortes válidos
                }
            } catch (error) {
                console.error('Error al obtener los cortes de animales:', error);
            }
        };
        cargarTiposAnimales();
    }, []);  // Ejecuta este efecto solo una vez al montar el componente
    
    // Cargar las varas de animales al inicio
    useEffect(() => {
        fetchAnimalVaras();  // Carga las varas de animales al iniciar el componente
    }, []);

    const varasData = Array.isArray(animalVaras) && animalVaras[0] ? animalVaras[0] : [];


    const validateFields = (data) => {
        // Validación de fecha de llegada (debe ser hoy o anterior)
        const today = new Date().toISOString().split('T')[0]; // Fecha de hoy en formato YYYY-MM-DD
        if (data.fechaLlegada > today) {
            Swal.fire("Error", "La fecha de llegada no puede ser posterior a hoy.", "error");
            return false;
        }
    
        // Validación de temperatura de llegada (debe estar entre -50 y 50 grados)
        const temperatura = parseFloat(data.temperaturaLlegada);
        if (isNaN(temperatura) || temperatura < -50 || temperatura > 50) {
            Swal.fire("Error", "La temperatura de llegada debe estar entre -50 y 50 grados.", "error");
            return false;
        }
    
        // Validación de precio total vara (no puede ser negativo)
        const precioTotal = parseFloat(data.precioTotalVara);
        if (isNaN(precioTotal) || precioTotal < 0) {
            Swal.fire("Error", "El precio total de vara no puede ser negativo.", "error");
            return false;
        }
    
        return true;
    };

    // Manejo de eliminación
    const handleDeleteClick = (animalVara) => {
        setAnimalVaraToDelete(animalVara);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
        setAnimalVaraToDelete(null);
    };

    const confirmDelete = () => {
        handleDelete(animalVaraToDelete.id);
        setIsDeleteModalOpen(false);
        setAnimalVaraToDelete(null);
    };

// Manejo de edición
const handleUpdateClick = (animalVara) => {
    setAnimalVaraToEdit(animalVara);
    setFormData({
        fechaLlegada: animalVara.fechaLlegada,
        temperaturaLlegada: animalVara.temperaturaLlegada,
        precioTotalVara: animalVara.precioTotalVara,
        tipoAnimal: animalVara.tipoAnimal.nombreLista || "",  // Directamente asignamos solo el nombreLista
    });
    setIsEditModalOpen(true);
};

    // Manejo de creación
    const handleCreateClick = () => {
        setIsCreateModalOpen(true);
    };

    const handleCreateModalChange = (e) => {
        const { name, value } = e.target;
        
        // Comprobamos si el campo es de tipo "tipoAnimal.nombreLista"
        if (name === "tipoAnimal.nombreLista") {
            // Actualizamos tipoAnimal.nombreLista con el valor seleccionado
            setNewAnimalVaraData({
                ...newAnimalVaraData,
                tipoAnimal: { nombreLista: value },  // Actualiza solo la propiedad nombreLista dentro de tipoAnimal
            });
        } else {
            setNewAnimalVaraData({ ...newAnimalVaraData, [name]: value });
        }
    };

    const handleCreateModalSubmit = (e) => {
        e.preventDefault();
    
        // Validar los campos antes de proceder
        if (validateFields(newAnimalVaraData)) {
            handleCreate(newAnimalVaraData);  
            setNewAnimalVaraData({
                fechaLlegada: "",
                temperaturaLlegada: "",
                precioTotalVara: "",
                tipoAnimal: { nombreLista: "" },
            });
            setIsCreateModalOpen(false); // Cerrar el modal después de guardar los datos
        }
    };
// Manejo de cambios en el formulario de edición
const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "tipoAnimal") {
        // Actualizamos tipoAnimal con el valor directamente, que es el nombreLista
        setFormData({
            ...formData,
            tipoAnimal: value,
        });
    } else {
        setFormData({ ...formData, [name]: value });
    }
};

const handleEditSubmit = (e) => {
    e.preventDefault();

    // Validar los campos antes de proceder
    const updatedData = {
        ...formData,
        tipoAnimal: { nombreLista: formData.tipoAnimal },  // Convertimos de nuevo a objeto para la actualización
    };

    if (validateFields(updatedData)) {
        handleUpdate(animalVaraToEdit.id, updatedData);  
        setIsEditModalOpen(false); // Cerrar el modal después de actualizar los datos
    }
};
    const columns = [
        { header: "Fecha Llegada", key: "fechaLlegada" },
        { header: "Temperatura Llegada", key: "temperaturaLlegada" },
        { header: "Precio Total Vara", key: "precioTotalVara" },
        { header: "Lista de Precios", key: "tipoAnimal" },
    ];

    if (loading) return <p>Cargando varas...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles["categoria-container"]}>            
            <Table
                data={varasData}
                columns={columns}
                headerTitle="Varas"
                onCreate={handleCreateClick}
                onEdit={handleUpdateClick}
                onDelete={handleDeleteClick}
                showEditAllButton={false}
                showViewButton={false}
                showCalendarButton={true}
                showExcelButton={true}
                entidad="animal-vara"
                customFormat={(value) => (value?.nombreLista ? value.nombreLista : value)}
            />

            {/* Modal de Creación */}
            <Modal
                isOpen={isCreateModalOpen}
                onRequestClose={() => setIsCreateModalOpen(false)}
                contentLabel="Añadir Vara"
                ariaHideApp={false}
                className="formulario-table-modal-form"
                overlayClassName="formulario-table-overlay"
            >
                <h2 className="formulario-table-modal-title">Añadir Vara</h2>
                <form onSubmit={handleCreateModalSubmit} className="formulario-table-formulario-table">
                    <div className="formulario-table-field-group">
                        <label htmlFor="fechaLlegada">Fecha de Llegada:</label>
                        <input
                            type="date"
                            id="fechaLlegada"
                            name="fechaLlegada"
                            value={newAnimalVaraData.fechaLlegada}
                            onChange={handleCreateModalChange}
                            required
                            className="formulario-table-input"
                        />
                    </div>
                    <div className="formulario-table-field-group">
                        <label htmlFor="temperaturaLlegada">Temperatura de Llegada:</label>
                        <input
                            type="number"
                            id="temperaturaLlegada"
                            name="temperaturaLlegada"
                            value={newAnimalVaraData.temperaturaLlegada}
                            onChange={handleCreateModalChange}
                            required
                            className="formulario-table-input"
                        />
                    </div>
                    <div className="formulario-table-field-group">
                        <label htmlFor="precioTotalVara">Precio total Vara:</label>
                        <input
                            type="number"
                            id="precioTotalVara"
                            name="precioTotalVara"
                            value={newAnimalVaraData.precioTotalVara}
                            onChange={handleCreateModalChange}
                            required
                            className="formulario-table-input"
                        />
                    </div>
                  
                    <div className="formulario-table-field-group">
    <label htmlFor="nombreLista">Lista de Precios:</label>
    <select
        id="nombreLista"
        name="tipoAnimal.nombreLista"  // Es importante usar el nombre correcto para actualizar el campo dentro de tipoAnimal
        value={newAnimalVaraData.tipoAnimal.nombreLista}  // Usamos el valor correcto de tipoAnimal.nombreLista
        onChange={handleCreateModalChange}
        required
        className="formulario-table-input tipo-cuenta-select"
    >
        <option value="">Selecciona una Lista de Precios</option>
        {tiposAnimales.map((tipo) => (
            <option key={tipo.id} value={tipo.nombreLista}>
                {tipo.nombreLista}  {/* Muestra el nombreLista */}
            </option>
        ))}
    </select>
</div>            <div className="formulario-table-form-actions">
                        <button type="submit" className="formulario-table-btn-confirm">
                            Crear
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                            className="formulario-table-btn-cancel"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal de Edición */}
            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={() => setIsEditModalOpen(false)}
                contentLabel="Editar Vara"
                ariaHideApp={false}
                className="formulario-table-modal-form"
                overlayClassName="formulario-table-overlay"
            >
                <h2 className="formulario-table-modal-title">Editar Vara</h2>
                <form onSubmit={handleEditSubmit} className="formulario-table-formulario-table">
                    <div className="formulario-table-field-group">
                        <label htmlFor="fechaLlegada">Fecha de Llegada:</label>
                        <input
                            type="date"
                            id="fechaLlegada"
                            name="fechaLlegada"
                            value={formData.fechaLlegada}
                            onChange={handleEditChange}
                            required
                            className="formulario-table-input"
                        />
                    </div>
                    <div className="formulario-table-field-group">
                        <label htmlFor="temperaturaLlegada">Temperatura de Llegada:</label>
                        <input
                            type="number"
                            id="temperaturaLlegada"
                            name="temperaturaLlegada"
                            value={formData.temperaturaLlegada}
                            onChange={handleEditChange}
                            required
                            className="formulario-table-input"
                        />
                    </div>
                    <div className="formulario-table-field-group">
                        <label htmlFor="precioTotalVara">Precio total Vara:</label>
                        <input
                            type="text"
                            id="precioTotalVara"
                            name="precioTotalVara"
                            value={formData.precioTotalVara}
                            onChange={handleEditChange}
                            required
                            className="formulario-table-input"
                        />
                    </div>
                    <div className="formulario-table-field-group">
                    <label htmlFor="nombreLista">Lista de Precios:</label>
                    <select
                        id="nombreLista"
                        name="tipoAnimal.nombreLista"  // Es importante usar el nombre correcto para actualizar el campo dentro de tipoAnimal
                        value={formData.tipoAnimal}  // Usamos el valor correcto de tipoAnimal.nombreLista
                        onChange={handleEditChange}
                        required
                        className="formulario-table-input tipo-cuenta-select"
                    >
                        <option value="">Selecciona una Lista de Precios</option>
                        {tiposAnimales.map((tipo) => (
                            <option key={tipo.id} value={tipo.nombreLista}>
                                {tipo.nombreLista}  {/* Muestra el nombreLista */}
                            </option>
                        ))}
                    </select>
                </div>  
                    <div className="formulario-table-form-actions">
                        <button type="submit" className="formulario-table-btn-confirm">
                            Actualizar
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="formulario-table-btn-cancel"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </Modal>

           {/* Modal de Eliminación */}
                 <Modal
                   isOpen={isDeleteModalOpen}
                   onRequestClose={handleDeleteModalClose}
                   contentLabel="Eliminar Proveedor"
                   ariaHideApp={false}
                   className="formulario-table-modal-form"
                   overlayClassName="formulario-table-overlay"
                 >
                   <h2 className="formulario-table-modal-title">¿Estás seguro que deseas eliminar este proveedor?</h2>
                   <div className="formulario-table-form-actions">
                     <button
                       onClick={confirmDelete}
                       className="formulario-table-btn-confirm"
                     >
                       Eliminar
                     </button>
                     <button
                       onClick={handleDeleteModalClose}
                       className="formulario-table-btn-cancel"
                     >
                       Cancelar
                     </button>
                   </div>
                 </Modal>
        </div>
    );
};

export default AnimalVara;

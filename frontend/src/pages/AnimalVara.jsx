import React, { useState, useEffect } from "react";
import { useGetAnimalVara } from "@hooks/animalVara/useGetAnimalVara"; 
import { useCreateAnimalVara } from "@hooks/animalVara/useCreateAnimalVara";
import { useDeleteAnimalVara } from "@hooks/animalVara/useDeleteAnimalVara";
import { useUpdateAnimalVara } from "@hooks/animalVara/useUpdateAnimalVara";
import { useErrorHandlerAnimalVara } from "@hooks/animalVara/useErrorHandlerAnimalVara";
import { getAllAnimalCortesService } from '../services/animalCorte.service';
import { MdOutlineEdit } from "react-icons/md";
import Swal from 'sweetalert2';

import Table from "../components/Table";
import Modal from "react-modal";
import styles from "@styles/categoria.module.css";
import "@styles/formulariotable.css";
import "@styles/modalDetalles.css";
import "@styles/modalCrear.css";

const AnimalVara = () => {
    const { animalVaras, loading, error, fetchAnimalVaras } = useGetAnimalVara();
    const { handleCreate } = useCreateAnimalVara(fetchAnimalVaras);
    const { handleDelete } = useDeleteAnimalVara(fetchAnimalVaras);
    const { handleUpdate } = useUpdateAnimalVara(fetchAnimalVaras);
    const { createError, editError, handleCreateError, handleEditError } = useErrorHandlerAnimalVara();

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
        tipoAnimalId: "", // Usar id
    });

    const [formData, setFormData] = useState({
        fechaLlegada: "",
        temperaturaLlegada: "",
        precioTotalVara: "",
        tipoAnimalId: "", // Usar id
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
    }, []);    const varasData = Array.isArray(animalVaras) && animalVaras[0] ? animalVaras[0] : [];

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
        tipoAnimalId: animalVara.tipoAnimal.id, // Usar el id, no el nombreLista
    });
    setIsEditModalOpen(true);
};

    // Manejo de creación
    const handleCreateClick = () => {
        setIsCreateModalOpen(true);
    };

    const handleCreateModalChange = (e) => {
        const { name, value } = e.target;
        setNewAnimalVaraData({ ...newAnimalVaraData, [name]: value });
    };
    // Manejo de cambios en el formulario de edición
const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

    const handleCreateModalSubmit = (e) => {
        e.preventDefault();
        const hasErrors = handleCreateError(newAnimalVaraData, tiposAnimales);
        if (!hasErrors) {
            handleCreate(newAnimalVaraData);  
            setNewAnimalVaraData({
                fechaLlegada: "",
                temperaturaLlegada: "",
                precioTotalVara: "",
                tipoAnimalId: "",
            });
            setIsCreateModalOpen(false);
        }
    };
const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
        ...formData,
        tipoAnimalId: formData.tipoAnimalId,
    };
    const hasErrors = handleEditError(updatedData, tiposAnimales);
    if (!hasErrors) {
        handleUpdate(animalVaraToEdit.id, updatedData);  
        setIsEditModalOpen(false);
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
                showExcelButton={false}
                entidad="animal-vara"
                customFormat={(value, key) => {
                    if (key === "precioTotalVara" && (typeof value === "number" || !isNaN(parseFloat(value)))) {
                        return `$${parseFloat(value).toLocaleString('es-CL')}`;
                    }
                    return value?.nombreLista ? value.nombreLista : value;
                }}
            />

            {/* Modal de Creación */}
            <Modal
                isOpen={isCreateModalOpen}
                onRequestClose={() => setIsCreateModalOpen(false)}
                contentLabel="Añadir Vara"
                ariaHideApp={false}
                className="modal-crear"
                overlayClassName="modal-overlay"
                closeTimeoutMS={300}
            >                <form onSubmit={handleCreateModalSubmit} className="modal-crear-formulario">
                    <div className="modal-crear-header">
                        <h2 className="modal-crear-titulo">Crear Vara</h2>
                        <button type="button" onClick={() => setIsCreateModalOpen(false)} className="modal-crear-cerrar">×</button>
                        <button type="submit" className="modal-boton-crear">Guardar</button>
                    </div>                    {/* Fecha de Llegada */}
                    <div className="formulario-grupo">
                        <label className="formulario-etiqueta">Fecha de Llegada:</label>
                        <div className="input-container">
                            <input
                                type="date"
                                id="fechaLlegada"
                                name="fechaLlegada"
                                value={newAnimalVaraData.fechaLlegada}
                                onChange={handleCreateModalChange}
                                required
                                className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'fechaLlegada') ? 'input-error' : ''}`}
                            />
                            {createError && createError.errors?.map((error, index) => (
                              error.field === 'fechaLlegada' && (
                                <div key={index} className="error-message">
                                  {error.message}
                                </div>
                              )
                            ))}
                        </div>
                    </div>                    {/* Temperatura de Llegada */}
                    <div className="formulario-grupo">
                        <label className="formulario-etiqueta">Temperatura de Llegada (°C):</label>
                        <div className="input-container">
                            <input
                                type="number"
                                id="temperaturaLlegada"
                                name="temperaturaLlegada"
                                value={newAnimalVaraData.temperaturaLlegada}
                                onChange={handleCreateModalChange}
                                required
                                step="0.1"
                                className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'temperaturaLlegada') ? 'input-error' : ''}`}
                            />
                            {createError && createError.errors?.map((error, index) => (
                              error.field === 'temperaturaLlegada' && (
                                <div key={index} className="error-message">
                                  {error.message}
                                </div>
                              )
                            ))}
                        </div>
                    </div>                    {/* Precio Total Vara */}
                    <div className="formulario-grupo">
                        <label className="formulario-etiqueta">Precio Total Vara ($):</label>
                        <div className="input-container">
                            <input
                                type="number"
                                id="precioTotalVara"
                                name="precioTotalVara"
                                value={newAnimalVaraData.precioTotalVara}
                                onChange={handleCreateModalChange}
                                required
                                min="0"
                                step="1"                                
                                pattern="^[0-9]+$"
                                inputMode="numeric"
                                onKeyDown={e => {
                                    if (e.key === '-' || e.key === '.' || e.key === ',') e.preventDefault();
                                }}
                                className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioTotalVara') ? 'input-error' : ''}`}
                            />
                            {createError && createError.errors?.map((error, index) => (
                              error.field === 'precioTotalVara' && (
                                <div key={index} className="error-message">
                                  {error.message}
                                </div>
                              )
                            ))}
                        </div>
                    </div>                    {/* Lista de Precios (Crear) */}
                    <div className="formulario-grupo">
                        <label className="formulario-etiqueta">Lista de Precios:</label>
                        <div className="input-container">
                            <select
                                id="tipoAnimalId"
                                name="tipoAnimalId"
                                value={newAnimalVaraData.tipoAnimalId}
                                onChange={handleCreateModalChange}
                                required
                                className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'tipoAnimal') ? 'input-error' : ''}`}
                            >
                                <option value="">Selecciona una Lista de Precios</option>
                                {tiposAnimales.map((tipo) => (
                                    <option key={tipo.id} value={tipo.id}>
                                        {tipo.nombreLista}
                                    </option>
                                ))}
                            </select>
                            {createError && createError.errors?.map((error, index) => (
                              error.field === 'tipoAnimal' && (
                                <div key={index} className="error-message">
                                  {error.message}
                                </div>
                              )
                            ))}
                        </div>
                    </div>
                    
                </form>
            </Modal>

            {/* Modal de Edición */}
            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={() => setIsEditModalOpen(false)}
                contentLabel="Editar Vara"
                ariaHideApp={false}
                className="modal-crear"  
                overlayClassName="modal-overlay"
                closeTimeoutMS={300}
            >                <form onSubmit={handleEditSubmit} className="modal-crear-formulario">
                    <div className="modal-crear-header">
                        <h2 className="modal-crear-titulo">Editar Vara</h2>
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="modal-crear-cerrar">×</button>
                        <button type="submit" className="modal-boton-crear">Guardar</button>
                    </div>                    {/* Fecha de Llegada */}
                    <div className="formulario-grupo">
                        <label className="formulario-etiqueta">Fecha de Llegada:</label>
                        <div className="input-container">
                            <input
                                type="date"
                                id="fechaLlegada"
                                name="fechaLlegada"
                                value={formData.fechaLlegada}
                                onChange={handleEditChange}
                                required
                                className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'fechaLlegada') ? 'input-error' : ''}`}
                            />
                            {editError && editError.errors?.map((error, index) => (
                              error.field === 'fechaLlegada' && (
                                <div key={index} className="error-message">
                                  {error.message}
                                </div>
                              )
                            ))}
                        </div>
                    </div>                    {/* Temperatura de Llegada */}
                    <div className="formulario-grupo">
                        <label className="formulario-etiqueta">Temperatura de Llegada (°C):</label>
                        <div className="input-container">
                            <input
                                type="number"
                                id="temperaturaLlegada"
                                name="temperaturaLlegada"
                                value={formData.temperaturaLlegada}
                                onChange={handleEditChange}
                                required
                                step="0.1"
                                className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'temperaturaLlegada') ? 'input-error' : ''}`}
                            />
                            {editError && editError.errors?.map((error, index) => (
                              error.field === 'temperaturaLlegada' && (
                                <div key={index} className="error-message">
                                  {error.message}
                                </div>
                              )
                            ))}
                        </div>
                    </div>                    {/* Precio Total Vara */}
                    <div className="formulario-grupo">
                        <label className="formulario-etiqueta">Precio Total Vara ($):</label>
                        <div className="input-container">
                            <input
                                type="number"
                                id="precioTotalVara"
                                name="precioTotalVara"
                                value={formData.precioTotalVara}
                                onChange={handleEditChange}
                                required
                                min="0"
                                step="1"                                
                                pattern="^[0-9]+$"
                                inputMode="numeric"
                                onKeyDown={e => {
                                    if (e.key === '-' || e.key === '.' || e.key === ',') e.preventDefault();
                                }}
                                className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioTotalVara') ? 'input-error' : ''}`}
                            />
                            {editError && editError.errors?.map((error, index) => (
                              error.field === 'precioTotalVara' && (
                                <div key={index} className="error-message">
                                  {error.message}
                                </div>
                              )
                            ))}
                        </div>
                    </div>                    {/* Lista de Precios (Editar) */}
                    <div className="formulario-grupo">
                        <label className="formulario-etiqueta">Lista de Precios:</label>
                        <div className="input-container">
                            <select
                                id="tipoAnimalId"
                                name="tipoAnimalId"
                                value={formData.tipoAnimalId}
                                onChange={handleEditChange}
                                required
                                className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'tipoAnimal') ? 'input-error' : ''}`}
                            >
                                <option value="">Selecciona una Lista de Precios</option>
                                {tiposAnimales.map((tipo) => (
                                    <option key={tipo.id} value={tipo.id}>
                                        {tipo.nombreLista}
                                    </option>
                                ))}
                            </select>
                            {editError && editError.errors?.map((error, index) => (
                              error.field === 'tipoAnimal' && (
                                <div key={index} className="error-message">
                                  {error.message}
                                </div>
                              )
                            ))}
                        </div>
                    </div>
                </form>
            </Modal>            {/* Modal de Eliminación */}
            <Modal
                isOpen={isDeleteModalOpen}
                onRequestClose={handleDeleteModalClose}
                contentLabel="Confirmar Eliminación"
                ariaHideApp={false}
                className="formulario-table-modal-form"
                overlayClassName="formulario-table-overlay"
                style={{ content: { maxWidth: '400px' } }}
            >                <h2 className="formulario-table-modal-title">Confirmar Eliminación</h2>
                <p>¿Estás seguro de que deseas eliminar esta vara?</p>
                <div style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                    <p><strong>Lista de Precios:</strong> {animalVaraToDelete?.tipoAnimal?.nombreLista}</p>
                    <p><strong>Fecha de Llegada:</strong> {animalVaraToDelete?.fechaLlegada}</p>
                </div>
                <div className="formulario-table-form-actions">
                    <button 
                        onClick={confirmDelete}
                        className="formulario-table-btn-confirm"
                        style={{ backgroundColor: '#dc3545' }}
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

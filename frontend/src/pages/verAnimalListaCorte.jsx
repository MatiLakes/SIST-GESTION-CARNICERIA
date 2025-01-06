import React, { useEffect, useState } from "react";
import { useGetAnimalCorte } from "@hooks/animalCorte/useGetAnimalCorte";
import { useCreateAnimalCorte } from "@hooks/animalCorte/useCreateAnimalCorte";
import { useDeleteAnimalCorte } from "@hooks/animalCorte/useDeleteAnimalCorte";
import { useUpdateAnimalCorte } from "@hooks/animalCorte/useUpdateAnimalCorte";
import Table from "../components/Table";
import Modal from "react-modal";
import styles from "@styles/categoria.module.css";
import "@styles/formulariotable.css";
import "@styles/modaldatos.css";

import Swal from "sweetalert2";

const VerAnimalListaCorte = () => {
  const { animalCortes, loading, error, fetchAnimalCortes } = useGetAnimalCorte();
  const { handleCreate } = useCreateAnimalCorte(fetchAnimalCortes);
  const { handleDelete } = useDeleteAnimalCorte(fetchAnimalCortes);
  const { handleUpdate } = useUpdateAnimalCorte(fetchAnimalCortes);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // Modal de ver
  const [animalCorteToEdit, setAnimalCorteToEdit] = useState(null);
  const [animalCorteToDelete, setAnimalCorteToDelete] = useState(null);
  const [animalCorteToView, setAnimalCorteToView] = useState(null); // Estado para el corte a visualizar
  const [newAnimalCorteData, setNewAnimalCorteData] = useState({ nombreLista: "",abastero: "",
    precioAbastero: "",
    asadoTira: "",
    precioAsadoTira: "",
    asadoCarnicero: "",
    precioAsadoCarnicero: "",
    asiento: "",
    precioAsiento: "",
    choclillo: "",
    precioChoclillo: "",
    cogote: "",
    precioCogote: "",
    entraña: "",
    precioEntraña: "",
    filete: "",
    precioFilete: "",
    ganso: "",
    precioGanso: "",
    huachalomo: "",
    precioHuachalomo: "",
    lomoLiso: "",
    precioLomoLiso: "",
    lomoVetado: "",
    precioLomoVetado: "",
    palanca: "",
    precioPalanca: "",
    plateada: "",
    precioPlateada: "",
    polloBarriga: "",
    precioPolloBarriga: "",
    polloGanso: "",
    precioPolloGanso: "",
    postaNegra: "",
    precioPostaNegra: "",
    postaPaleta: "",
    precioPostaPaleta: "",
    postaRosada: "",
    precioPostaRosada: "",
    puntaGanso: "",
    precioPuntaGanso: "",
    puntaPicana: "",
    precioPuntaPicana: "",
    puntaPaleta: "",
    precioPuntaPaleta: "",
    sobrecostilla: "",
    precioSobrecostilla: "",
    tapabarriga: "",
    precioTapabarriga: "",
    tapapecho: "",
    precioTapapecho: "",
    huesoCarnudo: "",
    precioHuesoCarnudo: "",
    huesoCConCarne: "",
    precioHuesoCConCarne: "",
    pataVacuno: "",
    precioPataVacuno: "",
    huachalomoOlla: "",
    precioHuachalomoOlla: "",
    cazuelaPaleta: "",
    precioCazuelaPaleta: "",
    osobuco: "",
    precioOsobuco: "",
    lagarto: "",
    precioLagarto: "",
    costillaVacuno: "",
    precioCostillaVacuno: "",
    tapaposta: "",
    precioTapaposta: "",
    malaya: "",
    precioMalaya: "" });
  const [formData, setFormData] = useState({ nombreLista: "",abastero: "",
    precioAbastero: "",
    asadoTira: "",
    precioAsadoTira: "",
    asadoCarnicero: "",
    precioAsadoCarnicero: "",
    asiento: "",
    precioAsiento: "",
    choclillo: "",
    precioChoclillo: "",
    cogote: "",
    precioCogote: "",
    entraña: "",
    precioEntraña: "",
    filete: "",
    precioFilete: "",
    ganso: "",
    precioGanso: "",
    huachalomo: "",
    precioHuachalomo: "",
    lomoLiso: "",
    precioLomoLiso: "",
    lomoVetado: "",
    precioLomoVetado: "",
    palanca: "",
    precioPalanca: "",
    plateada: "",
    precioPlateada: "",
    polloBarriga: "",
    precioPolloBarriga: "",
    polloGanso: "",
    precioPolloGanso: "",
    postaNegra: "",
    precioPostaNegra: "",
    postaPaleta: "",
    precioPostaPaleta: "",
    postaRosada: "",
    precioPostaRosada: "",
    puntaGanso: "",
    precioPuntaGanso: "",
    puntaPicana: "",
    precioPuntaPicana: "",
    puntaPaleta: "",
    precioPuntaPaleta: "",
    sobrecostilla: "",
    precioSobrecostilla: "",
    tapabarriga: "",
    precioTapabarriga: "",
    tapapecho: "",
    precioTapapecho: "",
    huesoCarnudo: "",
    precioHuesoCarnudo: "",
    huesoCConCarne: "",
    precioHuesoCConCarne: "",
    pataVacuno: "",
    precioPataVacuno: "",
    huachalomoOlla: "",
    precioHuachalomoOlla: "",
    cazuelaPaleta: "",
    precioCazuelaPaleta: "",
    osobuco: "",
    precioOsobuco: "",
    lagarto: "",
    precioLagarto: "",
    costillaVacuno: "",
    precioCostillaVacuno: "",
    tapaposta: "",
    precioTapaposta: "",
    malaya: "",
    precioMalaya: "" });

  useEffect(() => {
    if (animalCortes && animalCortes[0]) {
      console.log("Datos obtenidos:", animalCortes[0]);
    }
  }, [animalCortes]);

  const handleDeleteClick = (animalCorte) => {
    setAnimalCorteToDelete(animalCorte);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setAnimalCorteToDelete(null);
  };

  const confirmDelete = () => {
    handleDelete(animalCorteToDelete.id);
    setIsDeleteModalOpen(false);
    setAnimalCorteToDelete(null);
  };

  const handleUpdateClick = (animalCorte) => {
    setAnimalCorteToEdit(animalCorte);
    setFormData({   nombreLista: animalCorte.nombreLista,
      abastero: animalCorte.abastero,
      precioAbastero: animalCorte.precioAbastero,
      asadoTira: animalCorte.asadoTira,
      precioAsadoTira: animalCorte.precioAsadoTira,
      asadoCarnicero: animalCorte.asadoCarnicero,
      precioAsadoCarnicero: animalCorte.precioAsadoCarnicero,
      asiento: animalCorte.asiento,
      precioAsiento: animalCorte.precioAsiento,
      choclillo: animalCorte.choclillo,
      precioChoclillo: animalCorte.precioChoclillo,
      cogote: animalCorte.cogote,
      precioCogote: animalCorte.precioCogote,
      entraña: animalCorte.entraña,
      precioEntraña: animalCorte.precioEntraña,
      filete: animalCorte.filete,
      precioFilete: animalCorte.precioFilete,
      ganso: animalCorte.ganso,
      precioGanso: animalCorte.precioGanso,
      huachalomo: animalCorte.huachalomo,
      precioHuachalomo: animalCorte.precioHuachalomo,
      lomoLiso: animalCorte.lomoLiso,
      precioLomoLiso: animalCorte.precioLomoLiso,
      lomoVetado: animalCorte.lomoVetado,
      precioLomoVetado: animalCorte.precioLomoVetado,
      palanca: animalCorte.palanca,
      precioPalanca: animalCorte.precioPalanca,
      plateada: animalCorte.plateada,
      precioPlateada: animalCorte.precioPlateada,
      polloBarriga: animalCorte.polloBarriga,
      precioPolloBarriga: animalCorte.precioPolloBarriga,
      polloGanso: animalCorte.polloGanso,
      precioPolloGanso: animalCorte.precioPolloGanso,
      postaNegra: animalCorte.postaNegra,
      precioPostaNegra: animalCorte.precioPostaNegra,
      postaPaleta: animalCorte.postaPaleta,
      precioPostaPaleta: animalCorte.precioPostaPaleta,
      postaRosada: animalCorte.postaRosada,
      precioPostaRosada: animalCorte.precioPostaRosada,
      puntaGanso: animalCorte.puntaGanso,
      precioPuntaGanso: animalCorte.precioPuntaGanso,
      puntaPicana: animalCorte.puntaPicana,
      precioPuntaPicana: animalCorte.precioPuntaPicana,
      puntaPaleta: animalCorte.puntaPaleta,
      precioPuntaPaleta: animalCorte.precioPuntaPaleta,
      sobrecostilla: animalCorte.sobrecostilla,
      precioSobrecostilla: animalCorte.precioSobrecostilla,
      tapabarriga: animalCorte.tapabarriga,
      precioTapabarriga: animalCorte.precioTapabarriga,
      tapapecho: animalCorte.tapapecho,
      precioTapapecho: animalCorte.precioTapapecho,
      huesoCarnudo: animalCorte.huesoCarnudo,
      precioHuesoCarnudo: animalCorte.precioHuesoCarnudo,
      huesoCConCarne: animalCorte.huesoCConCarne,
      precioHuesoCConCarne: animalCorte.precioHuesoCConCarne,
      pataVacuno: animalCorte.pataVacuno,
      precioPataVacuno: animalCorte.precioPataVacuno,
      huachalomoOlla: animalCorte.huachalomoOlla,
      precioHuachalomoOlla: animalCorte.precioHuachalomoOlla,
      cazuelaPaleta: animalCorte.cazuelaPaleta,
      precioCazuelaPaleta: animalCorte.precioCazuelaPaleta,
      osobuco: animalCorte.osobuco,
      precioOsobuco: animalCorte.precioOsobuco,
      lagarto: animalCorte.lagarto,
      precioLagarto: animalCorte.precioLagarto,
      costillaVacuno: animalCorte.costillaVacuno,
      precioCostillaVacuno: animalCorte.precioCostillaVacuno,
      tapaposta: animalCorte.tapaposta,
      precioTapaposta: animalCorte.precioTapaposta,
      malaya: animalCorte.malaya,
      precioMalaya: animalCorte.precioMalaya
                  
     });
    setIsEditModalOpen(true);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalChange = (e) => {
    setNewAnimalCorteData({ ...newAnimalCorteData, [e.target.name]: e.target.value });
  };

  const handleCreateModalSubmit = (e) => {
    e.preventDefault();
  
    // Asegúrate de que todos los valores necesarios sean números válidos
    const validatedData = { ...newAnimalCorteData };
    for (let key in validatedData) {
      if (validatedData[key] === '') {
        validatedData[key] = 0; // Si es vacío, asigna 0
      }
    }
  
    // Validar el campo nombreLista antes de crear
    if (!validateFields(validatedData)) {
      return; // Si la validación falla, no continúa con el proceso
    }
  
    handleCreate(validatedData);
    setNewAnimalCorteData({ nombreLista: "" });
    setIsCreateModalOpen(false);
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    // Validar antes de enviar los datos de edición
    if (!validateFields(formData)) {
      return; // Si la validación falla, no continúa con el proceso
    }
    
    if (animalCorteToEdit) {
      handleUpdate(animalCorteToEdit.id, formData);
      setIsEditModalOpen(false);
    }
  };

  const validateFields = (data) => {
    // Validación de nombreLista (mínimo 3 caracteres y solo letras y espacios)
    const regex = /^[A-Za-z\s]+$/; // Expresión regular para permitir solo letras y espacios
    
    if (data.nombreLista.length < 3) {
      Swal.fire("Error", "El nombre de la lista debe tener al menos 3 caracteres.", "error");
      return false;
    }
  
    if (!regex.test(data.nombreLista)) {
      Swal.fire("Error", "El nombre de la lista solo puede contener letras y espacios.", "error");
      return false;
    }
  
    return true;
  };
  
  const handleViewClick = (animalCorte) => {
    setAnimalCorteToView(animalCorte);
    setIsViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setAnimalCorteToView(null);
  };

  if (loading) return <p>Cargando cortes de animales...</p>;
  if (error) return <p>Error: {error}</p>;
  const columns = [
    { header: "ID", key: "id" },
    { header: "Nombre", key: "nombreLista" },
  ];

  return (
    <div className={styles["categoria-container"]}>
      <Table
        data={animalCortes && animalCortes[0] ? animalCortes[0] : []}
        columns={columns}
        headerTitle="Listas de precios"
        onCreate={handleCreateClick}
        onEdit={handleUpdateClick}
        onDelete={handleDeleteClick}
        onView={handleViewClick} // Pasa la función onView
        showEditAllButton={false}
        showEditButton={true}
        showDeleteButton={true}
        showCreateButton={true}
        showViewButton={true} // Asegúrate de mostrar el botón de "Ver"
        showCalendarButton = {false}
      />

      {/* Modal de Creación */}
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        contentLabel="Añadir Corte de Animal"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">Añadir lista de Precios</h2>
        <form onSubmit={handleCreateModalSubmit} className="formulario-table-formulario-table">
        <div className="formulario-table-field-group">
                <label htmlFor="nombreLista">Nombre de la lista:</label>
                <input
                  type="text"
                  id="nombreLista"
                  name="nombreLista"
                  value={newAnimalCorteData.nombreLista}
                  onChange={handleCreateModalChange}
                  required
                  className="formulario-table-input"
                />
              </div>
  
              <div className="formulario-table-form-group">
  <div className="formulario-table-field-group">
    <label htmlFor="cantidadAbastecedor">Cantidad Abastecedor:</label>
    <input
      type="number"
      id="cantidadAbastecedor"
      name="abastero"
      value={newAnimalCorteData.abastero || 0} 
      onChange={handleCreateModalChange}
      required
      min="0"
      step="0.1"
      className="formulario-table-input"
    />
  </div>

  <div className="formulario-table-field-group">
    <label htmlFor="precioAbastero">Precio Abastecedor:</label>
    <input
      type="number"
      id="precioAbastero"
      name="PrecioAbastero"
      value={newAnimalCorteData.PrecioAbastero || 0} 
      onChange={handleCreateModalChange}
      required
      min="0"
      step="1"
      className="formulario-table-input"
    />
  </div>
  </div>
  
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="cantidadAsadoTira">Cantidad Asado Tira:</label>
    <input
    type="number"
    id="cantidadAsadoTira"
    name="asadoTira"
    value={newAnimalCorteData.asadoTira || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioAsadoTira">Precio Asado Tira:</label>
    <input
    type="number"
    id="precioAsadoTira"
    name="precioAsadoTira"
    value={newAnimalCorteData.precioAsadoTira || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="asadoCarnicero">Cantidad Asado Carnicero:</label>
    <input
    type="number"
    id="asadoCarniceror"
    name="asadoCarnicero"
    value={newAnimalCorteData.asadoCarnicero || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioAsadoCarnicero">Precio Asado Carnicero:</label>
    <input
    type="number"
    id="precioAsadoCarnicero"
    name="precioAsadoCarnicero"
    value={newAnimalCorteData.precioAsadoCarnicero || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="asiento">Cantidad Asiento:</label>
    <input
    type="number"
    id="asientor"
    name="asiento"
    value={newAnimalCorteData.asiento || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioAsiento">Precio Asiento:</label>
    <input
    type="number"
    id="precioAsiento"
    name="precioAsiento"
    value={newAnimalCorteData.precioAsiento || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="choclillo">Cantidad Choclillo:</label>
    <input
    type="number"
    id="choclillo"
    name="choclillo"
    value={newAnimalCorteData.choclillo || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioChoclillo">Precio Choclillo:</label>
    <input
    type="number"
    id="precioChoclillo"
    name="precioChoclillo"
    value={newAnimalCorteData.precioChoclillo || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="cogote">Cantidad Cogote:</label>
    <input
    type="number"
    id="cogote"
    name="cogote"
    value={newAnimalCorteData.cogote || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioCogote">Precio Cogote:</label>
    <input
    type="number"
    id="precioCogote"
    name="precioCogote"
    value={newAnimalCorteData.precioCogote || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="entraña">Cantidad entraña:</label>
    <input
    type="number"
    id="entraña"
    name="entraña"
    value={newAnimalCorteData.entraña || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioEntraña">Precio Entraña:</label>
    <input
    type="number"
    id="precioEntraña"
    name="precioEntraña"
    value={newAnimalCorteData.precioEntraña || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="fileter">Cantidad Filete:</label>
    <input
    type="number"
    id="filete"
    name="filete"
    value={newAnimalCorteData.filete || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioFilete">Precio Filete:</label>
    <input
    type="number"
    id="precioFilete"
    name="precioFilete"
    value={newAnimalCorteData.precioFilete || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="ganso">Cantidad Ganso:</label>
    <input
    type="number"
    id="ganso"
    name="ganso"
    value={newAnimalCorteData.ganso || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioGanso">Precio Ganso:</label>
    <input
    type="number"
    id="precioGanso"
    name="precioGanso"
    value={newAnimalCorteData.precioGanso || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="huachalomo">Cantidad Huachalomo:</label>
    <input
    type="number"
    id="huachalomo"
    name="huachalomo"
    value={newAnimalCorteData.huachalomo || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioHuachalomo">Precio Huachalomo:</label>
    <input
    type="number"
    id="precioHuachalomo"
    name="precioHuachalomo"
    value={newAnimalCorteData.precioHuachalomo|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="lomoLiso">Cantidad Lomo Liso:</label>
    <input
    type="number"
    id="lomoLiso"
    name="lomoLiso"
    value={newAnimalCorteData.lomoLiso || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioLomoLiso">Precio Lomo Liso:</label>
    <input
    type="number"
    id="precioLomoLiso"
    name="precioLomoLiso"
    value={newAnimalCorteData.precioLomoLiso || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="lomoVetado">Cantidad Lomo Vetado:</label>
    <input
    type="number"
    id="lomoVetado"
    name="lomoVetado"
    value={newAnimalCorteData.lomoVetado|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>


    <div className="formulario-table-field-group">
    <label htmlFor="precioLomoVetado">Precio Lomo Vetado:</label>
    <input
    type="number"
    id="precioLomoVetado"
    name="precioLomoVetado"
    value={newAnimalCorteData.precioLomoVetado || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="palanca">Cantidad Palanca:</label>
    <input
    type="number"
    id="palanca"
    name="palanca"
    value={newAnimalCorteData.palanca|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioPalanca">Precio Palanca:</label>
    <input
    type="number"
    id="precioPalanca"
    name="precioPalanca"
    value={newAnimalCorteData.precioPalanca|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="plateada">Cantidad Plateada:</label>
    <input
    type="number"
    id="plateada"
    name="plateada"
    value={newAnimalCorteData.plateada|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioPlateada">Precio Plateada:</label>
    <input
    type="number"
    id="precioPlateada"
    name="precioPlateada"
    value={newAnimalCorteData.precioPlateada|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="polloBarriga">Cantidad Pollo Barriga:</label>
    <input
    type="number"
    id="polloBarriga"
    name="polloBarriga"
    value={newAnimalCorteData.polloBarriga|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioPolloBarriga">Precio Pollo Barriga:</label>
    <input
    type="number"
    id="precioPolloBarriga"
    name="precioPolloBarriga"
    value={newAnimalCorteData.precioPolloBarriga || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="polloGanso">Cantidad Pollo Ganso:</label>
    <input
    type="number"
    id="polloGanso"
    name="polloGanso"
    value={newAnimalCorteData.polloGanso|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioPolloGanso">Precio Pollo Ganso:</label>
    <input
    type="number"
    id="precioPolloGanso"
    name="precioPolloGanso"
    value={newAnimalCorteData.precioPolloGanso || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="postaNegra">Cantidad Posta Negra:</label>
    <input
    type="number"
    id="postaNegra"
    name="postaNegra"
    value={newAnimalCorteData.postaNegra|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioPostaNegra">Precio Posta Negra:</label>
    <input
    type="number"
    id="precioPostaNegra"
    name="precioPostaNegra"
    value={newAnimalCorteData.precioPostaNegra|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>




    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="postaPaleta">Cantidad Posta Paleta:</label>
    <input
    type="number"
    id="postaPaleta"
    name="postaPaleta"
    value={newAnimalCorteData.postaPaleta|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioPostaPaleta">Precio Posta Paleta:</label>
    <input
    type="number"
    id="precioPostaPaleta"
    name="precioPostaPaleta"
    value={newAnimalCorteData.precioPostaPaleta|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="postaRosada">Cantidad Posta Rosada:</label>
    <input
    type="number"
    id="postaRosada"
    name="postaRosada"
    value={newAnimalCorteData.postaRosada|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioPostaRosada">Precio Posta Rosada:</label>
    <input
    type="number"
    id="precioPostaRosada"
    name="precioPostaRosada"
    value={newAnimalCorteData.precioPostaRosada || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="puntaGanso">Cantidad punta Ganso:</label>
    <input
    type="number"
    id="puntaGanso"
    name="puntaGanso"
    value={newAnimalCorteData.puntaGanso|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioPuntaGanso">Precio Punta Ganso:</label>
    <input
    type="number"
    id="precioPuntaGanso"
    name="precioPuntaGanso"
    value={newAnimalCorteData.precioPuntaGanso || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="puntaPicana">Cantidad Punta Picana:</label>
    <input
    type="number"
    id="puntaPicana"
    name="puntaPicana"
    value={newAnimalCorteData.puntaPicana|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioPuntaPicana">Precio Punta Picana:</label>
    <input
    type="number"
    id="precioPuntaPicana"
    name="precioPuntaPicana"
    value={newAnimalCorteData.precioPuntaPicana || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="puntaPaleta">Cantidad punta Paleta:</label>
    <input
    type="number"
    id="puntaPaleta"
    name="puntaPaleta"
    value={newAnimalCorteData.puntaPaleta|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioPuntaPaleta">Precio Punta Paleta:</label>
    <input
    type="number"
    id="precioPuntaPaleta"
    name="precioPuntaPaleta"
    value={newAnimalCorteData.precioPuntaPaleta|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="sobrecostilla">Cantidad Sobre Costilla:</label>
    <input
    type="number"
    id="sobrecostilla"
    name="sobrecostilla"
    value={newAnimalCorteData.sobrecostilla|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioSobrecostilla">Precio Sobre costilla:</label>
    <input
    type="number"
    id="precioSobrecostilla"
    name="precioSobrecostilla"
    value={newAnimalCorteData.precioSobrecostilla|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    









    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="tapabarriga">Cantidad Tapa barriga:</label>
    <input
    type="number"
    id="tapabarriga"
    name="tapabarriga"
    value={newAnimalCorteData.tapabarriga|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioTapabarriga">Precio Tapa barriga:</label>
    <input
    type="number"
    id="precioTapabarriga"
    name="precioTapabarriga"
    value={newAnimalCorteData.precioTapabarriga|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="tapapecho">Cantidad Tapapecho:</label>
    <input
    type="number"
    id="tapapecho"
    name="tapapecho"
    value={newAnimalCorteData.tapapecho|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioTapapecho">Precio Tapapecho:</label>
    <input
    type="number"
    id="precioTapapecho"
    name="precioTapapecho"
    value={newAnimalCorteData.precioTapapecho || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="huesoCarnudo">Cantidad Hueso Carnudo:</label>
    <input
    type="number"
    id="huesoCarnudo"
    name="huesoCarnudo"
    value={newAnimalCorteData.huesoCarnudo|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioHuesoCarnudo">Precio Hueso Carnudo:</label>
    <input
    type="number"
    id="precioHuesoCarnudo"
    name="precioHuesoCarnudo"
    value={newAnimalCorteData.precioHuesoCarnudo || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="huesoCConCarne">Cantidad hueso Con Carne:</label>
    <input
    type="number"
    id="huesoCConCarne"
    name="huesoCConCarne"
    value={newAnimalCorteData.huesoCConCarne|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioHuesoCConCarne">Precio Hueso Con Carne:</label>
    <input
    type="number"
    id="precioHuesoCConCarne"
    name="precioHuesoCConCarne"
    value={newAnimalCorteData.precioHuesoCConCarne || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="pataVacuno">Cantidad Pata Vacuno:</label>
    <input
    type="number"
    id="pataVacuno"
    name="pataVacuno"
    value={newAnimalCorteData.pataVacuno|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioPataVacuno">Precio Pata Vacuno:</label>
    <input
    type="number"
    id="precioPataVacuno"
    name="precioPataVacuno"
    value={newAnimalCorteData.precioPataVacuno|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    








    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="huachalomoOlla">Cantidad huachaLomo Olla:</label>
    <input
    type="number"
    id="huachalomoOlla"
    name="huachalomoOlla"
    value={newAnimalCorteData.huachalomoOlla|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioHuachalomoOlla">Precio Huachalomo Olla:</label>
    <input
    type="number"
    id="precioHuachalomoOlla"
    name="precioHuachalomoOlla"
    value={newAnimalCorteData.precioHuachalomoOlla || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="cazuelaPaleta">Cantidad Cazuela Paleta:</label>
    <input
    type="number"
    id="cazuelaPaleta"
    name="cazuelaPaleta"
    value={newAnimalCorteData.cazuelaPaleta|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioCazuelaPaleta">Precio Cazuela Paleta:</label>
    <input
    type="number"
    id="precioCazuelaPaleta"
    name="precioCazuelaPaleta"
    value={newAnimalCorteData.precioCazuelaPaleta || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="osobuco">Cantidad Osobuco:</label>
    <input
    type="number"
    id="osobuco"
    name="osobuco"
    value={newAnimalCorteData.osobuco|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioOsobuco">Precio Osobuco:</label>
    <input
    type="number"
    id="precioOsobuco"
    name="precioOsobuco"
    value={newAnimalCorteData.precioOsobuco || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="lagarto">Cantidad Lagarto:</label>
    <input
    type="number"
    id="lagarto"
    name="lagarto"
    value={newAnimalCorteData.lagarto|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioLagarto">Precio Lagarto:</label>
    <input
    type="number"
    id="precioLagarto"
    name="precioLagarto"
    value={newAnimalCorteData.precioLagarto || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="costillaVacuno">Cantidad Costilla Vacuno:</label>
    <input
    type="number"
    id="costillaVacuno"
    name="costillaVacuno"
    value={newAnimalCorteData.costillaVacuno|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioCostillaVacuno">Precio Costilla Vacuno:</label>
    <input
    type="number"
    id="precioCostillaVacuno"
    name="precioCostillaVacuno"
    value={newAnimalCorteData.precioCostillaVacuno || 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="tapaposta">Cantidad Tapaposta:</label>
    <input
    type="number"
    id="tapaposta"
    name="tapaposta"
    value={newAnimalCorteData.tapaposta|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioTapaposta">Precio Tapaposta:</label>
    <input
    type="number"
    id="precioTapaposta"
    name="precioTapaposta"
    value={newAnimalCorteData.precioTapaposta|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="malaya">Cantidad Malaya:</label>
    <input
    type="number"
    id="malaya"
    name="malaya"
    value={newAnimalCorteData.malaya|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioMalaya">Precio Malaya:</label>
    <input
    type="number"
    id="precioMalaya"
    name="precioMalaya"
    value={newAnimalCorteData.precioMalaya|| 0} 
    onChange={handleCreateModalChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    



          <div className="formulario-table-form-actions">
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
        contentLabel="Añadir Corte de Animal"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">Editar lista de Precios</h2>
        <form onSubmit={handleEditSubmit} className="formulario-table-formulario-table">
        <div className="formulario-table-field-group">
                <label htmlFor="nombreLista">Nombre de la lista:</label>
                <input
                  type="text"
                  id="nombreLista"
                  name="nombreLista"
                  value={formData.nombreLista}
                  onChange={handleEditChange}
                  required
                  className="formulario-table-input"
                />
              </div>
  
              <div className="formulario-table-form-group">
  <div className="formulario-table-field-group">
    <label htmlFor="cantidadAbastecedor">Cantidad Abastecedor:</label>
    <input
      type="number"
      id="cantidadAbastecedor"
      name="abastero"
      value={formData.abastero || 0} 
      onChange={handleEditChange}
      required
      min="0"
      step="0.1"
      className="formulario-table-input"
    />
  </div>

  <div className="formulario-table-field-group">
    <label htmlFor="precioAbastero">Precio Abastecedor:</label>
    <input
      type="number"
      id="precioAbastero"
      name="precioAbastero"
      value={formData.precioAbastero || 0} 
      onChange={handleEditChange}
      required
      min="0"
      step="1"
      className="formulario-table-input"
    />
  </div>
  </div>
  
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="cantidadAsadoTira">Cantidad Asado Tira:</label>
    <input
    type="number"
    id="cantidadAsadoTira"
    name="asadoTira"
    value={formData.asadoTira || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioAsadoTira">Precio Asado Tira:</label>
    <input
    type="number"
    id="precioAsadoTira"
    name="precioAsadoTira"
    value={formData.precioAsadoTira || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="asadoCarnicero">Cantidad Asado Carnicero:</label>
    <input
    type="number"
    id="asadoCarniceror"
    name="asadoCarnicero"
    value={formData.asadoCarnicero || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioAsadoCarnicero">Precio Asado Carnicero:</label>
    <input
    type="number"
    id="precioAsadoCarnicero"
    name="precioAsadoCarnicero"
    value={formData.precioAsadoCarnicero || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="asiento">Cantidad Asiento:</label>
    <input
    type="number"
    id="asientor"
    name="asiento"
    value={formData.asiento || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioAsiento">Precio Asiento:</label>
    <input
    type="number"
    id="precioAsiento"
    name="precioAsiento"
    value={formData.precioAsiento || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="choclillo">Cantidad Choclillo:</label>
    <input
    type="number"
    id="choclillo"
    name="choclillo"
    value={formData.choclillo || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioChoclillo">Precio Choclillo:</label>
    <input
    type="number"
    id="precioChoclillo"
    name="precioChoclillo"
    value={formData.precioChoclillo || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="cogote">Cantidad Cogote:</label>
    <input
    type="number"
    id="cogote"
    name="cogote"
    value={formData.cogote || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioCogote">Precio Cogote:</label>
    <input
    type="number"
    id="precioCogote"
    name="precioCogote"
    value={formData.precioCogote || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="entraña">Cantidad entraña:</label>
    <input
    type="number"
    id="entraña"
    name="entraña"
    value={formData.entraña || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioEntraña">Precio Entraña:</label>
    <input
    type="number"
    id="precioEntraña"
    name="precioEntraña"
    value={formData.precioEntraña || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="fileter">Cantidad Filete:</label>
    <input
    type="number"
    id="filete"
    name="filete"
    value={formData.filete || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioFilete">Precio Filete:</label>
    <input
    type="number"
    id="precioFilete"
    name="precioFilete"
    value={formData.precioFilete || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="ganso">Cantidad Ganso:</label>
    <input
    type="number"
    id="ganso"
    name="ganso"
    value={formData.ganso || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioGanso">Precio Ganso:</label>
    <input
    type="number"
    id="precioGanso"
    name="precioGanso"
    value={formData.precioGanso || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="huachalomo">Cantidad Huachalomo:</label>
    <input
    type="number"
    id="huachalomo"
    name="huachalomo"
    value={formData.huachalomo || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioHuachalomo">Precio Huachalomo:</label>
    <input
    type="number"
    id="precioHuachalomo"
    name="precioHuachalomo"
    value={formData.precioHuachalomo|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="lomoLiso">Cantidad Lomo Liso:</label>
    <input
    type="number"
    id="lomoLiso"
    name="lomoLiso"
    value={formData.lomoLiso || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioLomoLiso">Precio Lomo Liso:</label>
    <input
    type="number"
    id="precioLomoLiso"
    name="precioLomoLiso"
    value={formData.precioLomoLiso || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="lomoVetado">Cantidad Lomo Vetado:</label>
    <input
    type="number"
    id="lomoVetado"
    name="lomoVetado"
    value={formData.lomoVetado|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>














    <div className="formulario-table-field-group">
    <label htmlFor="precioLomoVetado">Precio Lomo Vetado:</label>
    <input
    type="number"
    id="precioLomoVetado"
    name="precioLomoVetado"
    value={formData.precioLomoVetado || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="palanca">Cantidad Palanca:</label>
    <input
    type="number"
    id="palanca"
    name="palanca"
    value={formData.palanca|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioPalanca">Precio Palanca:</label>
    <input
    type="number"
    id="precioPalanca"
    name="precioPalanca"
    value={formData.precioPalanca|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="plateada">Cantidad Plateada:</label>
    <input
    type="number"
    id="plateada"
    name="plateada"
    value={formData.plateada|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioPlateada">Precio Plateada:</label>
    <input
    type="number"
    id="precioPlateada"
    name="precioPlateada"
    value={formData.precioPlateada|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="polloBarriga">Cantidad Pollo Barriga:</label>
    <input
    type="number"
    id="polloBarriga"
    name="polloBarriga"
    value={formData.polloBarriga|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioPolloBarriga">Precio Pollo Barriga:</label>
    <input
    type="number"
    id="precioPolloBarriga"
    name="precioPolloBarriga"
    value={formData.precioPolloBarriga || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="polloGanso">Cantidad Pollo Ganso:</label>
    <input
    type="number"
    id="polloGanso"
    name="polloGanso"
    value={formData.polloGanso|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioPolloGanso">Precio Pollo Ganso:</label>
    <input
    type="number"
    id="precioPolloGanso"
    name="precioPolloGanso"
    value={formData.precioPolloGanso || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="postaNegra">Cantidad Posta Negra:</label>
    <input
    type="number"
    id="postaNegra"
    name="postaNegra"
    value={formData.postaNegra|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioPostaNegra">Precio Posta Negra:</label>
    <input
    type="number"
    id="precioPostaNegra"
    name="precioPostaNegra"
    value={formData.precioPostaNegra|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>




    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="postaPaleta">Cantidad posta Paleta:</label>
    <input
    type="number"
    id="postaPaleta"
    name="postaPaleta"
    value={formData.postaPaleta|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioPostaPaleta">Precio Posta Paleta:</label>
    <input
    type="number"
    id="precioPostaPaleta"
    name="precioPostaPaleta"
    value={formData.precioPostaPaleta|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="postaRosada">Cantidad Posta Rosada:</label>
    <input
    type="number"
    id="postaRosada"
    name="postaRosada"
    value={formData.postaRosada|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioPostaRosada">Precio Posta Rosada:</label>
    <input
    type="number"
    id="precioPostaRosada"
    name="precioPostaRosada"
    value={formData.precioPostaRosada || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="puntaGanso">Cantidad punta Ganso:</label>
    <input
    type="number"
    id="puntaGanso"
    name="puntaGanso"
    value={formData.puntaGanso|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioPuntaGanso">Precio Punta Ganso:</label>
    <input
    type="number"
    id="precioPuntaGanso"
    name="precioPuntaGanso"
    value={formData.precioPuntaGanso || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="puntaPicana">Cantidad Punta Picana:</label>
    <input
    type="number"
    id="puntaPicana"
    name="puntaPicana"
    value={formData.puntaPicana|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioPuntaPicana">Precio Punta Picana:</label>
    <input
    type="number"
    id="precioPuntaPicana"
    name="precioPuntaPicana"
    value={formData.precioPuntaPicana || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="puntaPaleta">Cantidad punta Paleta:</label>
    <input
    type="number"
    id="puntaPaleta"
    name="puntaPaleta"
    value={formData.puntaPaleta|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioPuntaPaleta">Precio Punta Paleta:</label>
    <input
    type="number"
    id="precioPuntaPaleta"
    name="precioPuntaPaleta"
    value={formData.precioPuntaPaleta|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="sobrecostilla">Cantidad Sobre Costilla:</label>
    <input
    type="number"
    id="sobrecostilla"
    name="sobrecostilla"
    value={formData.sobrecostilla|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioSobrecostilla">Precio Sobre costilla:</label>
    <input
    type="number"
    id="precioSobrecostilla"
    name="precioSobrecostilla"
    value={formData.precioSobrecostilla|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    









    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="tapabarriga">Cantidad Tapabarriga:</label>
    <input
    type="number"
    id="tapabarriga"
    name="tapabarriga"
    value={formData.tapabarriga|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioTapabarriga">Precio Tapabarriga:</label>
    <input
    type="number"
    id="precioTapabarriga"
    name="precioTapabarriga"
    value={formData.precioTapabarriga|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="tapapecho">Cantidad Tapapecho:</label>
    <input
    type="number"
    id="tapapecho"
    name="tapapecho"
    value={formData.tapapecho|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioTapapecho">Precio Tapapecho:</label>
    <input
    type="number"
    id="precioTapapecho"
    name="precioTapapecho"
    value={formData.precioTapapecho || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="huesoCarnudo">Cantidad Hueso Carnudo:</label>
    <input
    type="number"
    id="huesoCarnudo"
    name="huesoCarnudo"
    value={formData.huesoCarnudo|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioHuesoCarnudo">Precio Hueso Carnudo:</label>
    <input
    type="number"
    id="precioHuesoCarnudo"
    name="precioHuesoCarnudo"
    value={formData.precioHuesoCarnudo || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="huesoCConCarne">Cantidad hueso Con Carne:</label>
    <input
    type="number"
    id="huesoCConCarne"
    name="huesoCConCarne"
    value={formData.huesoCConCarne|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioHuesoCConCarne">Precio Hueso Con Carne:</label>
    <input
    type="number"
    id="precioHuesoCConCarne"
    name="precioHuesoCConCarne"
    value={formData.precioHuesoCConCarne || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="pataVacuno">Cantidad Pata Vacuno:</label>
    <input
    type="number"
    id="pataVacuno"
    name="pataVacuno"
    value={formData.pataVacuno|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioPataVacuno">Precio Pata Vacuno:</label>
    <input
    type="number"
    id="precioPataVacuno"
    name="precioPataVacuno"
    value={formData.precioPataVacuno|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    








    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="huachalomoOlla">Cantidad huachaLomo Olla:</label>
    <input
    type="number"
    id="huachalomoOlla"
    name="huachalomoOlla"
    value={formData.huachalomoOlla|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioHuachalomoOlla">Precio Huachalomo Olla:</label>
    <input
    type="number"
    id="precioHuachalomoOlla"
    name="precioHuachalomoOlla"
    value={formData.precioHuachalomoOlla || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="cazuelaPaleta">Cantidad Cazuela Paleta:</label>
    <input
    type="number"
    id="cazuelaPaleta"
    name="cazuelaPaleta"
    value={formData.cazuelaPaleta|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioCazuelaPaleta">Precio Cazuela Paleta:</label>
    <input
    type="number"
    id="precioCazuelaPaleta"
    name="precioCazuelaPaleta"
    value={formData.precioCazuelaPaleta || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="osobuco">Cantidad Osobuco:</label>
    <input
    type="number"
    id="osobuco"
    name="osobuco"
    value={formData.osobuco|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioOsobuco">Precio Osobuco:</label>
    <input
    type="number"
    id="precioOsobuco"
    name="precioOsobuco"
    value={formData.precioOsobuco || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="lagarto">Cantidad Lagarto:</label>
    <input
    type="number"
    id="lagarto"
    name="lagarto"
    value={formData.lagarto|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioLagarto">Precio Lagarto:</label>
    <input
    type="number"
    id="precioLagarto"
    name="precioLagarto"
    value={formData.precioLagarto || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="costillaVacuno">Cantidad Costilla Vacuno:</label>
    <input
    type="number"
    id="costillaVacuno"
    name="costillaVacuno"
    value={formData.costillaVacuno|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioCostillaVacuno">Precio Costilla Vacuno:</label>
    <input
    type="number"
    id="precioCostillaVacuno"
    name="precioCostillaVacuno"
    value={formData.precioCostillaVacuno || 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="tapaposta">Cantidad Tapaposta:</label>
    <input
    type="number"
    id="tapaposta"
    name="tapaposta"
    value={formData.tapaposta|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioTapaposta">Precio Tapaposta:</label>
    <input
    type="number"
    id="precioTapaposta"
    name="precioTapaposta"
    value={formData.precioTapaposta|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    
    <div className="formulario-table-form-group">
    <div className="formulario-table-field-group">
    <label htmlFor="malaya">Cantidad Malaya:</label>
    <input
    type="number"
    id="malaya"
    name="malaya"
    value={formData.malaya|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="0.1"
    className="formulario-table-input"
    />
    </div>

    <div className="formulario-table-field-group">
    <label htmlFor="precioMalaya">Precio Malaya:</label>
    <input
    type="number"
    id="precioMalaya"
    name="precioMalaya"
    value={formData.precioMalaya|| 0} 
    onChange={handleEditChange}
    required
    min="0"
    step="1"
    className="formulario-table-input"
    />
    </div>
    </div>
    

          <div className="formulario-table-form-actions">
            <button type="submit" className="formulario-table-btn-confirm">
              Editar
            </button>
            <button
              type="button"
              onClick={() =>  setIsEditModalOpen(false)}
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
        <h2 className="formulario-table-modal-title">¿Estás seguro que deseas eliminar esta lista?</h2>
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

      {/* Modal de Ver Detalles */}
     {/* Modal de Ver Detalles */}
<Modal
  isOpen={isViewModalOpen}
  onRequestClose={handleViewModalClose}
  contentLabel="Ver Detalles"
  ariaHideApp={false}
  className={`modal ${isViewModalOpen ? 'open' : ''}`}
>
  <div className="modal-content">
  <h2>Detalles: {animalCorteToView?.nombreLista}</h2>
    {animalCorteToView && (
      <div className="modal-details" style={{ maxHeight: '540px', overflowY: 'auto' }}>
        <p><strong>Cantidad Abastero:</strong> {animalCorteToView.abastero}</p>
        <p><strong>Precio Abastero:</strong> {animalCorteToView.precioAbastero}</p>
        
        <p><strong>Cantidad Asado Tira:</strong> {animalCorteToView.asadoTira}</p>
        <p><strong>Precio Asado Tira:</strong> {animalCorteToView.precioAsadoTira}</p>
        
        <p><strong>Cantidad Asado Carnicero:</strong> {animalCorteToView.asadoCarnicero}</p>
        <p><strong>Precio Asado Carnicero:</strong> {animalCorteToView.precioAsadoCarnicero}</p>
        
        <p><strong>Cantidad Asiento:</strong> {animalCorteToView.asiento}</p>
        <p><strong>Precio Asiento:</strong> {animalCorteToView.precioAsiento}</p>
        
        <p><strong>Cantidad Choclillo:</strong> {animalCorteToView.choclillo}</p>
        <p><strong>Precio Choclillo:</strong> {animalCorteToView.precioChoclillo}</p>
        
        <p><strong>Cantidad Cogote:</strong> {animalCorteToView.cogote}</p>
        <p><strong>Precio Cogote:</strong> {animalCorteToView.precioCogote}</p>
        
        <p><strong>Cantidad Entraña:</strong> {animalCorteToView.entraña}</p>
        <p><strong>Precio Entraña:</strong> {animalCorteToView.precioEntraña}</p>
        
        <p><strong>Cantidad Filete:</strong> {animalCorteToView.filete}</p>
        <p><strong>Precio Filete:</strong> {animalCorteToView.precioFilete}</p>
        
        <p><strong>Cantidad Ganso:</strong> {animalCorteToView.ganso}</p>
        <p><strong>Precio Ganso:</strong> {animalCorteToView.precioGanso}</p>
        
        <p><strong>Cantidad Huachalomo:</strong> {animalCorteToView.huachalomo}</p>
        <p><strong>Precio Huachalomo:</strong> {animalCorteToView.precioHuachalomo}</p>
        
        <p><strong>Cantidad Lomo Liso:</strong> {animalCorteToView.lomoLiso}</p>
        <p><strong>Precio Lomo Liso:</strong> {animalCorteToView.precioLomoLiso}</p>
        
        <p><strong>Cantidad Lomo Vetado:</strong> {animalCorteToView.lomoVetado}</p>
        <p><strong>Precio Lomo Vetado:</strong> {animalCorteToView.precioLomoVetado}</p>
        
        <p><strong>Cantidad Palanca:</strong> {animalCorteToView.palanca}</p>
        <p><strong>Precio Palanca:</strong> {animalCorteToView.precioPalanca}</p>
        
        <p><strong>Cantidad Plateada:</strong> {animalCorteToView.plateada}</p>
        <p><strong>Precio Plateada:</strong> {animalCorteToView.precioPlateada}</p>
        
        <p><strong>Cantidad Pollo Barriga:</strong> {animalCorteToView.polloBarriga}</p>
        <p><strong>Precio Pollo Barriga:</strong> {animalCorteToView.precioPolloBarriga}</p>
        
        <p><strong>Cantidad Pollo Ganso:</strong> {animalCorteToView.polloGanso}</p>
        <p><strong>Precio Pollo Ganso:</strong> {animalCorteToView.precioPolloGanso}</p>
        
        <p><strong>Cantidad Posta Negra:</strong> {animalCorteToView.postaNegra}</p>
        <p><strong>Precio Posta Negra:</strong> {animalCorteToView.precioPostaNegra}</p>
        
        <p><strong>Cantidad Posta Paleta:</strong> {animalCorteToView.postaPaleta}</p>
        <p><strong>Precio Posta Paleta:</strong> {animalCorteToView.precioPostaPaleta}</p>
        
        <p><strong>Cantidad Posta Rosada:</strong> {animalCorteToView.postaRosada}</p>
        <p><strong>Precio Posta Rosada:</strong> {animalCorteToView.precioPostaRosada}</p>
        
        <p><strong>Cantidad Punta Ganso:</strong> {animalCorteToView.puntaGanso}</p>
        <p><strong>Precio Punta Ganso:</strong> {animalCorteToView.precioPuntaGanso}</p>
        
        <p><strong>Cantidad Punta Picana:</strong> {animalCorteToView.puntaPicana}</p>
        <p><strong>Precio Punta Picana:</strong> {animalCorteToView.precioPuntaPicana}</p>
        
        <p><strong>Cantidad Punta Paleta:</strong> {animalCorteToView.puntaPaleta}</p>
        <p><strong>Precio Punta Paleta:</strong> {animalCorteToView.precioPuntaPaleta}</p>
        
        <p><strong>Cantidad Sobrecostilla:</strong> {animalCorteToView.sobrecostilla}</p>
        <p><strong>Precio Sobrecostilla:</strong> {animalCorteToView.precioSobrecostilla}</p>
        
        <p><strong>Cantidad Tapabarriga:</strong> {animalCorteToView.tapabarriga}</p>
        <p><strong>Precio Tapabarriga:</strong> {animalCorteToView.precioTapabarriga}</p>
        
        <p><strong>Cantidad Tapapecho:</strong> {animalCorteToView.tapapecho}</p>
        <p><strong>Precio Tapapecho:</strong> {animalCorteToView.precioTapapecho}</p>
        
        <p><strong>Cantidad Hueso Carnudo:</strong> {animalCorteToView.huesoCarnudo}</p>
        <p><strong>Precio Hueso Carnudo:</strong> {animalCorteToView.precioHuesoCarnudo}</p>
        
        <p><strong>Cantidad Hueso C/ Carne:</strong> {animalCorteToView.huesoCConCarne}</p>
        <p><strong>Precio Hueso C/ Carne:</strong> {animalCorteToView.precioHuesoCConCarne}</p>
        
        <p><strong>Cantidad Pata Vacuno:</strong> {animalCorteToView.pataVacuno}</p>
        <p><strong>Precio Pata Vacuno:</strong> {animalCorteToView.precioPataVacuno}</p>
        
        <p><strong>Cantidad Huachalomo Olla:</strong> {animalCorteToView.huachalomoOlla}</p>
        <p><strong>Precio Huachalomo Olla:</strong> {animalCorteToView.precioHuachalomoOlla}</p>
        
        <p><strong>Cantidad Cazuela Paleta:</strong> {animalCorteToView.cazuelaPaleta}</p>
        <p><strong>Precio Cazuela Paleta:</strong> {animalCorteToView.precioCazuelaPaleta}</p>
        
        <p><strong>Cantidad Osobuco:</strong> {animalCorteToView.osobuco}</p>
        <p><strong>Precio Osobuco:</strong> {animalCorteToView.precioOsobuco}</p>
        
        <p><strong>Cantidad Lagarto:</strong> {animalCorteToView.lagarto}</p>
        <p><strong>Precio Lagarto:</strong> {animalCorteToView.precioLagarto}</p>
        
        <p><strong>Cantidad Costilla Vacuno:</strong> {animalCorteToView.costillaVacuno}</p>
        <p><strong>Precio Costilla Vacuno:</strong> {animalCorteToView.precioCostillaVacuno}</p>
        
        <p><strong>Cantidad Tapaposta:</strong> {animalCorteToView.tapaposta}</p>
        <p><strong>Precio Tapaposta:</strong> {animalCorteToView.precioTapaposta}</p>

        <p><strong>Cantidad Malaya:</strong> {animalCorteToView.malaya}</p>
        <p><strong>Precio Malaya:</strong> {animalCorteToView.precioMalaya}</p>
      </div>
    )}
    <div className="modal-actions">
      <button className="cancel" onClick={handleViewModalClose}>Cerrar</button>
    </div>
  </div>
</Modal>
    </div>
  );
};

export default VerAnimalListaCorte;

import { useEffect, useState } from "react";
import { useGetAnimalCorte } from "@hooks/animalCorte/useGetAnimalCorte";
import { useCreateAnimalCorte } from "@hooks/animalCorte/useCreateAnimalCorte";
import { useDeleteAnimalCorte } from "@hooks/animalCorte/useDeleteAnimalCorte";
import { useUpdateAnimalCorte } from "@hooks/animalCorte/useUpdateAnimalCorte";
import { MdOutlineEdit } from "react-icons/md";
import { useErrorHandlerAnimalCorte } from "@hooks/animalCorte/useErrorHandlerAnimalCorte";
import Table from "../components/Table";
import Modal from "react-modal";
import styles from "@styles/categoria.module.css";
import "@styles/modalDetalles.css";
import "@styles/modalCrear.css";


const VerAnimalListaCorte = () => {
  const { animalCortes, loading, error, fetchAnimalCortes } = useGetAnimalCorte();
  const { handleCreate } = useCreateAnimalCorte(fetchAnimalCortes);
  const { handleDelete } = useDeleteAnimalCorte(fetchAnimalCortes);
  const { handleUpdate } = useUpdateAnimalCorte(fetchAnimalCortes);
  const { createError, editError, handleCreateError, handleEditError } = useErrorHandlerAnimalCorte();

  const [formError, setFormError] = useState(null);
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

  const handleConfirmation = (callback) => {
    callback();
  };

  const handleDeleteClick = (animalCorte) => {
    setAnimalCorteToDelete(animalCorte);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setAnimalCorteToDelete(null);
  };

  const confirmDelete = () => {
    handleDelete(animalCorteToDelete.id)
      .then(() => {
        setIsDeleteModalOpen(false);
      });
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
    const { name, value, type } = e.target;
    
    // Para campos numéricos, eliminar ceros a la izquierda
    if (type === 'number') {
      let numberValue = value;
      // Si es un número válido, eliminar ceros a la izquierda
      if (numberValue !== '') {
        numberValue = parseFloat(numberValue) + ''; // Convierte a número y luego a string para eliminar ceros a la izquierda
      }
      setNewAnimalCorteData({ ...newAnimalCorteData, [name]: numberValue });
    } else {
      setNewAnimalCorteData({ ...newAnimalCorteData, [name]: value });
    }
  };

  const handleCreateModalSubmit = async (e) => {
    e.preventDefault();

    const validatedData = { ...newAnimalCorteData };
    for (let key in validatedData) {
      if (validatedData[key] === '') {
        validatedData[key] = 0;
      }
    }    // Validar primero
    const hasErrors = handleCreateError(validatedData, animalCortes[0] || []);
    if (hasErrors) {
      return;
    }

    try {
      await handleCreate(validatedData);
      setIsCreateModalOpen(false);
      setNewAnimalCorteData({
        nombreLista: "",
        abastero: "",
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
        precioMalaya: ""
      });
    } catch (error) {
      // Pasar el error al manejador de errores
      const errorMessage = error.message;
      if (errorMessage.includes("Ya existe un tipo de animal con este nombre")) {
        handleCreateError(validatedData, { message: errorMessage });
      }
    }
  };
  const handleEditChange = (e) => {
    const { name, value, type } = e.target;
    
    // Para campos numéricos, eliminar ceros a la izquierda
    if (type === 'number') {
      let numberValue = value;
      // Si es un número válido, eliminar ceros a la izquierda
      if (numberValue !== '') {
        numberValue = parseFloat(numberValue) + ''; // Convierte a número y luego a string para eliminar ceros a la izquierda
      }
      setFormData({ ...formData, [name]: numberValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    const validatedData = { ...formData };
    for (let key in validatedData) {validatedData, animalCortes[0] || []
      if (validatedData[key] === '') {
        validatedData[key] = 0;
      }
    }
    
    
    // Usar el hook de manejo de errores
    const hasErrors = handleEditError(validatedData, animalCortes[0] || []);
    if (hasErrors) {
      setFormError(editError);
      return;
    }

    setFormError("");

    if (animalCorteToEdit) {
      try {
        await handleUpdate(animalCorteToEdit.id, validatedData);
        setIsEditModalOpen(false);
        setFormData({
          nombreLista: "",
          abastero: "",
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
          precioMalaya: ""
        });
      } catch (error) {
        const errorMessage = error.message === "Ya existe un tipo de animal con este nombre de lista."
          ? `Ya existe un tipo de animal con el nombre "${validatedData.nombreLista}"`
          : "El nombre de la lista ya existe.";

        setFormError({
          field: 'nombreLista',
          message: errorMessage
        });
      }
    }
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
    { header: "Nombre", key: "nombreLista" },
  ];

  return (
    <div className={styles["categoria-container"]}>
      <Table
        data={animalCortes && animalCortes[0] ? animalCortes[0] : []}
        columns={columns}
        headerTitle="Listas de Precios"
        onCreate={handleCreateClick}
        onEdit={handleUpdateClick}
        onDelete={handleDeleteClick}
        onView={handleViewClick}
        showEditAllButton={false}
        showEditButton={true}
        showDeleteButton={true}
        showCreateButton={true}
        showViewButton={true}
        showCalendarButton={false}
        showExcelButton={true}
        entidad="animal-corte"
      />      {/* Modal de Creación */}      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={() => {
          setIsCreateModalOpen(false);
          setFormError("");
        }}
        contentLabel="Añadir Corte de Animal"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <form onSubmit={handleCreateModalSubmit} className="modal-crear-formulario">          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Crear lista de Precios</h2>
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="modal-crear-cerrar">×</button>
            <button type="submit" className="modal-boton-crear">Guardar</button>
          </div><div className="subproducto-fila" style={{ 
              maxWidth: '500px', 
              margin: '0 auto', 
              padding: '10px', 
              display: 'flex', 
              alignItems: 'center',
              background: 'none',
              border: 'none'
            }}>
            <div style={{ minWidth: '120px' }}>
              <span className="subproducto-nombre">Nombre de la lista:</span>
            </div>
            <div style={{ flex: 1, marginLeft: '10px' }}>              <div className="input-container">
                <input
                  type="text"
                  id="nombreLista"
                  name="nombreLista"
                  value={newAnimalCorteData.nombreLista}
                  onChange={handleCreateModalChange}
                  required                  className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'nombreLista') ? 'input-error' : ''}`}
                  placeholder="Ingrese el nombre de la lista"
                  style={{ 
                    width: '250px',
                    background: 'white'
                  }}                />
                {createError && createError.errors && createError.errors.map((error, index) => (
                  error.field === 'nombreLista' && (
                    <div key={index} className="error-message">{error.message}</div>
                  )
                ))}
              </div>
            </div>
          </div>

          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Abastero</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                
                <div className="input-container">
                  <input
                    type="number"
                    id="abastero"
                    name="abastero"
                    value={newAnimalCorteData.abastero || 0}
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'abastero') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'abastero' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
              <div className="input-grupo">
                <label>Precio</label>                <div className="input-container">
                  <input
                    type="number"
                    id="precioAbastero"
                    name="precioAbastero"
                    value={newAnimalCorteData.precioAbastero || 0}
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioAbastero') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioAbastero' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Asado Tira</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>                
                <div className="input-container">
                  <input
                    type="number"
                    id="CantidadAsadoTira"
                    name="asadoTira"
                    value={newAnimalCorteData.asadoTira || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'asadoTira') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'asadoTira' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioAsadoTira"
                    name="precioAsadoTira"
                    value={newAnimalCorteData.precioAsadoTira || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioAsadoTira') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioAsadoTira' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Asado Carnicero</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="asadoCarniceror"
                    name="asadoCarnicero"
                    value={newAnimalCorteData.asadoCarnicero || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'asadoCarnicero') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'asadoCarnicero' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioAsadoCarnicero"
                    name="precioAsadoCarnicero"
                    value={newAnimalCorteData.precioAsadoCarnicero || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioAsadoCarnicero') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioAsadoCarnicero' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Asiento</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="asientor"
                    name="asiento"
                    value={newAnimalCorteData.asiento || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'asiento') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'asiento' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioAsiento"
                    name="precioAsiento"
                    value={newAnimalCorteData.precioAsiento || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioAsiento') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioAsiento' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Choclillo</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="choclillo"
                    name="choclillo"
                    value={newAnimalCorteData.choclillo || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'choclillo') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'choclillo' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioChoclillo"
                    name="precioChoclillo"
                    value={newAnimalCorteData.precioChoclillo || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioChoclillo') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioChoclillo' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Cogote</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="cogote"
                    name="cogote"
                    value={newAnimalCorteData.cogote || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'cogote') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'cogote' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioCogote"
                    name="precioCogote"
                    value={newAnimalCorteData.precioCogote || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioCogote') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioCogote' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Entraña</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="entraña"
                    name="entraña"
                    value={newAnimalCorteData.entraña || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'entraña') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'entraña' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioEntraña"
                    name="precioEntraña"
                    value={newAnimalCorteData.precioEntraña || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioEntraña') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioEntraña' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">

              <span className="subproducto-nombre">Filete</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="filete"
                    name="filete"
                    value={newAnimalCorteData.filete || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'filete') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'filete' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioFilete"
                    name="precioFilete"
                    value={newAnimalCorteData.precioFilete || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioFilete') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioFilete' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Ganso</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="ganso"
                    name="ganso"
                    value={newAnimalCorteData.ganso || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'ganso') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'ganso' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioGanso"
                    name="precioGanso"
                    value={newAnimalCorteData.precioGanso || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioGanso') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioGanso' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Huachalomo</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="huachalomo"
                    name="huachalomo"
                    value={newAnimalCorteData.huachalomo || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'huachalomo') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'huachalomo' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioHuachalomo"
                    name="precioHuachalomo"
                    value={newAnimalCorteData.precioHuachalomo|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioHuachalomo') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioHuachalomo' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Lomo Liso</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="lomoLiso"
                    name="lomoLiso"
                    value={newAnimalCorteData.lomoLiso || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'lomoLiso') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'lomoLiso' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioLomoLiso"
                    name="precioLomoLiso"
                    value={newAnimalCorteData.precioLomoLiso || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioLomoLiso') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioLomoLiso' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Lomo Vetado</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="lomoVetado"
                    name="lomoVetado"
                    value={newAnimalCorteData.lomoVetado|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'lomoVetado') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'lomoVetado' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioLomoVetado"
                    name="precioLomoVetado"
                    value={newAnimalCorteData.precioLomoVetado || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioLomoVetado') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioLomoVetado' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Palanca</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="palanca"
                    name="palanca"
                    value={newAnimalCorteData.palanca|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'palanca') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'palanca' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioPalanca"
                    name="precioPalanca"
                    value={newAnimalCorteData.precioPalanca|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioPalanca') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioPalanca' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Plateada</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="plateada"
                    name="plateada"
                    value={newAnimalCorteData.plateada|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'plateada') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'plateada' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioPlateada"
                    name="precioPlateada"
                    value={newAnimalCorteData.precioPlateada|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioPlateada') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioPlateada' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Pollo Barriga</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="polloBarriga"
                    name="polloBarriga"
                    value={newAnimalCorteData.polloBarriga|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'polloBarriga') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'polloBarriga' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioPolloBarriga"
                    name="precioPolloBarriga"
                    value={newAnimalCorteData.precioPolloBarriga || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioPolloBarriga') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioPolloBarriga' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Pollo Ganso</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="polloGanso"
                    name="polloGanso"
                    value={newAnimalCorteData.polloGanso|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'polloGanso') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'polloGanso' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioPolloGanso"
                    name="precioPolloGanso"
                    value={newAnimalCorteData.precioPolloGanso || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioPolloGanso') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioPolloGanso' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Posta Negra</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="postaNegra"
                    name="postaNegra"
                    value={newAnimalCorteData.postaNegra|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'postaNegra') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'postaNegra' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioPostaNegra"
                    name="precioPostaNegra"
                    value={newAnimalCorteData.precioPostaNegra|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioPostaNegra') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioPostaNegra' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Posta Paleta</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="postaPaleta"
                    name="postaPaleta"
                    value={newAnimalCorteData.postaPaleta|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'postaPaleta') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'postaPaleta' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioPostaPaleta"
                    name="precioPostaPaleta"
                    value={newAnimalCorteData.precioPostaPaleta|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioPostaPaleta') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioPostaPaleta' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Posta Rosada</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="postaRosada"
                    name="postaRosada"
                    value={newAnimalCorteData.postaRosada|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'postaRosada') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'postaRosada' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioPostaRosada"
                    name="precioPostaRosada"
                    value={newAnimalCorteData.precioPostaRosada || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioPostaRosada') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioPostaRosada' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Punta Ganso</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="puntaGanso"
                    name="puntaGanso"
                    value={newAnimalCorteData.puntaGanso|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'puntaGanso') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'puntaGanso' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioPuntaGanso"
                    name="precioPuntaGanso"
                    value={newAnimalCorteData.precioPuntaGanso || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioPuntaGanso') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioPuntaGanso' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Punta Picana</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="puntaPicana"
                    name="puntaPicana"
                    value={newAnimalCorteData.puntaPicana|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'puntaPicana') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'puntaPicana' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioPuntaPicana"
                    name="precioPuntaPicana"
                    value={newAnimalCorteData.precioPuntaPicana || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioPuntaPicana') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioPuntaPicana' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Punta Paleta</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="puntaPaleta"
                    name="puntaPaleta"                    value={newAnimalCorteData.puntaPaleta|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'puntaPaleta') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'puntaPaleta' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioPuntaPaleta"
                    name="precioPuntaPaleta"
                    value={newAnimalCorteData.precioPuntaPaleta|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioPuntaPaleta') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioPuntaPaleta' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Sobrecostilla</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="sobrecostilla"
                    name="sobrecostilla"
                    value={newAnimalCorteData.sobrecostilla|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'sobrecostilla') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'sobrecostilla' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioSobrecostilla"
                    name="precioSobrecostilla"
                    value={newAnimalCorteData.precioSobrecostilla|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioSobrecostilla') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioSobrecostilla' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Tapabarriga</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="tapabarriga"
                    name="tapabarriga"
                    value={newAnimalCorteData.tapabarriga|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'tapabarriga') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'tapabarriga' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioTapabarriga"
                    name="precioTapabarriga"
                    value={newAnimalCorteData.precioTapabarriga|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioTapabarriga') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioTapabarriga' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Tapapecho</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="tapapecho"
                    name="tapapecho"
                    value={newAnimalCorteData.tapapecho|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'tapapecho') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'tapapecho' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioTapapecho"
                    name="precioTapapecho"
                    value={newAnimalCorteData.precioTapapecho || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioTapapecho') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioTapapecho' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Hueso Carnudo</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="huesoCarnudo"
                    name="huesoCarnudo"
                    value={newAnimalCorteData.huesoCarnudo|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'huesoCarnudo') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'huesoCarnudo' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioHuesoCarnudo"
                    name="precioHuesoCarnudo"
                    value={newAnimalCorteData.precioHuesoCarnudo || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioHuesoCarnudo') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioHuesoCarnudo' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Hueso con Carne</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="huesoCConCarne"
                    name="huesoCConCarne"
                    value={newAnimalCorteData.huesoCConCarne|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'huesoCConCarne') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'huesoCConCarne' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioHuesoCConCarne"
                    name="precioHuesoCConCarne"
                    value={newAnimalCorteData.precioHuesoCConCarne || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioHuesoCConCarne') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioHuesoCConCarne' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Pata Vacuno</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="pataVacuno"
                    name="pataVacuno"
                    value={newAnimalCorteData.pataVacuno|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'pataVacuno') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'pataVacuno' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioPataVacuno"
                    name="precioPataVacuno"
                    value={newAnimalCorteData.precioPataVacuno|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioPataVacuno') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioPataVacuno' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Huachalomo Olla</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="huachalomoOlla"
                    name="huachalomoOlla"
                    value={newAnimalCorteData.huachalomoOlla|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'huachalomoOlla') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'huachalomoOlla' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioHuachalomoOlla"
                    name="precioHuachalomoOlla"
                    value={newAnimalCorteData.precioHuachalomoOlla || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioHuachalomoOlla') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioHuachalomoOlla' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Cazuela Paleta</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="cazuelaPaleta"
                    name="cazuelaPaleta"
                    value={newAnimalCorteData.cazuelaPaleta|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'cazuelaPaleta') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'cazuelaPaleta' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioCazuelaPaleta"
                    name="precioCazuelaPaleta"
                    value={newAnimalCorteData.precioCazuelaPaleta || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioCazuelaPaleta') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioCazuelaPaleta' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Osobuco</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="osobuco"
                    name="osobuco"
                    value={newAnimalCorteData.osobuco|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'osobuco') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'osobuco' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioOsobuco"
                    name="precioOsobuco"
                    value={newAnimalCorteData.precioOsobuco || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioOsobuco') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioOsobuco' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Lagarto</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="lagarto"
                    name="lagarto"
                    value={newAnimalCorteData.lagarto|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'lagarto') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'lagarto' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioLagarto"
                    name="precioLagarto"
                    value={newAnimalCorteData.precioLagarto || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioLagarto') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioLagarto' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Costilla Vacuno</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="costillaVacuno"
                    name="costillaVacuno"
                    value={newAnimalCorteData.costillaVacuno|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'costillaVacuno') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'costillaVacuno' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioCostillaVacuno"
                    name="precioCostillaVacuno"
                    value={newAnimalCorteData.precioCostillaVacuno || 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioCostillaVacuno') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioCostillaVacuno' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Tapaposta</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="tapaposta"
                    name="tapaposta"
                    value={newAnimalCorteData.tapaposta|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'tapaposta') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'tapaposta' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioTapaposta"
                    name="precioTapaposta"
                    value={newAnimalCorteData.precioTapaposta|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioTapaposta') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioTapaposta' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Malaya</span>
            </div>
            <div className="subproducto-inputs-grupo">              <div className="input-grupo">
                <label>kg</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="malaya"
                    name="malaya"
                    value={newAnimalCorteData.malaya|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="0.1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'malaya') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'malaya' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>              <div className="input-grupo">
                <label>Precio</label>
                <div className="input-container">
                  <input
                    type="number"
                    id="precioMalaya"
                    name="precioMalaya"
                    value={newAnimalCorteData.precioMalaya|| 0} 
                    onChange={handleCreateModalChange}
                    required
                    min="0"
                    step="1"
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioMalaya') ? 'input-error' : ''}`}
                  />
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'precioMalaya' && (
                      <div key={index} className="error-message">{error.message}</div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
                <div className="modal-crear-acciones">
            <button type="submit" className="modal-boton-crear">
              Crear
            </button>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="modal-crear-cerrar"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>






 {/* Modal de Edición */}      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => {
          setIsEditModalOpen(false);
          setFormError("");
        }}
        contentLabel="Editar Corte de Animal"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <form onSubmit={handleEditSubmit} className="modal-crear-formulario">
          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Editar lista de Precios</h2>
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="modal-crear-cerrar">×</button>
            <button type="submit" className="modal-boton-crear">Guardar</button>
          </div><div className="subproducto-fila" style={{ maxWidth: '500px', margin: '0 auto', padding: '10px', display: 'flex', alignItems: 'center', background: 'none', border: 'none' }}>
            <div style={{ minWidth: '120px' }}>
              <span className="subproducto-nombre">Nombre de la lista:</span>
            </div>
            <div style={{ flex: 1, marginLeft: '10px' }}>
              <input
                type="text"
                id="nombreLista"
                name="nombreLista"                value={formData.nombreLista}
                onChange={handleEditChange}
                required
                className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'nombreLista') ? 'input-error' : ''}`}
                placeholder="Ingrese el nombre de la lista"
                style={{ width: '250px', background: 'white', border: '1px solid #ccc' }}
              />              {editError && editError.errors?.map((error, index) => (
                error.field === 'nombreLista' && (
                  <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                    {error.message}
                  </div>
                )
              ))}
            </div>
          </div>

          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Abastero</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="abastero"
                  name="abastero"
                  value={formData.abastero || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'abastero') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'abastero' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioAbastero"
                  name="precioAbastero"
                  value={formData.precioAbastero || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioAbastero') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioAbastero' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Asado Tira</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="CantidadAsadoTira"
                  name="asadoTira"
                  value={formData.asadoTira || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'asadoTira') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'asadoTira' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioAsadoTira"
                  name="precioAsadoTira"
                  value={formData.precioAsadoTira || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioAsadoTira') ? 'input-error' : ''}`}
                />                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioAsadoTira' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Asado Carnicero</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="asadoCarniceror"
                  name="asadoCarnicero"
                  value={formData.asadoCarnicero || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'asadoCarnicero') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'asadoCarnicero' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioAsadoCarnicero"
                  name="precioAsadoCarnicero"
                  value={formData.precioAsadoCarnicero || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioAsadoCarnicero') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioAsadoCarnicero' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Asiento</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="asientor"
                  name="asiento"
                  value={formData.asiento || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'asiento') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'asiento' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioAsiento"
                  name="precioAsiento"
                  value={formData.precioAsiento || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioAsiento') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioAsiento' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Choclillo</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="choclillo"
                  name="choclillo"
                  value={formData.choclillo || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'choclillo') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'choclillo' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioChoclillo"
                  name="precioChoclillo"
                  value={formData.precioChoclillo || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioChoclillo') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioChoclillo' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Cogote</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="cogote"
                  name="cogote"
                  value={formData.cogote || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'cogote') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'cogote' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioCogote"
                  name="precioCogote"
                  value={formData.precioCogote || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioCogote') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioCogote' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Entraña</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="entraña"
                  name="entraña"
                  value={formData.entraña || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'entraña') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'entraña' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioEntraña"
                  name="precioEntraña"
                  value={formData.precioEntraña || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioEntraña') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioEntraña' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">

              <span className="subproducto-nombre">Filete</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                               <input
                  type="number"
                  id="filete"
                  name="filete"
                  value={formData.filete || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'filete') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'filete' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioFilete"
                  name="precioFilete"
                  value={formData.precioFilete || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioFilete') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioFilete' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Ganso</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="ganso"
                  name="ganso"
                  value={formData.ganso || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'ganso') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'ganso' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioGanso"
                  name="precioGanso"
                  value={formData.precioGanso || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioGanso') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioGanso' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Huachalomo</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="huachalomo"
                  name="huachalomo"
                  value={formData.huachalomo || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'huachalomo') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'huachalomo' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioHuachalomo"
                  name="precioHuachalomo"
                  value={formData.precioHuachalomo|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioHuachalomo') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioHuachalomo' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Lomo Liso</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="lomoLiso"
                  name="lomoLiso"
                  value={formData.lomoLiso || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'lomoLiso') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'lomoLiso' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioLomoLiso"
                  name="precioLomoLiso"
                  value={formData.precioLomoLiso || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioLomoLiso') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioLomoLiso' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Lomo Vetado</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="lomoVetado"
                  name="lomoVetado"
                  value={formData.lomoVetado|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'lomoVetado') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'lomoVetado' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>


              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioLomoVetado"
                  name="precioLomoVetado"
                  value={formData.precioLomoVetado || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioLomoVetado') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioLomoVetado' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Palanca</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="palanca"
                  name="palanca"
                  value={formData.palanca|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'palanca') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'palanca' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioPalanca"
                  name="precioPalanca"
                  value={formData.precioPalanca|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioPalanca') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioPalanca' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Plateada</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="plateada"
                  name="plateada"
                  value={formData.plateada|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'plateada') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'plateada' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioPlateada"
                  name="precioPlateada"
                  value={formData.precioPlateada|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioPlateada') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioPlateada' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Pollo Barriga</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="polloBarriga"
                  name="polloBarriga"
                  value={formData.polloBarriga|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'polloBarriga') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'polloBarriga' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioPolloBarriga"
                  name="precioPolloBarriga"
                  value={formData.precioPolloBarriga || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioPolloBarriga') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioPolloBarriga' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Pollo Ganso</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="polloGanso"
                  name="polloGanso"
                  value={formData.polloGanso|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'polloGanso') ? 'input-error' : ''}`}
                />                {editError && editError.errors?.map((error, index) => (
                  error.field === 'polloGanso' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioPolloGanso"
                  name="precioPolloGanso"
                  value={formData.precioPolloGanso || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioPolloGanso') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioPolloGanso' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Posta Negra</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="postaNegra"
                  name="postaNegra"
                  value={formData.postaNegra|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'postaNegra') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'postaNegra' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioPostaNegra"
                  name="precioPostaNegra"
                  value={formData.precioPostaNegra|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioPostaNegra') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioPostaNegra' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Posta Paleta</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="postaPaleta"
                  name="postaPaleta"
                  value={formData.postaPaleta|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'postaPaleta') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'postaPaleta' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioPostaPaleta"
                  name="precioPostaPaleta"
                  value={formData.precioPostaPaleta|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioPostaPaleta') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioPostaPaleta' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Posta Rosada</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="postaRosada"
                  name="postaRosada"
                  value={formData.postaRosada|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'postaRosada') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'postaRosada' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioPostaRosada"
                  name="precioPostaRosada"
                  value={formData.precioPostaRosada || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioPostaRosada') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioPostaRosada' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Punta Ganso</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="puntaGanso"
                  name="puntaGanso"
                  value={formData.puntaGanso|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'puntaGanso') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'puntaGanso' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioPuntaGanso"
                  name="precioPuntaGanso"
                  value={formData.precioPuntaGanso || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioPuntaGanso') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioPuntaGanso' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Punta Picana</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="puntaPicana"
                  name="puntaPicana"
                  value={formData.puntaPicana|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'puntaPicana') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'puntaPicana' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioPuntaPicana"
                  name="precioPuntaPicana"
                  value={formData.precioPuntaPicana || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioPuntaPicana') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioPuntaPicana' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Punta Paleta</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="puntaPaleta"
                  name="puntaPaleta"
                  value={formData.puntaPaleta|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'puntaPaleta') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'puntaPaleta' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioPuntaPaleta"
                  name="precioPuntaPaleta"
                  value={formData.precioPuntaPaleta|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioPuntaPaleta') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioPuntaPaleta' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Sobrecostilla</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="sobrecostilla"
                  name="sobrecostilla"
                  value={formData.sobrecostilla|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'sobrecostilla') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'sobrecostilla' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioSobrecostilla"
                  name="precioSobrecostilla"
                  value={formData.precioSobrecostilla|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioSobrecostilla') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioSobrecostilla' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Tapabarriga</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="tapabarriga"
                  name="tapabarriga"
                  value={formData.tapabarriga|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'tapabarriga') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'tapabarriga' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioTapabarriga"
                  name="precioTapabarriga"
                  value={formData.precioTapabarriga|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioTapabarriga') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioTapabarriga' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Tapapecho</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="tapapecho"
                  name="tapapecho"
                  value={formData.tapapecho|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'tapapecho') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'tapapecho' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioTapapecho"
                  name="precioTapapecho"
                  value={formData.precioTapapecho || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioTapapecho') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioTapapecho' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Hueso Carnudo</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="huesoCarnudo"
                  name="huesoCarnudo"
                  value={formData.huesoCarnudo|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'huesoCarnudo') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'huesoCarnudo' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioHuesoCarnudo"
                  name="precioHuesoCarnudo"
                  value={formData.precioHuesoCarnudo || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioHuesoCarnudo') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioHuesoCarnudo' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Hueso con Carne</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="huesoCConCarne"
                  name="huesoCConCarne"
                  value={formData.huesoCConCarne|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'huesoCConCarne') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'huesoCConCarne' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioHuesoCConCarne"
                  name="precioHuesoCConCarne"
                  value={formData.precioHuesoCConCarne || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioHuesoCConCarne') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioHuesoCConCarne' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Pata Vacuno</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="pataVacuno"
                  name="pataVacuno"
                  value={formData.pataVacuno|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'pataVacuno') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'pataVacuno' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioPataVacuno"
                  name="precioPataVacuno"
                  value={formData.precioPataVacuno|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioPataVacuno') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioPataVacuno' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Huachalomo Olla</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="huachalomoOlla"
                  name="huachalomoOlla"
                  value={formData.huachalomoOlla|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'huachalomoOlla') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'huachalomoOlla' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioHuachalomoOlla"
                  name="precioHuachalomoOlla"
                  value={formData.precioHuachalomoOlla || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioHuachalomoOlla') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioHuachalomoOlla' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Cazuela Paleta</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="cazuelaPaleta"
                  name="cazuelaPaleta"
                  value={formData.cazuelaPaleta|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'cazuelaPaleta') ? 'input-error' : ''}`}
                />                {editError && editError.errors?.map((error, index) => (
                  error.field === 'cazuelaPaleta' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioCazuelaPaleta"
                  name="precioCazuelaPaleta"
                  value={formData.precioCazuelaPaleta || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioCazuelaPaleta') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioCazuelaPaleta' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Osobuco</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="osobuco"
                  name="osobuco"
                  value={formData.osobuco|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'osobuco') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'osobuco' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioOsobuco"
                  name="precioOsobuco"
                  value={formData.precioOsobuco || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioOsobuco') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioOsobuco' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Lagarto</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="lagarto"
                  name="lagarto"
                  value={formData.lagarto|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'lagarto') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'lagarto' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioLagarto"
                  name="precioLagarto"
                  value={formData.precioLagarto || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioLagarto') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioLagarto' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Costilla Vacuno</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="costillaVacuno"
                  name="costillaVacuno"
                  value={formData.costillaVacuno|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'costillaVacuno') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'costillaVacuno' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioCostillaVacuno"
                  name="precioCostillaVacuno"
                  value={formData.precioCostillaVacuno || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioCostillaVacuno') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioCostillaVacuno' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Tapaposta</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="tapaposta"
                  name="tapaposta"
                  value={formData.tapaposta|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'tapaposta') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'tapaposta' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioTapaposta"
                  name="precioTapaposta"
                  value={formData.precioTapaposta|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioTapaposta') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioTapaposta' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Malaya</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>kg</label>                <input
                  type="number"
                  id="malaya"
                  name="malaya"
                  value={formData.malaya|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'malaya') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'malaya' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>

              <div className="input-grupo">
                <label>Precio</label>                <input
                  type="number"
                  id="precioMalaya"
                  name="precioMalaya"
                  value={formData.precioMalaya|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioMalaya') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioMalaya' && (
                    <div key={index} className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
                <div className="modal-crear-acciones">
            <button type="submit" className="modal-boton-crear">
              Crear
            </button>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="modal-crear-cerrar"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>




      {/* Modal de Eliminación */}      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleDeleteModalClose}
        contentLabel="Confirmar Eliminación"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
        style={{ content: { maxWidth: '400px' } }}
      >
        <h2 className="formulario-table-modal-title">Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar esta lista de precios?</p>
        {animalCorteToDelete && (
          <div style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <p><strong>Lista:</strong> {animalCorteToDelete.nombreLista}</p>
          </div>
        )}
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
      </Modal>{/* Modal de Ver Detalles */}      <Modal
        isOpen={isViewModalOpen}
        onRequestClose={handleViewModalClose}
        contentLabel="Ver Detalles"
        ariaHideApp={false}
        className="modal-detalles"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <div className="modal-crear-formulario">          
          <div className="modal-detalles-header">          
            <h2 className="modal-detalles-titulo">Detalles de {animalCorteToView?.nombreLista}</h2>
            <button type="button" onClick={handleViewModalClose} className="modal-detalles-cerrar">×</button>
            <button
              type="button"
              onClick={() => {
                handleUpdateClick(animalCorteToView);
                handleViewModalClose();
              }}
              className="modal-detalles-editar"
            >
              <MdOutlineEdit size={24} />
            </button>
          </div>
          {animalCorteToView && (
            <div className="modal-detalles-contenido">
              <div className="datos-grid">
                <div className="dato-item">
                  <span className="dato-label">Abastecedor</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.abastero} kg</span>
                    <span className="precio">${animalCorteToView.precioAbastero}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Asado Tira</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.asadoTira} kg</span>
                    <span className="precio">${animalCorteToView.precioAsadoTira}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Asado Carnicero</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.asadoCarnicero} kg</span>
                    <span className="precio">${animalCorteToView.precioAsadoCarnicero}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Asiento</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.asiento} kg</span>
                    <span className="precio">${animalCorteToView.precioAsiento}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Choclillo</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.choclillo} cant</span>
                    <span className="precio">${animalCorteToView.precioChoclillo}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Cogote</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.cogote} kg</span>
                    <span className="precio">${animalCorteToView.precioCogote}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Entraña</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.entraña} kg</span>
                    <span className="precio">${animalCorteToView.precioEntraña}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Filete</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.filete} kg</span>
                    <span className="precio">${animalCorteToView.precioFilete}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Ganso</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.ganso} kg</span>
                    <span className="precio">${animalCorteToView.precioGanso}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Huachalomo</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.huachalomo} kg</span>
                    <span className="precio">${animalCorteToView.precioHuachalomo}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Lomo Liso</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.lomoLiso} kg</span>
                    <span className="precio">${animalCorteToView.precioLomoLiso}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Lomo Vetado</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.lomoVetado} kg</span>
                    <span className="precio">${animalCorteToView.precioLomoVetado}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Palanca</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.palanca} kg</span>
                    <span className="precio">${animalCorteToView.precioPalanca}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Plateada</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.plateada} kg</span>
                    <span className="precio">${animalCorteToView.precioPlateada}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Pollo Barriga</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.polloBarriga} kg</span>
                    <span className="precio">${animalCorteToView.precioPolloBarriga}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Pollo Ganso</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.polloGanso} kg</span>
                    <span className="precio">${animalCorteToView.precioPolloGanso}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Posta Negra</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.postaNegra} kg</span>
                    <span className="precio">${animalCorteToView.precioPostaNegra}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Posta Paleta</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.postaPaleta} kg</span>
                    <span className="precio">${animalCorteToView.precioPostaPaleta}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Posta Rosada</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.postaRosada} kg</span>
                    <span className="precio">${animalCorteToView.precioPostaRosada}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Punta Ganso</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.puntaGanso} kg</span>
                    <span className="precio">${animalCorteToView.precioPuntaGanso}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Punta Picana</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.puntaPicana} kg</span>
                    <span className="precio">${animalCorteToView.precioPuntaPicana}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Punta Paleta</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.puntaPaleta} kg</span>
                    <span className="precio">${animalCorteToView.precioPuntaPaleta}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Sobrecostilla</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.sobrecostilla} kg</span>
                    <span className="precio">${animalCorteToView.precioSobrecostilla}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Tapabarriga</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.tapabarriga} kg</span>
                    <span className="precio">${animalCorteToView.precioTapabarriga}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Tapapecho</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.tapapecho} kg</span>
                    <span className="precio">${animalCorteToView.precioTapapecho}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Hueso Carnudo</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.huesoCarnudo} kg</span>
                    <span className="precio">${animalCorteToView.precioHuesoCarnudo}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Hueso con Carne</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.huesoCConCarne} kg</span>
                    <span className="precio">${animalCorteToView.precioHuesoCConCarne}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Pata Vacuno</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.pataVacuno} kg</span>
                    <span className="precio">${animalCorteToView.precioPataVacuno}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Huachalomo Olla</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.huachalomoOlla} kg</span>
                    <span className="precio">${animalCorteToView.precioHuachalomoOlla}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Cazuela Paleta</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.cazuelaPaleta} kg</span>
                    <span className="precio">${animalCorteToView.precioCazuelaPaleta}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Osobuco</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.osobuco} kg</span>
                    <span className="precio">${animalCorteToView.precioOsobuco}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Lagarto</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.lagarto} kg</span>
                    <span className="precio">${animalCorteToView.precioLagarto}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Costilla Vacuno</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.costillaVacuno} kg</span>
                    <span className="precio">${animalCorteToView.precioCostillaVacuno}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Tapaposta</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.tapaposta} kg</span>
                    <span className="precio">${animalCorteToView.precioTapaposta}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Malaya</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.malaya} kg</span>
                    <span className="precio">${animalCorteToView.precioMalaya}</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default VerAnimalListaCorte;

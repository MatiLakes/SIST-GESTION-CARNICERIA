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
import "@styles/formulariotable.css";
import "@styles/modalDetalles.css";
import "@styles/modalCrear.css";

import Swal from "sweetalert2";

const VerAnimalListaCorte = () => {
  const { animalCortes, loading, error, fetchAnimalCortes } = useGetAnimalCorte();
  const { handleCreate } = useCreateAnimalCorte(fetchAnimalCortes);
  const { handleDelete } = useDeleteAnimalCorte(fetchAnimalCortes);
  const { handleUpdate } = useUpdateAnimalCorte(fetchAnimalCortes);
  const { createError, editError, handleCreateError, handleEditError } = useErrorHandlerAnimalCorte();

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
  const [formError, setFormError] = useState("");

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
    setNewAnimalCorteData({ ...newAnimalCorteData, [e.target.name]: e.target.value });
  };  

  const handleCreateModalSubmit = (e) => {
    e.preventDefault();

    const validatedData = { ...newAnimalCorteData };
    for (let key in validatedData) {
      if (validatedData[key] === '') {
        validatedData[key] = 0;
      }
    }

    // Usar el hook de manejo de errores
    const hasErrors = handleCreateError(validatedData);
    if (hasErrors) {
      setFormError(createError);
      return;
    }    

    setFormError(null);
    handleCreate(validatedData)
      .then(() => {
        // Solo cerramos el modal y reseteamos si la creación fue exitosa
        setIsCreateModalOpen(false);
        setFormError(null);
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
      })
      .catch(error => {
        const errorMessage = error.message === "Ya existe un tipo de animal con este nombre de lista."
          ? `Ya existe un tipo de animal con el nombre "${validatedData.nombreLista}"`
          : "El nombre de la lista ya existe.";

        setFormError({
          field: 'nombreLista',
          message: errorMessage
        });
      });
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Validar los datos antes de proceder
    const validatedData = { ...formData };
    for (let key in validatedData) {
      if (validatedData[key] === '') {
        validatedData[key] = 0;
      }
    }
    
    // Usar el hook de manejo de errores
    const hasErrors = handleEditError(validatedData);
    if (hasErrors) {
      setFormError(editError);
      return;
    }
    
    setFormError("");

    if (animalCorteToEdit) {
      try {
        await handleUpdate(animalCorteToEdit.id, validatedData);
        // Solo cerramos el modal y limpiamos el form si la actualización fue exitosa
        setIsEditModalOpen(false);
        setFormData({
          nombreLista: ""
        });
      } catch (error) {
        const errorData = {
          status: "Client error",
          message: error.message === "Ya existe un tipo de animal con este nombre de lista." 
            ? `Ya existe un tipo de animal con el nombre "${validatedData.nombreLista}"`
            : "El nombre de la lista de precio está siendo utilizado en otra parte.",
          details: {}
        };
        setFormError(errorData);
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
    { header: "ID", key: "id" },
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
        <form onSubmit={handleCreateModalSubmit} className="modal-crear-formulario">
          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Añadir lista de Precios</h2>
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="modal-crear-cerrar">×</button>
            <button type="submit" className="modal-boton-crear">Guardar</button>
          </div>
          {formError && <div className="error-message" style={{color: 'red', marginBottom: '10px', textAlign: 'center'}}>
            {typeof formError === 'object' ? formError.message : formError}
          </div>}          <div className="subproducto-fila" style={{ 
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
            <div style={{ flex: 1, marginLeft: '10px' }}>
              <input
                type="text"
                id="nombreLista"
                name="nombreLista"
                value={newAnimalCorteData.nombreLista}
                onChange={handleCreateModalChange}
                required
                className="formulario-input"
                placeholder="Ingrese el nombre de la lista"
                style={{ 
                  width: '250px',
                  background: 'white',
                  border: '1px solid #ccc'
                }}
              />
              {createError?.message && createError.field === 'nombreLista' && (
                <div className="error-message">{createError.message}</div>
              )}
            </div>
          </div>

          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Abastero</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="abastero"
                  name="abastero"
                  value={newAnimalCorteData.abastero || 0}
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>
              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioAbastero"
                  name="precioAbastero"
                  value={newAnimalCorteData.precioAbastero || 0}
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Asado Tira</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="CantidadAsadoTira"
                  name="asadoTira"
                  value={newAnimalCorteData.asadoTira || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioAsadoTira"
                  name="precioAsadoTira"
                  value={newAnimalCorteData.precioAsadoTira || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Asado Carnicero</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="asadoCarniceror"
                  name="asadoCarnicero"
                  value={newAnimalCorteData.asadoCarnicero || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioAsadoCarnicero"
                  name="precioAsadoCarnicero"
                  value={newAnimalCorteData.precioAsadoCarnicero || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Asiento</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="asientor"
                  name="asiento"
                  value={newAnimalCorteData.asiento || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioAsiento"
                  name="precioAsiento"
                  value={newAnimalCorteData.precioAsiento || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Choclillo</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="choclillo"
                  name="choclillo"
                  value={newAnimalCorteData.choclillo || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioChoclillo"
                  name="precioChoclillo"
                  value={newAnimalCorteData.precioChoclillo || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Cogote</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="cogote"
                  name="cogote"
                  value={newAnimalCorteData.cogote || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioCogote"
                  name="precioCogote"
                  value={newAnimalCorteData.precioCogote || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Entraña</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="entraña"
                  name="entraña"
                  value={newAnimalCorteData.entraña || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioEntraña"
                  name="precioEntraña"
                  value={newAnimalCorteData.precioEntraña || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Filete</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="filete"
                  name="filete"
                  value={newAnimalCorteData.filete || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioFilete"
                  name="precioFilete"
                  value={newAnimalCorteData.precioFilete || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Ganso</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="ganso"
                  name="ganso"
                  value={newAnimalCorteData.ganso || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioGanso"
                  name="precioGanso"
                  value={newAnimalCorteData.precioGanso || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Huachalomo</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="huachalomo"
                  name="huachalomo"
                  value={newAnimalCorteData.huachalomo || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioHuachalomo"
                  name="precioHuachalomo"
                  value={newAnimalCorteData.precioHuachalomo|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Lomo Liso</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="lomoLiso"
                  name="lomoLiso"
                  value={newAnimalCorteData.lomoLiso || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioLomoLiso"
                  name="precioLomoLiso"
                  value={newAnimalCorteData.precioLomoLiso || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Lomo Vetado</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="lomoVetado"
                  name="lomoVetado"
                  value={newAnimalCorteData.lomoVetado|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>


              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioLomoVetado"
                  name="precioLomoVetado"
                  value={newAnimalCorteData.precioLomoVetado || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Palanca</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="palanca"
                  name="palanca"
                  value={newAnimalCorteData.palanca|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioPalanca"
                  name="precioPalanca"
                  value={newAnimalCorteData.precioPalanca|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Plateada</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="plateada"
                  name="plateada"
                  value={newAnimalCorteData.plateada|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioPlateada"
                  name="precioPlateada"
                  value={newAnimalCorteData.precioPlateada|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Pollo Barriga</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="polloBarriga"
                  name="polloBarriga"
                  value={newAnimalCorteData.polloBarriga|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioPolloBarriga"
                  name="precioPolloBarriga"
                  value={newAnimalCorteData.precioPolloBarriga || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Pollo Ganso</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="polloGanso"
                  name="polloGanso"
                  value={newAnimalCorteData.polloGanso|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioPolloGanso"
                  name="precioPolloGanso"
                  value={newAnimalCorteData.precioPolloGanso || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Posta Negra</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="postaNegra"
                  name="postaNegra"
                  value={newAnimalCorteData.postaNegra|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioPostaNegra"
                  name="precioPostaNegra"
                  value={newAnimalCorteData.precioPostaNegra|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Posta Paleta</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="postaPaleta"
                  name="postaPaleta"
                  value={newAnimalCorteData.postaPaleta|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioPostaPaleta"
                  name="precioPostaPaleta"
                  value={newAnimalCorteData.precioPostaPaleta|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Posta Rosada</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="postaRosada"
                  name="postaRosada"
                  value={newAnimalCorteData.postaRosada|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioPostaRosada"
                  name="precioPostaRosada"
                  value={newAnimalCorteData.precioPostaRosada || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Punta Ganso</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="puntaGanso"
                  name="puntaGanso"
                  value={newAnimalCorteData.puntaGanso|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioPuntaGanso"
                  name="precioPuntaGanso"
                  value={newAnimalCorteData.precioPuntaGanso || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Punta Picana</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="puntaPicana"
                  name="puntaPicana"
                  value={newAnimalCorteData.puntaPicana|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioPuntaPicana"
                  name="precioPuntaPicana"
                  value={newAnimalCorteData.precioPuntaPicana || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Punta Paleta</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="puntaPaleta"
                  name="puntaPaleta"
                  value={newAnimalCorteData.puntaPaleta|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioPuntaPaleta"
                  name="precioPuntaPaleta"
                  value={newAnimalCorteData.precioPuntaPaleta|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Sobrecostilla</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="sobrecostilla"
                  name="sobrecostilla"
                  value={newAnimalCorteData.sobrecostilla|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioSobrecostilla"
                  name="precioSobrecostilla"
                  value={newAnimalCorteData.precioSobrecostilla|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Tapabarriga</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="tapabarriga"
                  name="tapabarriga"
                  value={newAnimalCorteData.tapabarriga|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioTapabarriga"
                  name="precioTapabarriga"
                  value={newAnimalCorteData.precioTapabarriga|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Tapapecho</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="tapapecho"
                  name="tapapecho"
                  value={newAnimalCorteData.tapapecho|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioTapapecho"
                  name="precioTapapecho"
                  value={newAnimalCorteData.precioTapapecho || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Hueso Carnudo</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="huesoCarnudo"
                  name="huesoCarnudo"
                  value={newAnimalCorteData.huesoCarnudo|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioHuesoCarnudo"
                  name="precioHuesoCarnudo"
                  value={newAnimalCorteData.precioHuesoCarnudo || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Hueso con Carne</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="huesoCConCarne"
                  name="huesoCConCarne"
                  value={newAnimalCorteData.huesoCConCarne|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioHuesoCConCarne"
                  name="precioHuesoCConCarne"
                  value={newAnimalCorteData.precioHuesoCConCarne || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Pata Vacuno</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="pataVacuno"
                  name="pataVacuno"
                  value={newAnimalCorteData.pataVacuno|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioPataVacuno"
                  name="precioPataVacuno"
                  value={newAnimalCorteData.precioPataVacuno|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Huachalomo Olla</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="huachalomoOlla"
                  name="huachalomoOlla"
                  value={newAnimalCorteData.huachalomoOlla|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioHuachalomoOlla"
                  name="precioHuachalomoOlla"
                  value={newAnimalCorteData.precioHuachalomoOlla || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Cazuela Paleta</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="cazuelaPaleta"
                  name="cazuelaPaleta"
                  value={newAnimalCorteData.cazuelaPaleta|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioCazuelaPaleta"
                  name="precioCazuelaPaleta"
                  value={newAnimalCorteData.precioCazuelaPaleta || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Osobuco</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="osobuco"
                  name="osobuco"
                  value={newAnimalCorteData.osobuco|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioOsobuco"
                  name="precioOsobuco"
                  value={newAnimalCorteData.precioOsobuco || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Lagarto</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="lagarto"
                  name="lagarto"
                  value={newAnimalCorteData.lagarto|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioLagarto"
                  name="precioLagarto"
                  value={newAnimalCorteData.precioLagarto || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Costilla Vacuno</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="costillaVacuno"
                  name="costillaVacuno"
                  value={newAnimalCorteData.costillaVacuno|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioCostillaVacuno"
                  name="precioCostillaVacuno"
                  value={newAnimalCorteData.precioCostillaVacuno || 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Tapaposta</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="tapaposta"
                  name="tapaposta"
                  value={newAnimalCorteData.tapaposta|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioTapaposta"
                  name="precioTapaposta"
                  value={newAnimalCorteData.precioTapaposta|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Malaya</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="malaya"
                  name="malaya"
                  value={newAnimalCorteData.malaya|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioMalaya"
                  name="precioMalaya"
                  value={newAnimalCorteData.precioMalaya|| 0} 
                  onChange={handleCreateModalChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
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
          </div>
          {formError && <div className="error-message" style={{color: 'red', marginBottom: '10px', textAlign: 'center'}}>
            {typeof formError === 'object' ? formError.message : formError}
          </div>}          <div className="subproducto-fila" style={{ maxWidth: '500px', margin: '0 auto', padding: '10px', display: 'flex', alignItems: 'center', background: 'none', border: 'none' }}>
            <div style={{ minWidth: '120px' }}>
              <span className="subproducto-nombre">Nombre de la lista:</span>
            </div>
            <div style={{ flex: 1, marginLeft: '10px' }}>
              <input
                type="text"
                id="nombreLista"
                name="nombreLista"
                value={formData.nombreLista}
                onChange={handleEditChange}
                required
                className="formulario-input"
                placeholder="Ingrese el nombre de la lista"
                style={{ width: '250px', background: 'white', border: '1px solid #ccc' }}
              />
              {editError?.message && editError.field === 'nombreLista' && (
                <div className="error-message" style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>
                  {editError.message}
                </div>
              )}
            </div>
          </div>

          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Abastero</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="abastero"
                  name="abastero"
                  value={formData.abastero || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioAbastero"
                  name="precioAbastero"
                  value={formData.precioAbastero || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Asado Tira</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="CantidadAsadoTira"
                  name="asadoTira"
                  value={formData.asadoTira || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioAsadoTira"
                  name="precioAsadoTira"
                  value={formData.precioAsadoTira || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Asado Carnicero</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="asadoCarniceror"
                  name="asadoCarnicero"
                  value={formData.asadoCarnicero || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioAsadoCarnicero"
                  name="precioAsadoCarnicero"
                  value={formData.precioAsadoCarnicero || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Asiento</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="asientor"
                  name="asiento"
                  value={formData.asiento || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioAsiento"
                  name="precioAsiento"
                  value={formData.precioAsiento || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Choclillo</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="choclillo"
                  name="choclillo"
                  value={formData.choclillo || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioChoclillo"
                  name="precioChoclillo"
                  value={formData.precioChoclillo || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Cogote</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="cogote"
                  name="cogote"
                  value={formData.cogote || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioCogote"
                  name="precioCogote"
                  value={formData.precioCogote || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Entraña</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="entraña"
                  name="entraña"
                  value={formData.entraña || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioEntraña"
                  name="precioEntraña"
                  value={formData.precioEntraña || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Filete</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="filete"
                  name="filete"
                  value={formData.filete || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioFilete"
                  name="precioFilete"
                  value={formData.precioFilete || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Ganso</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="ganso"
                  name="ganso"
                  value={formData.ganso || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioGanso"
                  name="precioGanso"
                  value={formData.precioGanso || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Huachalomo</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="huachalomo"
                  name="huachalomo"
                  value={formData.huachalomo || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioHuachalomo"
                  name="precioHuachalomo"
                  value={formData.precioHuachalomo|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Lomo Liso</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="lomoLiso"
                  name="lomoLiso"
                  value={formData.lomoLiso || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioLomoLiso"
                  name="precioLomoLiso"
                  value={formData.precioLomoLiso || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Lomo Vetado</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="lomoVetado"
                  name="lomoVetado"
                  value={formData.lomoVetado|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>


              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioLomoVetado"
                  name="precioLomoVetado"
                  value={formData.precioLomoVetado || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Palanca</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="palanca"
                  name="palanca"
                  value={formData.palanca|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioPalanca"
                  name="precioPalanca"
                  value={formData.precioPalanca|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Plateada</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="plateada"
                  name="plateada"
                  value={formData.plateada|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioPlateada"
                  name="precioPlateada"
                  value={formData.precioPlateada|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Pollo Barriga</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="polloBarriga"
                  name="polloBarriga"
                  value={formData.polloBarriga|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioPolloBarriga"
                  name="precioPolloBarriga"
                  value={formData.precioPolloBarriga || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Pollo Ganso</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="polloGanso"
                  name="polloGanso"
                  value={formData.polloGanso|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioPolloGanso"
                  name="precioPolloGanso"
                  value={formData.precioPolloGanso || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Posta Negra</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="postaNegra"
                  name="postaNegra"
                  value={formData.postaNegra|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioPostaNegra"
                  name="precioPostaNegra"
                  value={formData.precioPostaNegra|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Posta Paleta</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="postaPaleta"
                  name="postaPaleta"
                  value={formData.postaPaleta|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioPostaPaleta"
                  name="precioPostaPaleta"
                  value={formData.precioPostaPaleta|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Posta Rosada</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="postaRosada"
                  name="postaRosada"
                  value={formData.postaRosada|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioPostaRosada"
                  name="precioPostaRosada"
                  value={formData.precioPostaRosada || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Punta Ganso</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="puntaGanso"
                  name="puntaGanso"
                  value={formData.puntaGanso|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioPuntaGanso"
                  name="precioPuntaGanso"
                  value={formData.precioPuntaGanso || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Punta Picana</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="puntaPicana"
                  name="puntaPicana"
                  value={formData.puntaPicana|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioPuntaPicana"
                  name="precioPuntaPicana"
                  value={formData.precioPuntaPicana || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Punta Paleta</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="puntaPaleta"
                  name="puntaPaleta"
                  value={formData.puntaPaleta|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioPuntaPaleta"
                  name="precioPuntaPaleta"
                  value={formData.precioPuntaPaleta|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Sobrecostilla</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="sobrecostilla"
                  name="sobrecostilla"
                  value={formData.sobrecostilla|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioSobrecostilla"
                  name="precioSobrecostilla"
                  value={formData.precioSobrecostilla|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Tapabarriga</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="tapabarriga"
                  name="tapabarriga"
                  value={formData.tapabarriga|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioTapabarriga"
                  name="precioTapabarriga"
                  value={formData.precioTapabarriga|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Tapapecho</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="tapapecho"
                  name="tapapecho"
                  value={formData.tapapecho|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioTapapecho"
                  name="precioTapapecho"
                  value={formData.precioTapapecho || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Hueso Carnudo</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="huesoCarnudo"
                  name="huesoCarnudo"
                  value={formData.huesoCarnudo|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioHuesoCarnudo"
                  name="precioHuesoCarnudo"
                  value={formData.precioHuesoCarnudo || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Hueso con Carne</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="huesoCConCarne"
                  name="huesoCConCarne"
                  value={formData.huesoCConCarne|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioHuesoCConCarne"
                  name="precioHuesoCConCarne"
                  value={formData.precioHuesoCConCarne || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Pata Vacuno</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="pataVacuno"
                  name="pataVacuno"
                  value={formData.pataVacuno|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioPataVacuno"
                  name="precioPataVacuno"
                  value={formData.precioPataVacuno|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Huachalomo Olla</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="huachalomoOlla"
                  name="huachalomoOlla"
                  value={formData.huachalomoOlla|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioHuachalomoOlla"
                  name="precioHuachalomoOlla"
                  value={formData.precioHuachalomoOlla || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Cazuela Paleta</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="cazuelaPaleta"
                  name="cazuelaPaleta"
                  value={formData.cazuelaPaleta|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioCazuelaPaleta"
                  name="precioCazuelaPaleta"
                  value={formData.precioCazuelaPaleta || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Osobuco</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="osobuco"
                  name="osobuco"
                  value={formData.osobuco|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioOsobuco"
                  name="precioOsobuco"
                  value={formData.precioOsobuco || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Lagarto</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="lagarto"
                  name="lagarto"
                  value={formData.lagarto|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioLagarto"
                  name="precioLagarto"
                  value={formData.precioLagarto || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Costilla Vacuno</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="costillaVacuno"
                  name="costillaVacuno"
                  value={formData.costillaVacuno|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioCostillaVacuno"
                  name="precioCostillaVacuno"
                  value={formData.precioCostillaVacuno || 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Tapaposta</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="tapaposta"
                  name="tapaposta"
                  value={formData.tapaposta|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioTapaposta"
                  name="precioTapaposta"
                  value={formData.precioTapaposta|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
          
          <div className="subproducto-fila">
            <div className="subproducto-nombre-grupo">
              <span className="subproducto-nombre">Malaya</span>
            </div>
            <div className="subproducto-inputs-grupo">
              <div className="input-grupo">
                <label>Cantidad</label>
                <input
                  type="number"
                  id="malaya"
                  name="malaya"
                  value={formData.malaya|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.1"
                  className="formulario-input"
                />
              </div>

              <div className="input-grupo">
                <label>Precio</label>
                <input
                  type="number"
                  id="precioMalaya"
                  name="precioMalaya"
                  value={formData.precioMalaya|| 0} 
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="1"
                  className="formulario-input"
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>






      {/* Modal de Eliminación */}      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleDeleteModalClose}
        contentLabel="Eliminar"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
        
      >
        <h2 className="formulario-table-modal-title">¿Estás seguro que deseas eliminar?</h2>
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
      </Modal>      {/* Modal de Ver Detalles */}      <Modal
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
            <h2 className="modal-detalles-titulo">Detalles: {animalCorteToView?.nombreLista}</h2>
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
                    <span className="cantidad">{animalCorteToView.abastero} cant.</span>
                    <span className="precio">${animalCorteToView.precioAbastero}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Asado Tira</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.asadoTira} cant.</span>
                    <span className="precio">${animalCorteToView.precioAsadoTira}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Asado Carnicero</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.asadoCarnicero} cant.</span>
                    <span className="precio">${animalCorteToView.precioAsadoCarnicero}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Asiento</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.asiento} cant.</span>
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
                    <span className="cantidad">{animalCorteToView.cogote} cant.</span>
                    <span className="precio">${animalCorteToView.precioCogote}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Entraña</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.entraña} cant.</span>
                    <span className="precio">${animalCorteToView.precioEntraña}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Filete</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.filete} cant.</span>
                    <span className="precio">${animalCorteToView.precioFilete}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Ganso</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.ganso} cant.</span>
                    <span className="precio">${animalCorteToView.precioGanso}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Huachalomo</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.huachalomo} cant.</span>
                    <span className="precio">${animalCorteToView.precioHuachalomo}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Lomo Liso</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.lomoLiso} cant.</span>
                    <span className="precio">${animalCorteToView.precioLomoLiso}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Lomo Vetado</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.lomoVetado} cant.</span>
                    <span className="precio">${animalCorteToView.precioLomoVetado}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Palanca</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.palanca} cant.</span>
                    <span className="precio">${animalCorteToView.precioPalanca}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Plateada</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.plateada} cant.</span>
                    <span className="precio">${animalCorteToView.precioPlateada}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Pollo Barriga</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.polloBarriga} cant.</span>
                    <span className="precio">${animalCorteToView.precioPolloBarriga}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Pollo Ganso</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.polloGanso} cant.</span>
                    <span className="precio">${animalCorteToView.precioPolloGanso}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Posta Negra</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.postaNegra} cant.</span>
                    <span className="precio">${animalCorteToView.precioPostaNegra}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Posta Paleta</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.postaPaleta} cant.</span>
                    <span className="precio">${animalCorteToView.precioPostaPaleta}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Posta Rosada</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.postaRosada} cant.</span>
                    <span className="precio">${animalCorteToView.precioPostaRosada}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Punta Ganso</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.puntaGanso} cant.</span>
                    <span className="precio">${animalCorteToView.precioPuntaGanso}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Punta Picana</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.puntaPicana} cant.</span>
                    <span className="precio">${animalCorteToView.precioPuntaPicana}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Punta Paleta</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.puntaPaleta} cant.</span>
                    <span className="precio">${animalCorteToView.precioPuntaPaleta}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Sobrecostilla</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.sobrecostilla} cant.</span>
                    <span className="precio">${animalCorteToView.precioSobrecostilla}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Tapabarriga</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.tapabarriga} cant.</span>
                    <span className="precio">${animalCorteToView.precioTapabarriga}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Tapapecho</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.tapapecho} cant.</span>
                    <span className="precio">${animalCorteToView.precioTapapecho}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Hueso Carnudo</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.huesoCarnudo} cant.</span>
                    <span className="precio">${animalCorteToView.precioHuesoCarnudo}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Hueso con Carne</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.huesoCConCarne} cant.</span>
                    <span className="precio">${animalCorteToView.precioHuesoCConCarne}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Pata Vacuno</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.pataVacuno} cant.</span>
                    <span className="precio">${animalCorteToView.precioPataVacuno}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Huachalomo Olla</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.huachalomoOlla} cant.</span>
                    <span className="precio">${animalCorteToView.precioHuachalomoOlla}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Cazuela Paleta</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.cazuelaPaleta} cant.</span>
                    <span className="precio">${animalCorteToView.precioCazuelaPaleta}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Osobuco</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.osobuco} cant.</span>
                    <span className="precio">${animalCorteToView.precioOsobuco}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Lagarto</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.lagarto} cant.</span>
                    <span className="precio">${animalCorteToView.precioLagarto}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Costilla Vacuno</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.costillaVacuno} cant.</span>
                    <span className="precio">${animalCorteToView.precioCostillaVacuno}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Tapaposta</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.tapaposta} cant.</span>
                    <span className="precio">${animalCorteToView.precioTapaposta}</span>
                  </span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Malaya</span>
                  <span className="dato-value">
                    <span className="cantidad">{animalCorteToView.malaya} cant.</span>
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

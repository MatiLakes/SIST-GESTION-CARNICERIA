import React, { useState, useEffect, useCallback } from "react";
import useGetMermas from "@hooks/mermas/useGetMermas";
import useCreateMerma from "@hooks/mermas/useCreateMerma";
import useDeleteMerma from "@hooks/mermas/useDeleteMerma";
import useEditMerma from "@hooks/mermas/useEditMerma";
import useFilterMermasByTipo from "@hooks/mermas/useFilterMermasByTipo";
import useFilterMermasByFecha from "@hooks/mermas/useFilterMermasByFecha";
import useFilterMermasByPersonal from "@hooks/mermas/useFilterMermasByPersonal";
import useGetReferencesForMermas from "@hooks/mermas/useGetReferencesForMermas";
import { useErrorHandlerMerma } from "@hooks/mermas/useErrorHandlerMerma";
import { descargarExcel } from "@services/excel.service";
import { descargarExcelMermas } from "@services/merma.service";
import Table from "../components/Table";
import Modal from "react-modal";
import styles from "@styles/categoria.module.css";
import "@styles/formulariotable.css";
import "@styles/modalDetalles.css";
import "@styles/modalCrear.css";
import Swal from "sweetalert2";

const Mermas = () => {
  const { mermas, loading, fetchMermas } = useGetMermas();
  const { create } = useCreateMerma(fetchMermas);
  const { remove } = useDeleteMerma(fetchMermas);
  const { edit } = useEditMerma(fetchMermas);
  const { filterByTipo } = useFilterMermasByTipo();
  const { filterByFecha } = useFilterMermasByFecha();
  const { filterByPersonal } = useFilterMermasByPersonal();
  const {
    personal,
    productos,
    subproductos,
    animalCortes,
    animalVaras,
    recepcionesStock,
    loading: loadingReferences,
    fetchAllData
  } = useGetReferencesForMermas();
  const { createError, editError, handleCreateError, handleEditError, clearErrors } = useErrorHandlerMerma();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentMerma, setCurrentMerma] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mermaToDelete, setMermaToDelete] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedFilterType, setSelectedFilterType] = useState("tipo");
  const [filterParams, setFilterParams] = useState({
    tipo: "carne",
    personalId: "",
    fechaInicio: "",
    fechaFin: ""
  });
  const [filteredResults, setFilteredResults] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);

  // Form state for creating new mermas
  const [newMerma, setNewMerma] = useState({
    tipoProductoMerma: "carne",
    cantidadPerdida: "",
    causa: "",
    detalles: "",
    personal: null,
    producto: null,
    subproducto: null,
    animalCorte: null,
    animalVara: null,
    tipoCorteCarne: "", // Nuevo campo para el tipo de corte específico (asado carnicero, etc.)
    tipoSubproducto: "", // Nuevo campo para el tipo de subproducto específico (guata, corazón, etc.)
    recepcionStock: null
  });

  // Estado para almacenar las varas disponibles según el corte seleccionado
  const [availableVaras, setAvailableVaras] = useState([]);

  // Estado para almacenar las recepciones de stock disponibles según el producto/subproducto seleccionado
  const [availableRecepciones, setAvailableRecepciones] = useState([]);

  useEffect(() => {
    // Si se ha seleccionado un corte de animal, filtrar las varas disponibles
    if (newMerma.tipoProductoMerma === "carne" && newMerma.animalCorte) {
      const filteredVaras = animalVaras.filter(
        vara => vara.tipoAnimal && vara.tipoAnimal.id === newMerma.animalCorte.id
      );
      setAvailableVaras(filteredVaras);
    } else {
      setAvailableVaras([]);
    }
  }, [newMerma.animalCorte, animalVaras, newMerma.tipoProductoMerma]);

  useEffect(() => {
    // Si se ha seleccionado un producto, filtrar las recepciones disponibles
    if (newMerma.tipoProductoMerma === "producto" && newMerma.producto) {
      const filteredRecepciones = recepcionesStock.filter(
        recepcion => recepcion.producto && recepcion.producto.id === newMerma.producto.id
      );
      setAvailableRecepciones(filteredRecepciones);
    } else {
      setAvailableRecepciones([]);
    }
  }, [newMerma.producto, recepcionesStock, newMerma.tipoProductoMerma]);

  // Función para obtener la etiqueta de cantidad según el tipo de producto
  const getCantidadLabel = (mermaData) => {
    return "Cantidad:"; // Simplificado para ser más limpio
  };

  // Función para obtener el placeholder según el tipo de producto
  const getCantidadPlaceholder = (mermaData) => {
    if (!mermaData) return "Ingrese la cantidad";
    
    if (mermaData.tipoProductoMerma === "producto" && mermaData.producto) {
      // Si el producto tiene tipoMedida, usarlo; si no, asumir unidades por defecto
      const tipoMedida = mermaData.producto.tipoMedida || "unidades";
      return tipoMedida === "kilos" ? "Cantidad en kilos" : "Cantidad en unidades";
    } else if (mermaData.tipoProductoMerma === "subproducto") {
      // Los subproductos generalmente se miden en unidades
      return "Cantidad en unidades";
    } else if (mermaData.tipoProductoMerma === "carne") {
      return "Cantidad en kilos";
    }
    return "Ingrese la cantidad";
  };

  const openModal = () => {
    clearErrors();
    setNewMerma({
      tipoProductoMerma: "carne",
      cantidadPerdida: "",
      causa: "",
      detalles: "",
      personal: null,
      producto: null,
      subproducto: null,
      animalCorte: null,
      animalVara: null,
      tipoCorteCarne: "", // Resetear el tipo de corte específico
      tipoSubproducto: "", // Resetear el tipo de subproducto específico
      recepcionStock: null
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const openEditModal = (merma) => {
    clearErrors();
    setCurrentMerma(merma);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  const handleDeleteModalOpen = (merma) => {
    setMermaToDelete(merma);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setMermaToDelete(null);
  };

  const openFilterModal = () => setIsFilterModalOpen(true);
  const closeFilterModal = () => setIsFilterModalOpen(false);

  const confirmDelete = async () => {
    if (mermaToDelete) {
      try {
        await remove(mermaToDelete.id);
        handleDeleteModalClose();
        Swal.fire({
          title: "¡Eliminado!",
          text: "La merma ha sido eliminada correctamente.",
          icon: "success",
          confirmButtonText: "OK"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar la merma.",
          icon: "error",
          confirmButtonText: "OK"
        });
      }
    }
  };

  const handleCreateMerma = async (e) => {
    e.preventDefault();
    try {
      // Limpiar datos según el tipo de merma
      const mermaDataToSend = { ...newMerma };
      
      if (mermaDataToSend.tipoProductoMerma === "subproducto") {
        // Para subproductos, no enviar recepcionStock
        delete mermaDataToSend.recepcionStock;
      } else if (mermaDataToSend.tipoProductoMerma === "carne") {
        // Para carne, no enviar recepcionStock, producto, subproducto
        delete mermaDataToSend.recepcionStock;
        delete mermaDataToSend.producto;
        delete mermaDataToSend.subproducto;
        delete mermaDataToSend.tipoSubproducto;
      } else if (mermaDataToSend.tipoProductoMerma === "producto") {
        // Para productos, no enviar subproducto, animalCorte, etc.
        delete mermaDataToSend.subproducto;
        delete mermaDataToSend.animalCorte;
        delete mermaDataToSend.animalVara;
        delete mermaDataToSend.tipoCorteCarne;
        delete mermaDataToSend.tipoSubproducto;
      }
      
      await create(mermaDataToSend);
      closeModal();
      Swal.fire({
        title: "¡Creado!",
        text: "La merma ha sido registrada correctamente.",
        icon: "success",
        confirmButtonText: "OK"
      });
    } catch (error) {
      handleCreateError(error);
    }
  };

  const handleUpdateMerma = async (e) => {
    e.preventDefault();
    if (currentMerma) {
      try {
        await edit(currentMerma.id, currentMerma);
        closeEditModal();
        Swal.fire({
          title: "¡Actualizado!",
          text: "La merma ha sido actualizada correctamente.",
          icon: "success",
          confirmButtonText: "OK"
        });
      } catch (error) {
        handleEditError(error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMerma({ ...newMerma, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentMerma({ ...currentMerma, [name]: value });
  };

  const handleTipoChange = (e) => {
    const tipo = e.target.value;
    setNewMerma({
      ...newMerma,
      tipoProductoMerma: tipo,
      producto: null,
      subproducto: null,
      animalCorte: null,
      animalVara: null,
      tipoCorteCarne: "", // Reset el tipo de corte carne
      tipoSubproducto: "", // Reset el tipo de subproducto
      recepcionStock: null
    });
  };

  const handleEditTipoChange = (e) => {
    const tipo = e.target.value;
    setCurrentMerma({
      ...currentMerma,
      tipoProductoMerma: tipo,
      producto: null,
      subproducto: null,
      animalCorte: null,
      animalVara: null,
      tipoCorteCarne: "", // Reset el tipo de corte carne
      recepcionStock: null
    });
  };

  const handleSelectChange = (e, fieldName) => {
    const value = e.target.value;
    if (value === "") {
      setNewMerma({ ...newMerma, [fieldName]: null });
    } else {
      const itemId = parseInt(value, 10);
      
      let selectedItem;
      switch (fieldName) {
        case "personal":
          selectedItem = personal.find(item => item.id === itemId);
          break;
        case "producto":
          selectedItem = productos.find(item => item.id === itemId);
          setNewMerma({ ...newMerma, [fieldName]: selectedItem, subproducto: null, animalCorte: null, animalVara: null });
          return;
        case "subproducto":
          selectedItem = subproductos.find(item => item.id === itemId);
          setNewMerma({ ...newMerma, [fieldName]: selectedItem, producto: null, animalCorte: null, animalVara: null });
          return;
        case "animalCorte":
          selectedItem = animalCortes.find(item => item.id === itemId);
          setNewMerma({ ...newMerma, [fieldName]: selectedItem, producto: null, subproducto: null, animalVara: null });
          return;
        case "animalVara":
          selectedItem = animalVaras.find(item => item.id === itemId);
          break;
        case "recepcionStock":
          selectedItem = recepcionesStock.find(item => item.id === itemId);
          break;
        default:
          break;
      }
      
      setNewMerma({ ...newMerma, [fieldName]: selectedItem });
    }
  };

  const handleEditSelectChange = (e, fieldName) => {
    const value = e.target.value;
    if (value === "") {
      setCurrentMerma({ ...currentMerma, [fieldName]: null });
    } else {
      const itemId = parseInt(value, 10);
      
      let selectedItem;
      switch (fieldName) {
        case "personal":
          selectedItem = personal.find(item => item.id === itemId);
          break;
        case "producto":
          selectedItem = productos.find(item => item.id === itemId);
          setCurrentMerma({ ...currentMerma, [fieldName]: selectedItem, subproducto: null, animalCorte: null, animalVara: null });
          return;
        case "subproducto":
          selectedItem = subproductos.find(item => item.id === itemId);
          setCurrentMerma({ ...currentMerma, [fieldName]: selectedItem, producto: null, animalCorte: null, animalVara: null });
          return;
        case "animalCorte":
          selectedItem = animalCortes.find(item => item.id === itemId);
          setCurrentMerma({ ...currentMerma, [fieldName]: selectedItem, producto: null, subproducto: null, animalVara: null });
          return;
        case "animalVara":
          selectedItem = animalVaras.find(item => item.id === itemId);
          break;
        case "recepcionStock":
          selectedItem = recepcionesStock.find(item => item.id === itemId);
          break;
        default:
          break;
      }
      
      setCurrentMerma({ ...currentMerma, [fieldName]: selectedItem });
    }
  };

  const handleFilterTypeChange = (e) => {
    setSelectedFilterType(e.target.value);
  };

  const handleFilterParamChange = (e) => {
    const { name, value } = e.target;
    setFilterParams({ ...filterParams, [name]: value });
  };

  const applyFilter = async () => {
    setIsFiltering(true);
    try {
      let results;
      switch (selectedFilterType) {
        case "tipo":
          results = await filterByTipo(filterParams.tipo);
          break;
        case "fecha":
          results = await filterByFecha(filterParams.fechaInicio, filterParams.fechaFin);
          break;
        case "personal":
          results = await filterByPersonal(filterParams.personalId);
          break;
        default:
          results = [];
      }
      setFilteredResults(results);
      closeFilterModal();
    } catch (error) {
      console.error("Error al aplicar filtro:", error);
    } finally {
      setIsFiltering(false);
    }
  };

  const clearFilters = () => {
    setFilterParams({
      tipo: "carne",
      personalId: "",
      fechaInicio: "",
      fechaFin: ""
    });
    setFilteredResults([]);
    setIsFiltering(false);
  };

  const handleExportToExcel = async () => {
    try {
      await descargarExcel("mermas");
      Swal.fire({
        title: "¡Descargado!",
        text: "El archivo Excel ha sido descargado correctamente.",
        icon: "success",
        confirmButtonText: "OK"
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo descargar el archivo Excel.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  // Columnas para la tabla
  const columns = [
    { header: "ID", key: "id" },
    { header: "Fecha", key: "fechaRegistro" },
    { header: "Tipo", key: "tipoProductoMerma" },
    { header: "Producto/Item", key: "productoItem" }, // Campo virtual que se manejará con customFormat
    { header: "Cantidad", key: "cantidadPerdida" },
    { header: "Causa", key: "causa" },
    { header: "Personal", key: "personal" }
  ];

  const displayData = isFiltering ? filteredResults : mermas;

  return (
    <div className={styles["categoria-container"]}>
      {/* Los botones para Filtrar y Exportar los manejará el componente Table */}

      {loading ? (
        <p>Cargando mermas...</p>
      ) : (
        <Table
          data={displayData || []} // Asegurar que data nunca sea undefined
          columns={columns}
          headerTitle="Mermas"
          onCreate={openModal}
          onEdit={openEditModal}
          onDelete={handleDeleteModalOpen}
          showEditAllButton={false}
          showViewButton={false}
          showCalendarButton={true}
          showExcelButton={false}
          entidad="mermas"
          searchableFields={["id", "fechaRegistro", "tipoProductoMerma", "productoItem", "cantidadPerdida", "causa", "personal"]}
          customFormat={(value, key, row) => {
            // Validación para evitar errores si row es undefined
            if (!row) return String(value || 'N/A');
            
            if (key === "cantidadPerdida" && (typeof value === "number" || !isNaN(parseFloat(value)))) {
              // Determinar la unidad según el tipo de producto
              let unidad = "kg"; // Valor por defecto para carne
              
              if (row.tipoProductoMerma === "producto" && row.producto) {
                // Si el producto tiene tipoMedida, usarlo; si no, asumir unidades por defecto
                const tipoMedida = row.producto.tipoMedida || "unidades";
                unidad = tipoMedida === "kilos" ? "kg" : "unidades";
              } else if (row.tipoProductoMerma === "subproducto" && row.subproducto) {
                // Si el subproducto tiene tipoMedida, usarlo; si no, asumir unidades por defecto
                const tipoMedida = row.subproducto.tipoMedida || "unidades";
                unidad = tipoMedida === "kilos" ? "kg" : "unidades";
              }
              
              return `${parseFloat(value).toLocaleString('es-CL')} ${unidad}`;
            }
            if (key === "fechaRegistro") {
              return new Date(value).toLocaleDateString();
            }
            if (key === "personal") {
              if (value && typeof value === 'object') {
                const nombre = value.nombre || '';
                const apellido = value.apellido || '';
                return `${nombre} ${apellido}`.trim() || 'N/A';
              }
              return 'N/A';
            }
            if (key === "productoItem") {
              if (!row || !row.tipoProductoMerma) return 'N/A';
              
              if (row.tipoProductoMerma === "producto" && row.producto) {
                const nombreProducto = row.producto.nombre || 'Producto sin nombre';
                const variante = row.producto.variante ? ` - ${row.producto.variante}` : '';
                return `${nombreProducto}${variante}`;
              } else if (row.tipoProductoMerma === "subproducto" && row.subproducto) {
                // Para subproductos, mostrar el tipo específico del subproducto
                const tipoSubproducto = row.tipoSubproducto || 'Tipo no especificado';
                return tipoSubproducto;
              } else if (row.tipoProductoMerma === "carne" && row.animalCorte) {
                // Obtener nombre formateado para el tipo de corte de carne
                const formatearNombreCorte = (corte) => {
                  const nombres = {
                    abastero: "Abastero",
                    asadoTira: "Asado Tira",
                    asadoCarnicero: "Asado Carnicero",
                    asiento: "Asiento",
                    choclillo: "Choclillo",
                    cogote: "Cogote",
                    entraña: "Entraña",
                    filete: "Filete",
                    ganso: "Ganso",
                    huachalomo: "Huachalomo",
                    lomoLiso: "Lomo Liso",
                    lomoVetado: "Lomo Vetado",
                    palanca: "Palanca",
                    plateada: "Plateada",
                    polloBarriga: "Pollo Barriga",
                    polloGanso: "Pollo Ganso",
                    postaNegra: "Posta Negra",
                    postaPaleta: "Posta Paleta",
                    postaRosada: "Posta Rosada",
                    sobrebarriga: "Sobrebarriga",
                    tapaBarriga: "Tapa Barriga",
                    tapaPecho: "Tapa Pecho",
                    tapaPosta: "Tapa Posta"
                  };
                  return nombres[corte] || corte;
                };
                
                // Si hay un tipo de corte específico, mostrarlo
                if (row.tipoCorteCarne) {
                  return `${formatearNombreCorte(row.tipoCorteCarne)} (${row.animalCorte.nombreLista || 'Lista sin nombre'})`;
                }
                return row.animalCorte.nombreLista || 'Lista sin nombre';
              }
              return "N/A";
            }
            // Asegurar que siempre devolvemos un string
            return value != null ? String(value) : 'N/A';
          }}
        />
      )}

      {/* Modal para crear nueva merma */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Registrar Merma"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <form onSubmit={handleCreateMerma} className="modal-crear-formulario">
          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Registrar Nueva Merma</h2>
            <button type="button" onClick={closeModal} className="modal-crear-cerrar">×</button>
            <button type="submit" className="modal-boton-crear">Guardar</button>
          </div>
          {createError && <div className="error">{createError}</div>}
          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Tipo de Producto:</label>
            <div className="input-container">
              <select 
                name="tipoProductoMerma" 
                value={newMerma.tipoProductoMerma} 
                onChange={handleTipoChange} 
                required
                className="formulario-input"
              >
                <option value="carne">Carne</option>
                <option value="producto">Producto</option>
                <option value="subproducto">Subproducto</option>
              </select>
            </div>
          </div>

          {newMerma.tipoProductoMerma === "carne" && (
            <>
              <div className="formulario-grupo">
                <label className="formulario-etiqueta">Lista de Precios:</label>
                <div className="input-container">
                  <select 
                    name="animalCorte" 
                    value={newMerma.animalCorte ? newMerma.animalCorte.id : ""} 
                    onChange={(e) => handleSelectChange(e, "animalCorte")} 
                    required
                    className="formulario-input"
                  >
                    <option value="">Seleccione una lista de precios</option>
                    {animalCortes.map(corte => (
                      <option key={corte.id} value={corte.id}>{corte.nombreLista}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="formulario-grupo">
                <label className="formulario-etiqueta">Corte de Carne:</label>
                <div className="input-container">
                  <select 
                    name="tipoCorteCarne" 
                    value={newMerma.tipoCorteCarne} 
                    onChange={(e) => setNewMerma({...newMerma, tipoCorteCarne: e.target.value})} 
                    required
                    disabled={!newMerma.animalCorte}
                    className="formulario-input"
                  >
                    <option value="">Seleccione un corte de carne</option>
                    <option value="abastero">Abastero</option>
                    <option value="asadoTira">Asado Tira</option>
                    <option value="asadoCarnicero">Asado Carnicero</option>
                    <option value="asiento">Asiento</option>
                    <option value="choclillo">Choclillo</option>
                    <option value="cogote">Cogote</option>
                    <option value="entraña">Entraña</option>
                    <option value="filete">Filete</option>
                    <option value="ganso">Ganso</option>
                    <option value="huachalomo">Huachalomo</option>
                    <option value="lomoLiso">Lomo Liso</option>
                    <option value="lomoVetado">Lomo Vetado</option>
                    <option value="palanca">Palanca</option>
                    <option value="plateada">Plateada</option>
                    <option value="polloBarriga">Pollo Barriga</option>
                    <option value="polloGanso">Pollo Ganso</option>
                    <option value="postaNegra">Posta Negra</option>
                    <option value="postaPaleta">Posta Paleta</option>
                    <option value="postaRosada">Posta Rosada</option>
                    <option value="sobrebarriga">Sobrebarriga</option>
                    <option value="tapaBarriga">Tapa Barriga</option>
                    <option value="tapaPecho">Tapa Pecho</option>
                    <option value="tapaPosta">Tapa Posta</option>
                  </select>
                </div>
              </div>

              <div className="formulario-grupo">
                <label className="formulario-etiqueta">Vara de Animal (Opcional):</label>
                <div className="input-container">
                  <select 
                    name="animalVara" 
                    value={newMerma.animalVara ? newMerma.animalVara.id : ""} 
                    onChange={(e) => handleSelectChange(e, "animalVara")} 
                    disabled={!newMerma.animalCorte}
                    className="formulario-input"
                  >
                    <option value="">Seleccione una vara (opcional)</option>
                    {availableVaras.map(vara => (
                      <option key={vara.id} value={vara.id}>
                        Vara #{vara.id} - Fecha: {new Date(vara.fechaLlegada).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {newMerma.tipoProductoMerma === "producto" && (
            <>
              <div className="formulario-grupo">
                <label className="formulario-etiqueta">Producto:</label>
                <div className="input-container">
                  <select 
                    name="producto" 
                    value={newMerma.producto ? newMerma.producto.id : ""} 
                    onChange={(e) => handleSelectChange(e, "producto")} 
                    required
                    className="formulario-input"
                  >
                    <option value="">Seleccione un producto</option>
                    {productos.map(producto => (
                      <option key={producto.id} value={producto.id}>
                        {producto.nombre}{producto.variante ? ` - ${producto.variante}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="formulario-grupo">
                <label className="formulario-etiqueta">Recepción de Stock:</label>
                <div className="input-container">
                  <select 
                    name="recepcionStock" 
                    value={newMerma.recepcionStock ? newMerma.recepcionStock.id : ""} 
                    onChange={(e) => handleSelectChange(e, "recepcionStock")} 
                    required
                    disabled={!newMerma.producto}
                    className="formulario-input"
                  >
                    <option value="">Seleccione una recepción</option>
                    {availableRecepciones.map(recepcion => (
                      <option key={recepcion.id} value={recepcion.id}>
                        Recepción #{recepcion.id} - Fecha: {new Date(recepcion.fecha).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {newMerma.tipoProductoMerma === "subproducto" && (
            <>
              <div className="formulario-grupo">
                <label className="formulario-etiqueta">Subproducto:</label>
                <div className="input-container">
                  <select 
                    name="subproducto" 
                    value={newMerma.subproducto ? newMerma.subproducto.id : ""} 
                    onChange={(e) => handleSelectChange(e, "subproducto")} 
                    required
                    className="formulario-input"
                  >
                    <option value="">Seleccione un subproducto</option>
                    {subproductos.map(subproducto => (
                      <option key={subproducto.id} value={subproducto.id}>
                        Faena #{subproducto.id} - {new Date(subproducto.fechaFaena).toLocaleDateString()} 
                        ({subproducto.numeroAnimalesFaenados} animales)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="formulario-grupo">
                <label className="formulario-etiqueta">Tipo de Subproducto:</label>
                <div className="input-container">
                  <select 
                    name="tipoSubproducto" 
                    value={newMerma.tipoSubproducto} 
                    onChange={handleInputChange} 
                    required
                    disabled={!newMerma.subproducto}
                    className="formulario-input"
                  >
                    <option value="">Seleccione el tipo</option>
                    <option value="Guata">Guata</option>
                    <option value="Corazón">Corazón</option>
                    <option value="Cabezas">Cabezas</option>
                    <option value="Lenguas">Lenguas</option>
                    <option value="Chunchul">Chunchul</option>
                    <option value="Hígado">Hígado</option>
                    <option value="Riñón">Riñón</option>
                    <option value="Patas">Patas</option>
                    <option value="Charcha">Charcha</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="formulario-grupo">
            <label className="formulario-etiqueta">{getCantidadLabel(newMerma)}</label>
            <div className="input-container">
              <input
                type="number"
                step="0.01"
                min="0"
                name="cantidadPerdida"
                value={newMerma.cantidadPerdida}
                onChange={handleInputChange}
                placeholder={getCantidadPlaceholder(newMerma)}
                required
                className="formulario-input"
              />
            </div>
          </div>

          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Causa:</label>
            <div className="input-container">
              <input
                type="text"
                name="causa"
                value={newMerma.causa}
                onChange={handleInputChange}
                required
                maxLength={255}
                className="formulario-input"
              />
            </div>
          </div>

          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Detalles (Opcional):</label>
            <div className="input-container">
              <textarea
                name="detalles"
                value={newMerma.detalles || ""}
                onChange={handleInputChange}
                rows={3}
                className="formulario-input"
              />
            </div>
          </div>

          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Personal:</label>
            <div className="input-container">
              <select 
                name="personal" 
                value={newMerma.personal ? newMerma.personal.id : ""} 
                onChange={(e) => handleSelectChange(e, "personal")} 
                required
                className="formulario-input"
              >
                <option value="">Seleccione un personal</option>
                {personal.map(persona => (
                  <option key={persona.id} value={persona.id}>{persona.nombre} {persona.apellido}</option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal para editar merma */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Editar Merma"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        {currentMerma && (
          <form onSubmit={handleUpdateMerma} className="modal-crear-formulario">
            <div className="modal-crear-header">
              <h2 className="modal-crear-titulo">Editar Merma</h2>
              <button type="button" onClick={closeEditModal} className="modal-crear-cerrar">×</button>
              <button type="submit" className="modal-boton-crear">Guardar Cambios</button>
            </div>
            {editError && <div className="error">{editError}</div>}
            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Tipo de Producto:</label>
              <div className="input-container">
                <select 
                  name="tipoProductoMerma" 
                  value={currentMerma.tipoProductoMerma} 
                  onChange={handleEditTipoChange} 
                  required
                  className="formulario-input"
                >
                  <option value="carne">Carne</option>
                  <option value="producto">Producto</option>
                  <option value="subproducto">Subproducto</option>
                </select>
              </div>
            </div>

            {currentMerma.tipoProductoMerma === "carne" && (
              <>
                <div className="formulario-grupo">
                  <label className="formulario-etiqueta">Lista de Precios:</label>
                  <div className="input-container">
                    <select 
                      name="animalCorte" 
                      value={currentMerma.animalCorte ? currentMerma.animalCorte.id : ""} 
                      onChange={(e) => handleEditSelectChange(e, "animalCorte")} 
                      required
                      className="formulario-input"
                    >
                      <option value="">Seleccione una lista de precios</option>
                      {animalCortes.map(corte => (
                        <option key={corte.id} value={corte.id}>{corte.nombreLista}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="formulario-grupo">
                  <label className="formulario-etiqueta">Corte de Carne:</label>
                  <div className="input-container">
                    <select 
                      name="tipoCorteCarne" 
                      value={currentMerma.tipoCorteCarne || ""} 
                      onChange={(e) => setCurrentMerma({...currentMerma, tipoCorteCarne: e.target.value})} 
                      required
                      disabled={!currentMerma.animalCorte}
                      className="formulario-input"
                    >
                      <option value="">Seleccione un corte de carne</option>
                      <option value="abastero">Abastero</option>
                      <option value="asadoTira">Asado Tira</option>
                      <option value="asadoCarnicero">Asado Carnicero</option>
                      <option value="asiento">Asiento</option>
                      <option value="choclillo">Choclillo</option>
                      <option value="cogote">Cogote</option>
                      <option value="entraña">Entraña</option>
                      <option value="filete">Filete</option>
                      <option value="ganso">Ganso</option>
                      <option value="huachalomo">Huachalomo</option>
                      <option value="lomoLiso">Lomo Liso</option>
                      <option value="lomoVetado">Lomo Vetado</option>
                      <option value="palanca">Palanca</option>
                      <option value="plateada">Plateada</option>
                      <option value="polloBarriga">Pollo Barriga</option>
                      <option value="polloGanso">Pollo Ganso</option>
                      <option value="postaNegra">Posta Negra</option>
                      <option value="postaPaleta">Posta Paleta</option>
                      <option value="postaRosada">Posta Rosada</option>
                      <option value="sobrebarriga">Sobrebarriga</option>
                      <option value="tapaBarriga">Tapa Barriga</option>
                      <option value="tapaPecho">Tapa Pecho</option>
                      <option value="tapaPosta">Tapa Posta</option>
                    </select>
                  </div>
                </div>

                <div className="formulario-grupo">
                  <label className="formulario-etiqueta">Vara de Animal (Opcional):</label>
                  <div className="input-container">
                    <select 
                      name="animalVara" 
                      value={currentMerma.animalVara ? currentMerma.animalVara.id : ""} 
                      onChange={(e) => handleEditSelectChange(e, "animalVara")} 
                      disabled={!currentMerma.animalCorte}
                      className="formulario-input"
                    >
                      <option value="">Seleccione una vara (opcional)</option>
                      {animalVaras
                        .filter(vara => !currentMerma.animalCorte || (vara.tipoAnimal && vara.tipoAnimal.id === currentMerma.animalCorte.id))
                        .map(vara => (
                          <option key={vara.id} value={vara.id}>
                            Vara #{vara.id} - Fecha: {new Date(vara.fechaLlegada).toLocaleDateString()}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {currentMerma.tipoProductoMerma === "producto" && (
              <>
                <div className="formulario-grupo">
                  <label className="formulario-etiqueta">Producto:</label>
                  <div className="input-container">
                    <select 
                      name="producto" 
                      value={currentMerma.producto ? currentMerma.producto.id : ""} 
                      onChange={(e) => handleEditSelectChange(e, "producto")} 
                      required
                      className="formulario-input"
                    >
                      <option value="">Seleccione un producto</option>
                      {productos.map(producto => (
                        <option key={producto.id} value={producto.id}>
                          {producto.nombre}{producto.variante ? ` - ${producto.variante}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="formulario-grupo">
                  <label className="formulario-etiqueta">Recepción de Stock:</label>
                  <div className="input-container">
                    <select 
                      name="recepcionStock" 
                      value={currentMerma.recepcionStock ? currentMerma.recepcionStock.id : ""} 
                      onChange={(e) => handleEditSelectChange(e, "recepcionStock")} 
                      required
                      disabled={!currentMerma.producto}
                      className="formulario-input"
                    >
                      <option value="">Seleccione una recepción</option>
                      {recepcionesStock
                        .filter(recepcion => !currentMerma.producto || (recepcion.producto && recepcion.producto.id === currentMerma.producto.id))
                        .map(recepcion => (
                          <option key={recepcion.id} value={recepcion.id}>
                            Recepción #{recepcion.id} - Fecha: {new Date(recepcion.fecha).toLocaleDateString()}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {currentMerma.tipoProductoMerma === "subproducto" && (
              <>
                <div className="formulario-grupo">
                  <label className="formulario-etiqueta">Subproducto:</label>
                  <div className="input-container">
                    <select 
                      name="subproducto" 
                      value={currentMerma.subproducto ? currentMerma.subproducto.id : ""} 
                      onChange={(e) => handleEditSelectChange(e, "subproducto")} 
                      required
                      className="formulario-input"
                    >
                      <option value="">Seleccione un subproducto</option>
                      {subproductos.map(subproducto => (
                        <option key={subproducto.id} value={subproducto.id}>
                          Faena #{subproducto.id} - {new Date(subproducto.fechaFaena).toLocaleDateString()} 
                          ({subproducto.numeroAnimalesFaenados} animales)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="formulario-grupo">
                  <label className="formulario-etiqueta">Tipo de Subproducto:</label>
                  <div className="input-container">
                    <select 
                      name="tipoSubproducto" 
                      value={currentMerma.tipoSubproducto || ""} 
                      onChange={handleEditChange} 
                      required
                      disabled={!currentMerma.subproducto}
                      className="formulario-input"
                    >
                      <option value="">Seleccione el tipo</option>
                      <option value="Guata">Guata</option>
                      <option value="Corazón">Corazón</option>
                      <option value="Cabezas">Cabezas</option>
                      <option value="Lenguas">Lenguas</option>
                      <option value="Chunchul">Chunchul</option>
                      <option value="Hígado">Hígado</option>
                      <option value="Riñón">Riñón</option>
                      <option value="Patas">Patas</option>
                      <option value="Charcha">Charcha</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="formulario-grupo">
              <label className="formulario-etiqueta">{getCantidadLabel(currentMerma)}</label>
              <div className="input-container">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="cantidadPerdida"
                  value={currentMerma.cantidadPerdida}
                  onChange={handleEditChange}
                  placeholder={getCantidadPlaceholder(currentMerma)}
                  required
                  className="formulario-input"
                />
              </div>
            </div>

            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Causa:</label>
              <div className="input-container">
                <input
                  type="text"
                  name="causa"
                  value={currentMerma.causa}
                  onChange={handleEditChange}
                  required
                  maxLength={255}
                  className="formulario-input"
                />
              </div>
            </div>

            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Detalles (Opcional):</label>
              <div className="input-container">
                <textarea
                  name="detalles"
                  value={currentMerma.detalles || ""}
                  onChange={handleEditChange}
                  rows={3}
                  className="formulario-input"
                />
              </div>
            </div>

            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Personal:</label>
              <div className="input-container">
                <select 
                  name="personal" 
                  value={currentMerma.personal ? currentMerma.personal.id : ""} 
                  onChange={(e) => handleEditSelectChange(e, "personal")} 
                  required
                  className="formulario-input"
                >
                  <option value="">Seleccione un personal</option>
                  {personal.map(persona => (
                    <option key={persona.id} value={persona.id}>{persona.nombre} {persona.apellido}</option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal para confirmar eliminación */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleDeleteModalClose}
        contentLabel="Confirmar Eliminación"
        ariaHideApp={false}
        className="modal-confirmar"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <div className="modal-confirmar-contenido">
          <h2>Confirmar Eliminación</h2>
          <p>¿Está seguro de que desea eliminar esta merma?</p>
          <div className="modal-confirmar-botones">
            <button 
              onClick={handleDeleteModalClose}
              className="boton-cancelar"
            >
              Cancelar
            </button>
            <button 
              onClick={confirmDelete}
              className="boton-eliminar"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal para filtros */}
      <Modal
        isOpen={isFilterModalOpen}
        onRequestClose={closeFilterModal}
        contentLabel="Filtrar Mermas"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <div className="modal-crear-formulario">
          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Filtrar Mermas</h2>
            <button type="button" onClick={closeFilterModal} className="modal-crear-cerrar">×</button>
          </div>
          
          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Filtrar por:</label>
            <div className="input-container">
              <select 
                value={selectedFilterType} 
                onChange={handleFilterTypeChange}
                className="formulario-input"
              >
                <option value="tipo">Tipo de Producto</option>
                <option value="fecha">Rango de Fechas</option>
                <option value="personal">Personal</option>
              </select>
            </div>
          </div>

          {selectedFilterType === "tipo" && (
            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Tipo de Producto:</label>
              <div className="input-container">
                <select 
                  name="tipo" 
                  value={filterParams.tipo} 
                  onChange={handleFilterParamChange}
                  className="formulario-input"
                >
                  <option value="carne">Carne</option>
                  <option value="producto">Producto</option>
                  <option value="subproducto">Subproducto</option>
                </select>
              </div>
            </div>
          )}

          {selectedFilterType === "fecha" && (
            <>
              <div className="formulario-grupo">
                <label className="formulario-etiqueta">Fecha Inicio:</label>
                <div className="input-container">
                  <input 
                    type="date" 
                    name="fechaInicio" 
                    value={filterParams.fechaInicio} 
                    onChange={handleFilterParamChange}
                    className="formulario-input" 
                    required 
                  />
                </div>
              </div>
              <div className="formulario-grupo">
                <label className="formulario-etiqueta">Fecha Fin:</label>
                <div className="input-container">
                  <input 
                    type="date" 
                    name="fechaFin" 
                    value={filterParams.fechaFin} 
                    onChange={handleFilterParamChange}
                    className="formulario-input" 
                    required 
                  />
                </div>
              </div>
            </>
          )}

          {selectedFilterType === "personal" && (
            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Personal:</label>
              <div className="input-container">
                <select 
                  name="personalId" 
                  value={filterParams.personalId} 
                  onChange={handleFilterParamChange} 
                  className="formulario-input"
                  required
                >
                  <option value="">Seleccione un personal</option>
                  {personal.map(persona => (
                    <option key={persona.id} value={persona.id}>{persona.nombre} {persona.apellido}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="modal-boton-crear" onClick={applyFilter}>Aplicar Filtro</button>
            <button type="button" className="btn-cancelar" onClick={closeFilterModal}>Cancelar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Mermas;

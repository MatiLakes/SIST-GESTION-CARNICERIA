import React, { useState, useEffect, useCallback } from "react";
import useGetProductos from "@hooks/productos/useGetProductos.jsx";
import useCreateProducto from "@hooks/productos/useCreateProducto.jsx";
import useDeleteProducto from "@hooks/productos/useDeleteProducto.jsx";
import useEditProducto from "@hooks/productos/useEditProducto.jsx";
import useGetMarcas from "@hooks/productos/useGetMarcas.jsx";
import useGetTipos from "@hooks/productos/useGetTipos.jsx";
import useCreateMarca from "@hooks/productos/useCreateMarca.jsx";
import useCreateTipo from "@hooks/productos/useCreateTipo.jsx";
import { useDeleteTipo } from "@hooks/productos/useDeleteTipo.jsx";
import useEditTipo from "@hooks/productos/useEditTipo.jsx";
import { useDeleteMarca } from "@hooks/productos/useDeleteMarca.jsx";
import useEditMarca from "@hooks/productos/useEditMarca.jsx";
import { useErrorHandlerProducto } from "@hooks/productos/useErrorHandlerProducto.jsx";
import Table from "../components/Table";
import Modal from "react-modal";
import styles from "@styles/categoria.module.css";
import "@styles/formulariotable.css";
import "@styles/modalDetalles.css";
import "@styles/modalCrear.css";
import Swal from "sweetalert2";

const Productos = () => {
  const { productos, loading, fetchProductos } = useGetProductos();
  const { marcas, fetchMarcas } = useGetMarcas();
  const { tipos, fetchTipos } = useGetTipos();
  const { create: createProducto } = useCreateProducto(fetchProductos);
  const { remove } = useDeleteProducto(fetchProductos);
  const { edit } = useEditProducto(fetchProductos);
  const { create: createMarca } = useCreateMarca(fetchMarcas);
  const { create: createTipo } = useCreateTipo(fetchTipos);
  const { handleDelete: deleteTipo } = useDeleteTipo(fetchTipos);
  const { edit: editTipo } = useEditTipo(fetchTipos);
  const { handleDelete: deleteMarca } = useDeleteMarca(fetchMarcas);
  const { edit: editMarca } = useEditMarca(fetchMarcas);
  const { 
    createError, 
    editError, 
    createTipoError, 
    editTipoError, 
    createMarcaError, 
    editMarcaError,
    handleCreateError, 
    handleEditError,
    handleCreateTipoError,
    handleEditTipoError,
    handleCreateMarcaError,
    handleEditMarcaError
  } = useErrorHandlerProducto();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProducto, setCurrentProducto] = useState(null);
  const [isModalMarcaOpen, setIsModalMarcaOpen] = useState(false);
  const [isModalTipoOpen, setIsModalTipoOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState(null);
  const [isGestionTipoOpen, setIsGestionTipoOpen] = useState(false);
  const [isGestionMarcaOpen, setIsGestionMarcaOpen] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [selectedMarca, setSelectedMarca] = useState(null);
  const [isEditTipoMode, setIsEditTipoMode] = useState(false);  const [isEditMarcaMode, setIsEditMarcaMode] = useState(false);
  const [searchTipo, setSearchTipo] = useState("");
  const [searchMarca, setSearchMarca] = useState("");

  const stableFetchMarcas = useCallback(fetchMarcas, []);
  const stableFetchTipos = useCallback(fetchTipos, []);

  useEffect(() => {
    stableFetchMarcas();
    stableFetchTipos();
  }, [stableFetchMarcas, stableFetchTipos]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openEditModal = (producto) => {
    setCurrentProducto(producto);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  const openModalMarca = () => setIsModalMarcaOpen(true);
  const closeModalMarca = () => setIsModalMarcaOpen(false);

  const openModalTipo = () => setIsModalTipoOpen(true);
  const closeModalTipo = () => setIsModalTipoOpen(false);

  const handleDeleteModalOpen = (producto) => {
    setProductoToDelete(producto);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setProductoToDelete(null);
  };

  const confirmDelete = async () => {
    if (productoToDelete) {
      try {
        await remove(productoToDelete.id);
        handleDeleteModalClose();
        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "El producto ha sido eliminado correctamente.",
          confirmButtonColor: "#000000"
        });
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el producto.",
          confirmButtonColor: "#000000"
        });
      }
    }
  };  const handleCreateProducto = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const precioVenta = parseFloat(formData.get("precioVenta"));
    
    const tipoId = parseInt(formData.get("tipo"), 10);
    const marcaId = parseInt(formData.get("marca"), 10);
  
    const newProducto = {
      nombre: formData.get("nombre"),
      variante: formData.get("variante"),
      precioVenta,
      fechaVencimiento: formData.get("fechaVencimiento"),
      tipo: { id: tipoId },
      marca: { id: marcaId },
    };

    // Usar el hook de validación de errores
    const hasErrors = handleCreateError(newProducto, productos, tipos, marcas);
    
    if (!hasErrors) {
      try {
        // Enviar directamente el producto con objetos tipo y marca
        await createProducto(newProducto);
        closeModal();
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Producto creado correctamente.",
          confirmButtonColor: "#000000"
        });
      } catch (error) {
        console.error("Error al crear el producto:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo crear el producto.",
          confirmButtonColor: "#000000"
        });
      }
    }
  };  const handleEditProducto = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const tipoId = parseInt(formData.get("tipo"), 10);
    const marcaId = parseInt(formData.get("marca"), 10);

    const updatedProducto = {
      nombre: formData.get("nombre"),
      variante: formData.get("variante"),
      precioVenta: parseFloat(formData.get("precioVenta")),
      fechaVencimiento: formData.get("fechaVencimiento"),
      tipo: { id: tipoId },
      marca: { id: marcaId },
    };

    // Usar el hook de validación de errores
    const hasErrors = handleEditError(updatedProducto, productos, tipos, marcas, currentProducto.id);
    
    if (!hasErrors) {
      try {
        // Enviar directamente el producto con objetos tipo y marca
        await edit(currentProducto.id, updatedProducto);
        closeEditModal();
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Producto actualizado correctamente.",
          confirmButtonColor: "#000000"
        });
      } catch (error) {
        console.error("Error al editar producto:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar el producto.",
          confirmButtonColor: "#000000"
        });
      }
    }
  };

  const openGestionTipo = () => setIsGestionTipoOpen(true);
  const closeGestionTipo = () => {
    setIsGestionTipoOpen(false);
    setSelectedTipo(null);
    setIsEditTipoMode(false);
  };

  const openGestionMarca = () => setIsGestionMarcaOpen(true);
  const closeGestionMarca = () => {
    setIsGestionMarcaOpen(false);
    setSelectedMarca(null);
    setIsEditMarcaMode(false);
  };

  const handleTipoSelect = (tipo) => {
    setSelectedTipo(tipo);
  };

  const handleMarcaSelect = (marca) => {
    setSelectedMarca(marca);
  };  const handleEditMarca = async (e) => {
    e.preventDefault();
    const marcaNombre = e.target.marcaNombre.value;

    // Usar el hook de validación de errores
    const hasErrors = handleEditMarcaError({ nombre: marcaNombre }, marcas, selectedMarca?.id);
    
    if (!hasErrors) {
      try {
        await editMarca(selectedMarca.id, { nombre: marcaNombre });
        setIsEditMarcaMode(false);
        setSelectedMarca(null);
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Marca actualizada correctamente.",
          confirmButtonColor: "#000000"
        });
      } catch (error) {
        console.error("Error al editar marca:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar la marca.",
          confirmButtonColor: "#000000"
        });
      }
    }
  };

  const handleDeleteMarca = async () => {
    try {
      await deleteMarca(selectedMarca.id);
      setSelectedMarca(null);
      setIsEditMarcaMode(false);
    } catch (error) {
      console.error("Error al eliminar marca:", error);
    }
  };  const handleEditTipo = async (e) => {
    e.preventDefault();
    const tipoNombre = e.target.tipoNombre.value;

    // Usar el hook de validación de errores
    const hasErrors = handleEditTipoError({ nombre: tipoNombre }, tipos, selectedTipo?.id);
    
    if (!hasErrors) {
      try {
        await editTipo(selectedTipo.id, { nombre: tipoNombre });
        setIsEditTipoMode(false);
        setSelectedTipo(null);
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Tipo actualizado correctamente.",
          confirmButtonColor: "#000000"
        });
      } catch (error) {
        console.error("Error al editar tipo:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar el tipo.",
          confirmButtonColor: "#000000"
        });
      }
    }
  };

  const handleDeleteTipo = async () => {
    try {
      await deleteTipo(selectedTipo.id);
      setSelectedTipo(null);
      setIsEditTipoMode(false);
    } catch (error) {
      console.error("Error al eliminar tipo:", error);
    }
  };

  if (loading) return <p>Cargando productos...</p>;

  console.log("Lista de productos:", productos);
  const columns = [
    { header: "Nombre", key: "nombre" },
    { header: "Variante", key: "variante" },
    { header: "Precio Venta", key: "precioVenta" },
    { header: "Fecha Vencimiento", key: "fechaVencimiento" },
    { header: "Tipo", key: "tipo" },
    { header: "Marca", key: "marca" }
  ];

  return (
    <div className={styles["categoria-container"]}>
      <Table
        data={productos}
        columns={columns}
        headerTitle="Productos"
        onCreate={openModal}
        onEdit={openEditModal}
        onDelete={handleDeleteModalOpen}
        showEditAllButton={false}
        showViewButton={false}
        showCalendarButton={true}
        entidad="productos"
        customFormat={(value, key) => {
          if (key === "precioVenta" && (typeof value === "number" || !isNaN(parseFloat(value)))) {
            return `$${parseFloat(value).toLocaleString('es-CL')}`;
          }
          if (key === "tipo" || key === "marca") {
            return value?.nombre || '';
          }
          return value?.nombreLista ? value.nombreLista : value;
        }}
      />
      
      {/* Modal de Creación */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Crear Producto"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <form onSubmit={handleCreateProducto} className="modal-crear-formulario">
          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Crear Nuevo Producto</h2>
            <button type="button" onClick={closeModal} className="modal-crear-cerrar">×</button>
            <button type="submit" className="modal-boton-crear">Guardar</button>
          </div>          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Nombre del Producto:</label>
            <div className="input-container">
              <input
                type="text"
                id="nombre"
                name="nombre"
                required
                className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'nombre') ? 'input-error' : ''}`}
              />
              {createError && createError.errors?.map((error, index) => (
                error.field === 'nombre' && (
                  <div key={index} className="error-message">
                    {error.message}
                  </div>
                )
              ))}
            </div>
          </div>
          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Variante:</label>
            <div className="input-container">
              <input
                type="text"
                id="variante"
                name="variante"
                className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'variante') ? 'input-error' : ''}`}
              />
              {createError && createError.errors?.map((error, index) => (
                error.field === 'variante' && (
                  <div key={index} className="error-message">
                    {error.message}
                  </div>
                )
              ))}
            </div>
          </div>
          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Precio Venta:</label>
            <div className="input-container">
              <input
                type="number"
                id="precioVenta"
                name="precioVenta"
                required
                className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'precioVenta') ? 'input-error' : ''}`}
              />
              {createError && createError.errors?.map((error, index) => (
                error.field === 'precioVenta' && (
                  <div key={index} className="error-message">
                    {error.message}
                  </div>
                )
              ))}
            </div>
          </div>          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Fecha de Vencimiento:</label>
            <div className="input-container">
              <input
                type="date"
                id="fechaVencimiento"
                name="fechaVencimiento"
                className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'fechaVencimiento') ? 'input-error' : ''}`}
              />
              {createError && createError.errors?.map((error, index) => (
                error.field === 'fechaVencimiento' && (
                  <div key={index} className="error-message">
                    {error.message}
                  </div>
                )
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', width: '100%', margin: '0 auto', maxWidth: '800px' }}>                <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
              <div className="subproducto-nombre-grupo">
                <span className="subproducto-nombre">Tipo</span>
              </div>
              <div className="subproducto-inputs-grupo">                <div className="input-grupo" style={{ width: '100%' }}>                  
                  <select
                    id="tipo"
                    name="tipo"
                    required
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'tipo') ? 'input-error' : ''}`}
                    style={{ minWidth: '180px' }}
                  >
                    <option value="">Seleccione un Tipo</option>
                    {[...tipos].sort((a, b) => a.nombre.localeCompare(b.nombre)).map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'tipo' && (
                      <div key={index} className="error-message">
                        {error.message}
                      </div>
                    )
                  ))}
                </div>
                <div className="input-grupo" style={{ display: 'flex', gap: '8px' }}>                  <button
                    type="button"
                    className="modal-boton-anadir"
                    onClick={openModalTipo}
                  >
                    Añadir
                  </button>
                </div>
              </div>
            </div>
            
            <div className="subproducto-fila" style={{ flex: 1, minWidth: '332.3px' }}>
              <div className="subproducto-nombre-grupo">
                <span className="subproducto-nombre">Marca</span>
              </div>
              <div className="subproducto-inputs-grupo">                <div className="input-grupo" style={{ width: '100%' }}>                  
                  <select
                    id="marca"
                    name="marca"
                    required
                    className={`formulario-input ${createError && createError.errors?.some(error => error.field === 'marca') ? 'input-error' : ''}`}
                    style={{ minWidth: '180px' }}
                  >
                    <option value="">Seleccione una Marca</option>
                    {[...marcas].sort((a, b) => a.nombre.localeCompare(b.nombre)).map((marca) => (
                      <option key={marca.id} value={marca.id}>
                        {marca.nombre}
                      </option>
                    ))}
                  </select>
                  {createError && createError.errors?.map((error, index) => (
                    error.field === 'marca' && (
                      <div key={index} className="error-message">
                        {error.message}
                      </div>
                    )
                  ))}
                </div>
                <div className="input-grupo">
                  <button
                    type="button"
                    className="modal-boton-anadir"
                    onClick={openModalMarca}
                  >
                    Añadir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>      {/* Modal de Edición */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Editar Producto"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        {currentProducto && (
          <form onSubmit={handleEditProducto} className="modal-crear-formulario">
            <div className="modal-crear-header">
              <h2 className="modal-crear-titulo">Editar Producto</h2>
              <button type="button" onClick={closeEditModal} className="modal-crear-cerrar">×</button>
              <button type="submit" className="modal-boton-crear">Guardar</button>
            </div>            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Nombre del Producto:</label>
              <div className="input-container">
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  defaultValue={currentProducto.nombre}
                  required
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'nombre') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'nombre' && (
                    <div key={index} className="error-message">
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Variante:</label>
              <div className="input-container">
                <input
                  type="text"
                  id="variante"
                  name="variante"
                  defaultValue={currentProducto.variante}
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'variante') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'variante' && (
                    <div key={index} className="error-message">
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Precio Venta:</label>
              <div className="input-container">
                <input
                  type="number"
                  id="precioVenta"
                  name="precioVenta"
                  defaultValue={currentProducto.precioVenta}
                  required
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'precioVenta') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'precioVenta' && (
                    <div key={index} className="error-message">
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Fecha de Vencimiento:</label>
              <div className="input-container">
                <input
                  type="date"
                  id="fechaVencimiento"
                  name="fechaVencimiento"
                  defaultValue={currentProducto.fechaVencimiento || ""}
                  className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'fechaVencimiento') ? 'input-error' : ''}`}
                />
                {editError && editError.errors?.map((error, index) => (
                  error.field === 'fechaVencimiento' && (
                    <div key={index} className="error-message">
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', width: '100%', margin: '0 auto', maxWidth: '800px' }}>
              <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                <div className="subproducto-nombre-grupo">
                  <span className="subproducto-nombre">Tipo</span>
                </div>
                <div className="subproducto-inputs-grupo">                  <div className="input-grupo" style={{ width: '100%' }}>
                    <select
                      id="tipo"
                      name="tipo"
                      defaultValue={currentProducto.tipo.id}
                      required
                      className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'tipo') ? 'input-error' : ''}`}
                      style={{ minWidth: '220px' }}
                    >
                      {[...tipos].sort((a, b) => a.nombre.localeCompare(b.nombre)).map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.nombre}
                        </option>
                      ))}
                    </select>
                    {editError && editError.errors?.map((error, index) => (
                      error.field === 'tipo' && (
                        <div key={index} className="error-message">
                          {error.message}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                <div className="subproducto-nombre-grupo">
                  <span className="subproducto-nombre">Marca</span>
                </div>
                <div className="subproducto-inputs-grupo">                  <div className="input-grupo" style={{ width: '100%' }}>
                    <select
                      id="marca"
                      name="marca"
                      defaultValue={currentProducto.marca.id}
                      required
                      className={`formulario-input ${editError && editError.errors?.some(error => error.field === 'marca') ? 'input-error' : ''}`}
                      style={{ minWidth: '220px' }}
                    >
                      {[...marcas].sort((a, b) => a.nombre.localeCompare(b.nombre)).map((marca) => (
                        <option key={marca.id} value={marca.id}>
                          {marca.nombre}
                        </option>
                      ))}
                    </select>
                    {editError && editError.errors?.map((error, index) => (
                      error.field === 'marca' && (
                        <div key={index} className="error-message">
                          {error.message}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </Modal>      {/* Modal de Eliminación */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleDeleteModalClose}
        contentLabel="Confirmar Eliminación"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
        style={{ content: { maxWidth: '400px' } }}
      >
        <h2 className="formulario-table-modal-title">Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar este producto?</p>
        {productoToDelete && (
          <div style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <p><strong>Nombre:</strong> {productoToDelete.nombre}</p>
            <p><strong>Tipo:</strong> {productoToDelete.tipo.nombre}</p>
            <p><strong>Marca:</strong> {productoToDelete.marca.nombre}</p>
            <p><strong>Precio de Venta:</strong> ${productoToDelete.precioVenta?.toLocaleString('es-CL')}</p>
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
      </Modal>{/* Modal para crear tipo */}      <Modal
        isOpen={isModalTipoOpen}
        onRequestClose={closeModalTipo}
        contentLabel="Crear Tipo"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}      >        
        <div className="modal-crear-formulario">           <form
            onSubmit={async (e) => {
              e.preventDefault();
              const tipoNombre = e.target.tipoNombre.value;

              // Usar el hook de validación de errores
              const hasErrors = handleCreateTipoError({ nombre: tipoNombre }, tipos);
              
              if (!hasErrors) {
                try {
                  await createTipo({ nombre: tipoNombre });
                  e.target.reset();
                  closeModalTipo();
                  Swal.fire({
                    icon: "success",
                    title: "¡Éxito!",
                    text: "Tipo creado correctamente.",
                    confirmButtonColor: "#000000"
                  });
                  fetchTipos();
                } catch (error) {
                  console.error("Error al crear tipo:", error);
                  Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo crear el tipo.",
                    confirmButtonColor: "#000000"
                  });
                }
              }
            }}
          >            <div className="modal-crear-header">
              <h2 className="modal-crear-titulo">Crear Nuevo Tipo</h2>
              <button type="button" onClick={closeModalTipo} className="modal-crear-cerrar">×</button>
              <button type="submit" className="modal-boton-crear">Crear</button>
            </div>            <div className="formulario-grupo" style={{ marginTop: '20px' }}>
              <label className="formulario-etiqueta">Nombre del Tipo:</label>              <div className="input-container">
                <input
                  type="text"
                  id="tipoNombre"
                  name="tipoNombre"
                  required
                  className={`formulario-input ${createTipoError && createTipoError.errors?.some(error => error.field === 'nombre') ? 'input-error' : ''}`}
                />
                {createTipoError && createTipoError.errors?.map((error, index) => (
                  error.field === 'nombre' && (
                    <div key={index} className="error-message">
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </form>          <div className="gestion-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="gestion-titulo">Gestionar Tipos Existentes</h3>
              <div className="search-container" style={{ display: 'flex', alignItems: 'center' }}>                <input
                  type="text"
                  placeholder="Buscar tipo..."
                  value={searchTipo}
                  onChange={(e) => setSearchTipo(e.target.value)}
                  className="search-input"
                  style={{ marginLeft: '10px' }}
                />
              </div>
            </div>            <div className="gestion-lista">
              {tipos
                .filter(tipo => 
                  tipo.nombre.toLowerCase().includes(searchTipo.toLowerCase())
                )
                .sort((a, b) => a.nombre.localeCompare(b.nombre))
                .map((tipo) => (
                <div
                  key={tipo.id}
                  className={`gestion-item ${selectedTipo?.id === tipo.id ? 'selected' : ''}`}
                  onClick={() => handleTipoSelect(tipo)}
                >
                  <span>{tipo.nombre}</span>
                  {selectedTipo?.id === tipo.id && (
                    <div className="gestion-actions">
                      <button
                        className="btn-editar"
                        onClick={() => setIsEditTipoMode(true)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={handleDeleteTipo}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Modal para editar tipo */}
            <Modal
              isOpen={isEditTipoMode}
              onRequestClose={() => setIsEditTipoMode(false)}
              contentLabel="Editar Tipo"
              className="modal-crear"
              overlayClassName="modal-overlay"
              closeTimeoutMS={300}
            >
              <div className="modal-crear-formulario">
                <form onSubmit={handleEditTipo}>
                  <div className="modal-crear-header">
                    <h2 className="modal-crear-titulo">Editar Tipo</h2>
                    <button type="button" onClick={() => setIsEditTipoMode(false)} className="modal-crear-cerrar">×</button>
                    <button type="submit" className="modal-boton-crear">Guardar</button>
                  </div>                  <div className="formulario-grupo" style={{ marginTop: '20px' }}>
                    <label className="formulario-etiqueta">Editar Nombre:</label>                    <div className="input-container">
                      <input
                        type="text"
                        name="tipoNombre"
                        defaultValue={selectedTipo?.nombre}
                        className={`formulario-input ${editTipoError && editTipoError.errors?.some(error => error.field === 'nombre') ? 'input-error' : ''}`}
                        required
                      />
                      {editTipoError && editTipoError.errors?.map((error, index) => (
                        error.field === 'nombre' && (
                          <div key={index} className="error-message">
                            {error.message}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </Modal>
          </div>
        </div>
      </Modal>{/* Modal para crear marca */}      <Modal
        isOpen={isModalMarcaOpen}
        onRequestClose={closeModalMarca}
        contentLabel="Crear Marca"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >        <div className="modal-crear-formulario">          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const marcaNombre = e.target.marcaNombre.value;

              // Usar el hook de validación de errores
              const hasErrors = handleCreateMarcaError({ nombre: marcaNombre }, marcas);
              
              if (!hasErrors) {
                try {
                  await createMarca({ nombre: marcaNombre });
                  e.target.reset();
                  closeModalMarca();
                  Swal.fire({
                    icon: "success",
                    title: "¡Éxito!",
                    text: "Marca creada correctamente.",
                    confirmButtonColor: "#000000"
                  });
                  fetchMarcas();
                } catch (error) {
                  console.error("Error al crear marca:", error);
                  Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo crear la marca.",
                    confirmButtonColor: "#000000"
                  });
                }
              }
            }}
          >            <div className="modal-crear-header">
              <h2 className="modal-crear-titulo">Crear Nueva Marca</h2>
              <button type="button" onClick={closeModalMarca} className="modal-crear-cerrar">×</button>
              <button type="submit" className="modal-boton-crear">Crear</button>
            </div>
              <div className="formulario-grupo" style={{ marginTop: '20px' }}>
              <label className="formulario-etiqueta">Nombre de la Marca:</label>
              <div className="input-container">                <input
                  type="text"
                  id="marcaNombre"
                  name="marcaNombre"
                  required
                  className={`formulario-input ${createMarcaError && createMarcaError.errors?.some(error => error.field === 'nombre') ? 'input-error' : ''}`}
                />
                {createMarcaError && createMarcaError.errors?.map((error, index) => (
                  error.field === 'nombre' && (
                    <div key={index} className="error-message">
                      {error.message}
                    </div>
                  )
                ))}
              </div>
            </div>
          </form>          <div className="gestion-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="gestion-titulo">Gestionar Marcas Existentes</h3>
              <div className="search-container" style={{ display: 'flex', alignItems: 'center' }}>                <input
                  type="text"
                  placeholder="Buscar marca..."
                  value={searchMarca}
                  onChange={(e) => setSearchMarca(e.target.value)}
                  className="search-input"
                  style={{ marginLeft: '10px' }}
                />
              </div>
            </div>            <div className="gestion-lista">
              {marcas
                .filter(marca => 
                  marca.nombre.toLowerCase().includes(searchMarca.toLowerCase())
                )
                .sort((a, b) => a.nombre.localeCompare(b.nombre))
                .map((marca) => (
                <div
                  key={marca.id}
                  className={`gestion-item ${selectedMarca?.id === marca.id ? 'selected' : ''}`}
                  onClick={() => handleMarcaSelect(marca)}
                >
                  <span>{marca.nombre}</span>
                  {selectedMarca?.id === marca.id && (
                    <div className="gestion-actions">
                      <button
                        className="btn-editar"
                        onClick={() => setIsEditMarcaMode(true)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={handleDeleteMarca}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Modal para editar marca */}
            <Modal
              isOpen={isEditMarcaMode}
              onRequestClose={() => setIsEditMarcaMode(false)}
              contentLabel="Editar Marca"
              className="modal-crear"
              overlayClassName="modal-overlay"
              closeTimeoutMS={300}
            >
              <div className="modal-crear-formulario">
                <form onSubmit={handleEditMarca}>
                  <div className="modal-crear-header">
                    <h2 className="modal-crear-titulo">Editar Marca</h2>
                    <button type="button" onClick={() => setIsEditMarcaMode(false)} className="modal-crear-cerrar">×</button>
                    <button type="submit" className="modal-boton-crear">Guardar</button>
                  </div>                  <div className="formulario-grupo" style={{ marginTop: '20px' }}>
                    <label className="formulario-etiqueta">Editar Nombre:</label>
                    <div className="input-container">                      <input
                        type="text"
                        name="marcaNombre"
                        defaultValue={selectedMarca?.nombre}
                        className={`formulario-input ${editMarcaError && editMarcaError.errors?.some(error => error.field === 'nombre') ? 'input-error' : ''}`}
                        required
                      />
                      {editMarcaError && editMarcaError.errors?.map((error, index) => (
                        error.field === 'nombre' && (
                          <div key={index} className="error-message">
                            {error.message}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </Modal>
          </div>
        </div>
      </Modal>

      {/* Modal para gestionar tipos */}
      <Modal
        isOpen={isGestionTipoOpen}
        onRequestClose={closeGestionTipo}
        contentLabel="Gestionar Tipos"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <div className="modal-crear-formulario">
          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Gestionar Tipos</h2>
            <button type="button" onClick={closeGestionTipo} className="modal-crear-cerrar">×</button>
          </div>
          <div className="gestion-lista">
            {tipos.map((tipo) => (
              <div
                key={tipo.id}
                className={`gestion-item ${selectedTipo?.id === tipo.id ? 'selected' : ''}`}
                onClick={() => handleTipoSelect(tipo)}
              >
                <span>{tipo.nombre}</span>
                {selectedTipo?.id === tipo.id && (
                  <div className="gestion-actions">
                    <button
                      className="btn-editar"
                      onClick={() => setIsEditTipoMode(true)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={handleDeleteTipo}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {isEditTipoMode && selectedTipo && (
            <form onSubmit={handleEditTipo} className="edit-form">
              <div className="formulario-grupo">
                <label className="formulario-etiqueta">Nombre del Tipo:</label>
                <input
                  type="text"
                  name="tipoNombre"
                  defaultValue={selectedTipo.nombre}
                  className="formulario-input"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-guardar">Guardar</button>
                <button
                  type="button"
                  onClick={() => setIsEditTipoMode(false)}
                  className="btn-cancelar"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Productos;

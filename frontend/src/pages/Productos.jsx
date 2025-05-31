import React, { useState, useEffect, useCallback } from "react";
import useGetProductos from "@hooks/productos/useGetProductos.jsx";
import useCreateProducto from "@hooks/productos/useCreateProducto.jsx";
import useDeleteProducto from "@hooks/productos/useDeleteProducto.jsx";
import useEditProducto from "@hooks/productos/useEditProducto.jsx";
import useGetMarcas from "@hooks/productos/useGetMarcas.jsx";
import useGetTipos from "@hooks/productos/useGetTipos.jsx";
import useCreateMarca from "@hooks/productos/useCreateMarca.jsx";
import useCreateTipo from "@hooks/productos/useCreateTipo.jsx";
import useFilterProductosByNombre from "@hooks/productos/useFilterProductosByNombre.jsx";
import useFilterProductosByMarca from "@hooks/productos/useFilterProductosByMarca.jsx";
import useFilterProductosByTipo from "@hooks/productos/useFilterProductosByTipo.jsx";
import Table from "../components/Table";
import Modal from "react-modal";
import styles from "@styles/categoria.module.css";
import "@styles/formulariotable.css";
import "@styles/modalDetalles.css";
import "@styles/modalCrear.css";
import Swal from "sweetalert2";

const Productos = () => {
  const { productos, loading, setProductos, fetchProductos } = useGetProductos();
  const { marcas, fetchMarcas } = useGetMarcas();
  const { tipos, fetchTipos } = useGetTipos();
  const { filterByNombre } = useFilterProductosByNombre(setProductos);
  const { filterByMarca } = useFilterProductosByMarca(setProductos);
  const { filterByTipo } = useFilterProductosByTipo(setProductos);
  const { create: createProducto } = useCreateProducto(fetchProductos);
  const { remove } = useDeleteProducto(fetchProductos);
  const { edit } = useEditProducto(fetchProductos);
  const { create: createMarca } = useCreateMarca(fetchMarcas);
  const { create: createTipo } = useCreateTipo(fetchTipos);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProducto, setCurrentProducto] = useState(null);
  const [isModalMarcaOpen, setIsModalMarcaOpen] = useState(false);
  const [isModalTipoOpen, setIsModalTipoOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState(null);

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
  };

  const handleCreateProducto = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
  
    const stock = parseInt(formData.get("stock"), 10);
    const precioVenta = parseFloat(formData.get("precioVenta"));
    const precioCompra = parseFloat(formData.get("precioCompra"));
  
    if (stock < 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La cantidad no puede ser negativa.",
        confirmButtonColor: "#000000"
      });
      return;
    }
  
    if (precioCompra > precioVenta) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El precio de compra no puede ser mayor al precio de venta.",
        confirmButtonColor: "#000000"
      });
      return;
    }
  
    const newProducto = {
      nombre: formData.get("nombre"),
      variante: formData.get("variante"),
      precioVenta,
      precioCompra,
      stock,
      fechaVencimiento: formData.get("fechaVencimiento"),
      tipo: {
        id: parseInt(formData.get("tipo"), 10),
      },
      marca: {
        id: parseInt(formData.get("marca"), 10),
      },
    };
  
    try {
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
  };

  const handleEditProducto = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedProducto = {
      nombre: formData.get("nombre"),
      variante: formData.get("variante"),
      precioVenta: parseFloat(formData.get("precioVenta")),
      precioCompra: parseFloat(formData.get("precioCompra")),
      stock: parseInt(formData.get("stock"), 10),
      fechaVencimiento: formData.get("fechaVencimiento"),
      tipo: parseInt(formData.get("tipo"), 10),
      marca: parseInt(formData.get("marca"), 10),
    };

    try {
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
  };

  if (loading) return <p>Cargando productos...</p>;

  console.log("Lista de productos:", productos);

  const columns = [
    { header: "Nombre", key: "nombre" },
    { header: "Variante", key: "variante" },
    { header: "Precio Venta", key: "precioVenta" },
    { header: "Precio Compra", key: "precioCompra" },    

    { header: "Fecha Vencimiento", key: "fechaVencimiento" },
    { header: "Tipo", key: "tipo" },
    { header: "Marca", key: "marca" }
  ];

  return (
    <div className={styles["categoria-container"]}>      <Table
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
          if ((key === "precioVenta" || key === "precioCompra") && (typeof value === "number" || !isNaN(parseFloat(value)))) {
            return `$${parseFloat(value).toLocaleString('es-CL')}`;
          }
          if (key === "tipo" || key === "marca") {
            return value?.nombre || '';
          }
          return value?.nombreLista ? value.nombreLista : value;
        }}
      />      {/* Modal de Creación */}
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
          </div>
          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Nombre del Producto:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              className="formulario-input"
            />          </div>
          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Variante:</label>
            <input
              type="text"
              id="variante"
              name="variante"
              className="formulario-input"
            />
          </div>
          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Precio Venta:</label>
            <input
              type="number"
              id="precioVenta"
              name="precioVenta"
              required
              className="formulario-input"
            />
          </div>
          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Precio Compra:</label>
            <input
              type="number"
              id="precioCompra"
              name="precioCompra"
              required
              className="formulario-input"
            />
          </div>
          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Cantidad:</label>
            <input
              type="number"
              id="stock"
              name="stock"
              required
              className="formulario-input"
            />
          </div>
          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Fecha de Vencimiento:</label>
            <input
              type="date"
              id="fechaVencimiento"
              name="fechaVencimiento"
              className="formulario-input"
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', width: '100%', margin: '0 auto', maxWidth: '800px' }}>
            <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
              <div className="subproducto-nombre-grupo">
                <span className="subproducto-nombre">Tipo</span>
              </div>
              <div className="subproducto-inputs-grupo">
                <div className="input-grupo" style={{ width: '100%' }}>                  
                  <select
                    id="tipo"
                    name="tipo"
                    required
                    className="formulario-input"
                    style={{ minWidth: '180px' }}
                  >
                    <option value="">Seleccione un Tipo</option>
                    {tipos.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-grupo">
                  <button
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
              <div className="subproducto-inputs-grupo">
                <div className="input-grupo" style={{ width: '100%' }}>                  
                  <select
                    id="marca"
                    name="marca"
                    required
                    className="formulario-input"
                    style={{ minWidth: '180px' }}
                  >
                    <option value="">Seleccione una Marca</option>
                    {marcas.map((marca) => (
                      <option key={marca.id} value={marca.id}>
                        {marca.nombre}
                      </option>
                    ))}
                  </select>
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
            </div>
            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Nombre del Producto:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                defaultValue={currentProducto.nombre}
                required
                className="formulario-input"
              />            </div>
            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Variante:</label>
              <input
                type="text"
                id="variante"
                name="variante"
                defaultValue={currentProducto.variante}
                className="formulario-input"
              />
            </div>
            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Precio Venta:</label>
              <input
                type="number"
                id="precioVenta"
                name="precioVenta"
                defaultValue={currentProducto.precioVenta}
                required
                className="formulario-input"
              />
            </div>
            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Precio Compra:</label>
              <input
                type="number"
                id="precioCompra"
                name="precioCompra"
                defaultValue={currentProducto.precioCompra}
                required
                className="formulario-input"
              />
            </div>
            <div className="formulario-grupo">              
              <label className="formulario-etiqueta">Cantidad:</label>
              <input
                type="number"
                id="stock"
                name="stock"
                defaultValue={currentProducto.stock}
                required
                className="formulario-input"
              />
            </div>
            <div className="formulario-grupo">
              <label className="formulario-etiqueta">Fecha de Vencimiento:</label>
              <input
                type="date"
                id="fechaVencimiento"
                name="fechaVencimiento"
                defaultValue={currentProducto.fechaVencimiento || ""}
                className="formulario-input"
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', width: '100%', margin: '0 auto', maxWidth: '800px' }}>
              <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                <div className="subproducto-nombre-grupo">
                  <span className="subproducto-nombre">Tipo</span>
                </div>
                <div className="subproducto-inputs-grupo">
                  <div className="input-grupo" style={{ width: '100%' }}>                    <select
                      id="tipo"
                      name="tipo"
                      defaultValue={currentProducto.tipo.id}
                      required
                      className="formulario-input"
                      style={{ minWidth: '220px' }}
                    >
                      {tipos.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="subproducto-fila" style={{ flex: 1, minWidth: '300px' }}>
                <div className="subproducto-nombre-grupo">
                  <span className="subproducto-nombre">Marca</span>
                </div>
                <div className="subproducto-inputs-grupo">
                  <div className="input-grupo" style={{ width: '100%' }}>                    <select
                      id="marca"
                      name="marca"
                      defaultValue={currentProducto.marca.id}
                      required
                      className="formulario-input"
                      style={{ minWidth: '220px' }}
                    >
                      {marcas.map((marca) => (
                        <option key={marca.id} value={marca.id}>
                          {marca.nombre}
                        </option>
                      ))}
                    </select>
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
      </Modal>{/* Modal para crear tipo */}
      <Modal
        isOpen={isModalTipoOpen}
        onRequestClose={closeModalTipo}
        contentLabel="Crear Tipo"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const tipoNombre = e.target.tipoNombre.value;
            try {
              await createTipo({ nombre: tipoNombre });
              closeModalTipo();
              fetchTipos();
              Swal.fire({
                icon: "success",
                title: "¡Éxito!",
                text: "Tipo creado correctamente.",
                confirmButtonColor: "#000000"
              });
            } catch (error) {
              console.error("Error al crear tipo:", error);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo crear el tipo.",
                confirmButtonColor: "#000000"
              });
            }
          }}
          className="modal-crear-formulario"
        >
          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Crear Nuevo Tipo</h2>
            <button type="button" onClick={closeModalTipo} className="modal-crear-cerrar">×</button>
            <button type="submit" className="modal-boton-crear">Crear</button>
          </div>
          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Nombre del Tipo:</label>
            <input
              type="text"
              id="tipoNombre"
              name="tipoNombre"
              required
              className="formulario-input"
            />
          </div>
        </form>
      </Modal>      {/* Modal para crear marca */}
      <Modal
        isOpen={isModalMarcaOpen}
        onRequestClose={closeModalMarca}
        contentLabel="Crear Marca"
        ariaHideApp={false}
        className="modal-crear"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const marcaNombre = e.target.marcaNombre.value;
            try {
              await createMarca({ nombre: marcaNombre });
              closeModalMarca();
              fetchMarcas();
              Swal.fire({
                icon: "success",
                title: "¡Éxito!",
                text: "Marca creada correctamente.",
                confirmButtonColor: "#000000"
              });
            } catch (error) {
              console.error("Error al crear marca:", error);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo crear la marca.",
                confirmButtonColor: "#000000"
              });
            }
          }}
          className="modal-crear-formulario"
        >
          <div className="modal-crear-header">
            <h2 className="modal-crear-titulo">Crear Nueva Marca</h2>
            <button type="button" onClick={closeModalMarca} className="modal-crear-cerrar">×</button>
            <button type="submit" className="modal-boton-crear">Crear</button>
          </div>
          <div className="formulario-grupo">
            <label className="formulario-etiqueta">Nombre de la Marca:</label>
            <input
              type="text"
              id="marcaNombre"
              name="marcaNombre"
              required
              className="formulario-input"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Productos;

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
import { descargarExcel } from "@services/producto.service";
import Table from "../components/Table";
import Modal from "react-modal";
import styles from "@styles/categoria.module.css";
import "@styles/formulariotable.css";
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
        text: "El stock no puede ser negativo.",
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
    { header: "Stock", key: "stock" },
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
      />

      {/* Modal de Creación */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Crear Producto"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">Crear Nuevo Producto</h2>
        <form onSubmit={handleCreateProducto} className="formulario-table-formulario-table">
          <div className="formulario-table-field-group">
            <label htmlFor="nombre">Nombre del Producto:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              className="formulario-table-input"
            />
          </div>
          <div className="formulario-table-field-group">
            <label htmlFor="variante">Variante:</label>
            <input
              type="text"
              id="variante"
              name="variante"
              className="formulario-table-input"
            />
          </div>
          <div className="formulario-table-field-group">
            <label htmlFor="precioVenta">Precio Venta:</label>
            <input
              type="number"
              id="precioVenta"
              name="precioVenta"
              step="0.01"
              required
              className="formulario-table-input"
            />
          </div>
          <div className="formulario-table-field-group">
            <label htmlFor="precioCompra">Precio Compra:</label>
            <input
              type="number"
              id="precioCompra"
              name="precioCompra"
              step="0.01"
              required
              className="formulario-table-input"
            />
          </div>
          <div className="formulario-table-field-group">
            <label htmlFor="stock">Stock:</label>
            <input
              type="number"
              id="stock"
              name="stock"
              required
              className="formulario-table-input"
            />
          </div>
          <div className="formulario-table-field-group">
            <label htmlFor="fechaVencimiento">Fecha de Vencimiento:</label>
            <input
              type="date"
              id="fechaVencimiento"
              name="fechaVencimiento"
              className="formulario-table-input"
            />
          </div>
          <div className="formulario-table-field-group">
            <label htmlFor="tipo">Tipo:</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <select
                id="tipo"
                name="tipo"
                required
                className="formulario-table-input"
              >
                {tipos.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="formulario-table-btn-add"
                onClick={openModalTipo}
              >
                +
              </button>
            </div>
          </div>
          <div className="formulario-table-field-group">
            <label htmlFor="marca">Marca:</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <select
                id="marca"
                name="marca"
                required
                className="formulario-table-input"
              >
                {marcas.map((marca) => (
                  <option key={marca.id} value={marca.id}>
                    {marca.nombre}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="formulario-table-btn-add"
                onClick={openModalMarca}
              >
                +
              </button>
            </div>
          </div>
          <div className="formulario-table-form-actions">
            <button type="submit" className="formulario-table-btn-confirm">
              Crear
            </button>
            <button
              type="button"
              onClick={closeModal}
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
        onRequestClose={closeEditModal}
        contentLabel="Editar Producto"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">Editar Producto</h2>
        {currentProducto && (
          <form onSubmit={handleEditProducto} className="formulario-table-formulario-table">
            <div className="formulario-table-field-group">
              <label htmlFor="nombre">Nombre del Producto:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                defaultValue={currentProducto.nombre}
                required
                className="formulario-table-input"
              />
            </div>
            <div className="formulario-table-field-group">
              <label htmlFor="variante">Variante:</label>
              <input
                type="text"
                id="variante"
                name="variante"
                defaultValue={currentProducto.variante}
                className="formulario-table-input"
              />
            </div>
            <div className="formulario-table-field-group">
              <label htmlFor="precioVenta">Precio Venta:</label>
              <input
                type="number"
                id="precioVenta"
                name="precioVenta"
                defaultValue={currentProducto.precioVenta}
                step="0.01"
                required
                className="formulario-table-input"
              />
            </div>
            <div className="formulario-table-field-group">
              <label htmlFor="precioCompra">Precio Compra:</label>
              <input
                type="number"
                id="precioCompra"
                name="precioCompra"
                defaultValue={currentProducto.precioCompra}
                step="0.01"
                required
                className="formulario-table-input"
              />
            </div>
            <div className="formulario-table-field-group">
              <label htmlFor="stock">Stock:</label>
              <input
                type="number"
                id="stock"
                name="stock"
                defaultValue={currentProducto.stock}
                required
                className="formulario-table-input"
              />
            </div>
            <div className="formulario-table-field-group">
              <label htmlFor="fechaVencimiento">Fecha de Vencimiento:</label>
              <input
                type="date"
                id="fechaVencimiento"
                name="fechaVencimiento"
                defaultValue={currentProducto.fechaVencimiento || ""}
                className="formulario-table-input"
              />
            </div>
            <div className="formulario-table-field-group">
              <label htmlFor="tipo">Tipo:</label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <select
                  id="tipo"
                  name="tipo"
                  defaultValue={currentProducto.tipo.id}
                  required
                  className="formulario-table-input"
                >
                  {tipos.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="formulario-table-btn-add"
                  onClick={openModalTipo}
                >
                  +
                </button>
              </div>
            </div>
            <div className="formulario-table-field-group">
              <label htmlFor="marca">Marca:</label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <select
                  id="marca"
                  name="marca"
                  defaultValue={currentProducto.marca.id}
                  required
                  className="formulario-table-input"
                >
                  {marcas.map((marca) => (
                    <option key={marca.id} value={marca.id}>
                      {marca.nombre}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="formulario-table-btn-add"
                  onClick={openModalMarca}
                >
                  +
                </button>
              </div>
            </div>
            <div className="formulario-table-form-actions">
              <button type="submit" className="formulario-table-btn-confirm">
                Guardar
              </button>
              <button
                type="button"
                onClick={closeEditModal}
                className="formulario-table-btn-cancel"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal de Eliminación */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleDeleteModalClose}
        contentLabel="Eliminar Producto"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">¿Estás seguro que deseas eliminar este producto?</h2>
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

      {/* Modal para crear tipo */}
      <Modal
        isOpen={isModalTipoOpen}
        onRequestClose={closeModalTipo}
        contentLabel="Crear Tipo"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">Crear Nuevo Tipo</h2>
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
          className="formulario-table-formulario-table"
        >
          <div className="formulario-table-field-group">
            <label htmlFor="tipoNombre">Nombre del Tipo:</label>
            <input
              type="text"
              id="tipoNombre"
              name="tipoNombre"
              required
              className="formulario-table-input"
            />
          </div>
          <div className="formulario-table-form-actions">
            <button type="submit" className="formulario-table-btn-confirm">
              Crear
            </button>
            <button
              type="button"
              onClick={closeModalTipo}
              className="formulario-table-btn-cancel"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para crear marca */}
      <Modal
        isOpen={isModalMarcaOpen}
        onRequestClose={closeModalMarca}
        contentLabel="Crear Marca"
        ariaHideApp={false}
        className="formulario-table-modal-form"
        overlayClassName="formulario-table-overlay"
      >
        <h2 className="formulario-table-modal-title">Crear Nueva Marca</h2>
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
          className="formulario-table-formulario-table"
        >
          <div className="formulario-table-field-group">
            <label htmlFor="marcaNombre">Nombre de la Marca:</label>
            <input
              type="text"
              id="marcaNombre"
              name="marcaNombre"
              required
              className="formulario-table-input"
            />
          </div>
          <div className="formulario-table-form-actions">
            <button type="submit" className="formulario-table-btn-confirm">
              Crear
            </button>
            <button
              type="button"
              onClick={closeModalMarca}
              className="formulario-table-btn-cancel"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Productos;

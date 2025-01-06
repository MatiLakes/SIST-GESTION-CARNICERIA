import React, { useState, useEffect, useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
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
import Swal from "sweetalert2";


import styles from "@styles/Producto.module.css";

const Productos = () => {
  const { productos, loading: loadingProductos, setProductos, fetchProductos } = useGetProductos();
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

  const [nombreFiltro, setNombreFiltro] = useState("");
  const [marcaFiltro, setMarcaFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");

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

  const handleCreateProducto = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
  
    const stock = parseInt(formData.get("stock"), 10);
    const precioVenta = parseFloat(formData.get("precioVenta"));
    const precioCompra = parseFloat(formData.get("precioCompra"));
  
    // Validaciones
    if (stock < 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El stock no puede ser negativo.",
      });
      return;
    }
  
    if (precioCompra > precioVenta) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El precio de compra no puede ser mayor al precio de venta.",
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
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Producto creado exitosamente.",
      });
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al crear el producto.",
      });
      console.error("Error al crear el producto:", error);
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
    } catch (error) {
      console.error("Error al editar producto:", error);
    }
  };

  const handleDeleteProducto = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
  
    if (result.isConfirmed) {
      try {
        await remove(id);
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "El producto ha sido eliminado.",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al eliminar el producto.",
        });
        console.error("Error al eliminar producto:", error);
      }
    }
  };
  

  const handleSearch = () => {
    filterByNombre(nombreFiltro);
  };

  const handleFilterByMarca = () => {
    filterByMarca(marcaFiltro);
  };

  const handleFilterByTipo = () => {
    filterByTipo(tipoFiltro);
  };
  
  const resetFilters = () => {
    setNombreFiltro("");
    setMarcaFiltro("");
    setTipoFiltro("");
    fetchProductos(); // Volver a cargar todos los productos
  };


  if (loadingProductos) return <p className={styles.loading}>Cargando productos...</p>;

  return (
    <div className={styles.container}>
      <h1>Gestión de Productos</h1>
      <div>
      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          type="text"
          value={nombreFiltro}
          onChange={(e) => setNombreFiltro(e.target.value)}
          placeholder="Buscar por nombre"
        />
        <button className={styles.searchButton} onClick={handleSearch}>
          Buscar
        </button>

        <select
          className={styles.filterSelect}
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
        >
          <option value="">Filtrar por tipo</option>
          {tipos.map((tipo) => (
            <option key={tipo.id} value={tipo.nombre}>
              {tipo.nombre}
            </option>
          ))}
        </select>
        <button className={styles.filterButton} onClick={handleFilterByTipo}>
          Filtrar
        </button>

        <select
          className={styles.filterSelect}
          value={marcaFiltro}
          onChange={(e) => setMarcaFiltro(e.target.value)}
        >
          <option value="">Filtrar por marca</option>
          {marcas.map((marca) => (
            <option key={marca.id} value={marca.nombre}>
              {marca.nombre}
            </option>
          ))}
        </select>
        <button className={styles.filterButton} onClick={handleFilterByMarca}>
          Filtrar
        </button>

        <button className={styles.resetButton} onClick={resetFilters}>
          Resetear Filtros
        </button>
      {/* Botón para exportar a Excel */}
      <button className={styles.exportButton} onClick={descargarExcel}>
            Exportar a Excel
        </button>
    </div>
    </div>
      <button className={styles.createButton} onClick={openModal}>
        Crear nuevo producto
      </button>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Variante</th>
            <th>Precio Venta</th>
            <th>Precio Compra</th>
            <th>Stock</th>
            <th>Fecha Vencimiento</th>
            <th>Tipo</th>
            <th>Marca</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {Array.isArray(productos) && productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>{producto.variante}</td>
              <td>${producto.precioVenta}</td>
              <td>${producto.precioCompra}</td>
              <td>{producto.stock}</td>
              <td>{producto.fechaVencimiento || "N/A"}</td>
              <td>{producto.tipo.nombre}</td>
              <td>{producto.marca.nombre}</td>
              <td>
                <button
                  className={styles.iconButton}
                  onClick={() => openEditModal(producto)}
                >
                  <FaEdit className={styles.editIcon} />
                </button>
                <button
                  className={styles.iconButton}
                  onClick={() =>
                    handleDeleteProducto(producto.id)
                  }
                >
                  <FaTrash className={styles.deleteIcon} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para crear producto */}
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Crear Nuevo Producto</h2>
            <form onSubmit={handleCreateProducto}>
  <div className={styles.formGroup}>
    <label htmlFor="nombre">Nombre del Producto:</label>
    <input type="text" id="nombre" name="nombre" required />
  </div>
  <div className={styles.formGroup}>
    <label htmlFor="variante">Variante:</label>
    <input type="text" id="variante" name="variante" />
  </div>
  <div className={styles.formGroup}>
    <label htmlFor="precioVenta">Precio Venta:</label>
    <input type="number" id="precioVenta" name="precioVenta" step="0.01" required />
  </div>
  <div className={styles.formGroup}>
    <label htmlFor="precioCompra">Precio Compra:</label>
    <input type="number" id="precioCompra" name="precioCompra" step="0.01" required />
  </div>
  <div className={styles.formGroup}>
    <label htmlFor="stock">Stock:</label>
    <input type="number" id="stock" name="stock" required />
  </div>
  <div className={styles.formGroup}>
    <label htmlFor="fechaVencimiento">Fecha de Vencimiento:</label>
    <input type="date" id="fechaVencimiento" name="fechaVencimiento" />
  </div>
  <div className={styles.formGroup}>
    <label htmlFor="tipo">Tipo:</label>
    <div style={{ display: "flex", alignItems: "center" }}>
      <select id="tipo" name="tipo" required>
        {tipos.map((tipo) => (
          <option key={tipo.id} value={tipo.id}>
            {tipo.nombre}
          </option>
        ))}
      </select>
      <button
        type="button"
        className={styles.addButton}
        onClick={openModalTipo}
      >
        +
      </button>
    </div>
  </div>
  <div className={styles.formGroup}>
    <label htmlFor="marca">Marca:</label>
    <div style={{ display: "flex", alignItems: "center" }}>
      <select id="marca" name="marca" required>
        {marcas.map((marca) => (
          <option key={marca.id} value={marca.id}>
            {marca.nombre}
          </option>
        ))}
      </select>
      <button
        type="button"
        className={styles.addButton}
        onClick={openModalMarca}
      >
        +
      </button>
    </div>
  </div>
  <div className={styles.formActions}>
    <button type="submit" className={styles.saveButton}>
      Guardar
    </button>
    <button
      type="button"
      className={styles.cancelButton}
      onClick={closeModal}
    >
      Cancelar
    </button>
  </div>
</form>
          </div>
        </div>
      )}

      {/* Modal para editar producto */}
{isEditModalOpen && currentProducto && (
  <div className={styles.modal}>
    <div className={styles.modalContent}>
      <h2>Editar Producto</h2>
      <form onSubmit={handleEditProducto}>
        <div className={styles.formGroup}>
          <label htmlFor="nombre">Nombre del Producto:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            defaultValue={currentProducto.nombre}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="variante">Variante:</label>
          <input
            type="text"
            id="variante"
            name="variante"
            defaultValue={currentProducto.variante}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="precioVenta">Precio Venta:</label>
          <input
            type="number"
            id="precioVenta"
            name="precioVenta"
            defaultValue={currentProducto.precioVenta}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="precioCompra">Precio Compra:</label>
          <input
            type="number"
            id="precioCompra"
            name="precioCompra"
            defaultValue={currentProducto.precioCompra}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="stock">Stock:</label>
          <input
            type="number"
            id="stock"
            name="stock"
            defaultValue={currentProducto.stock}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="fechaVencimiento">Fecha de Vencimiento:</label>
          <input
            type="date"
            id="fechaVencimiento"
            name="fechaVencimiento"
            defaultValue={currentProducto.fechaVencimiento || ""}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="tipo">Tipo:</label>
          <select
            id="tipo"
            name="tipo"
            defaultValue={currentProducto.tipo.id}
            required
          >
            {tipos.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={styles.addButton}
            onClick={openModalTipo}
          >
            +
          </button>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="marca">Marca:</label>
          <select
            id="marca"
            name="marca"
            defaultValue={currentProducto.marca.id}
            required
          >
            {marcas.map((marca) => (
              <option key={marca.id} value={marca.id}>
                {marca.nombre}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={styles.addButton}
            onClick={openModalMarca}
          >
            +
          </button>
        </div>
        <div className={styles.formActions}>
          <button type="submit" className={styles.saveButton}>
            Guardar Cambios
          </button>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={closeEditModal}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* Modal para crear tipo */}
      {isModalTipoOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Ingresa un nuevo Tipo</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const tipoNombre = e.target.tipoNombre.value;
                try {
                  await createTipo({ nombre: tipoNombre });
                  closeModalTipo();
                  fetchTipos(); // Actualiza la lista de tipos
                } catch (error) {
                  console.error("Error al crear tipo:", error);
                }
              }}
            >
              <div className={styles.formGroup}>
                <label htmlFor="tipoNombre">Nombre del Tipo:</label>
                <input type="text" id="tipoNombre" name="tipoNombre" required />
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  Guardar
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={closeModalTipo}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para crear marca */}
      {isModalMarcaOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Ingresa una nueva Marca</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const marcaNombre = e.target.marcaNombre.value;
                try {
                  await createMarca({ nombre: marcaNombre });
                  closeModalMarca();
                  fetchMarcas(); // Actualiza la lista de marcas
                } catch (error) {
                  console.error("Error al crear marca:", error);
                }
              }}
            >
              <div className={styles.formGroup}>
                <label htmlFor="marcaNombre">Nombre de la Marca:</label>
                <input type="text" id="marcaNombre" name="marcaNombre" required />
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  Guardar
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={closeModalMarca}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;

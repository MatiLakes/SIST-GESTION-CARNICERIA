import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCrearLista from "@hooks/listas/useCrearLista";
import "@styles/CrearListaPage.css";

const CrearListaPage = () => {
  const navigate = useNavigate();
  const { crearLista, loading, error } = useCrearLista();
  const [nombreLista, setNombreLista] = useState("");
  const [cortes, setCortes] = useState([
    { nombre: "Abastero", precio: 0, cantidad: 0 },
    { nombre: "Asado Tira", precio: 0, cantidad: 0 },
    { nombre: "Asado Carnicero", precio: 0, cantidad: 0 },
    { nombre: "Asiento", precio: 0, cantidad: 0 },
    { nombre: "Choclillo", precio: 0, cantidad: 0 },
    { nombre: "Cogote", precio: 0, cantidad: 0 },
    { nombre: "Entraña", precio: 0, cantidad: 0 },
    { nombre: "Filete", precio: 0, cantidad: 0 },
    { nombre: "Ganso", precio: 0, cantidad: 0 },
    { nombre: "Huachalomo", precio: 0, cantidad: 0 },
    { nombre: "Lomo Liso", precio: 0, cantidad: 0 },
    { nombre: "Lomo Vetado", precio: 0, cantidad: 0 },
    { nombre: "Palanca", precio: 0, cantidad: 0 },
    { nombre: "Plateada", precio: 0, cantidad: 0 },
    { nombre: "Pollo Barriga", precio: 0, cantidad: 0 },
    { nombre: "Pollo Ganso", precio: 0, cantidad: 0 },
    { nombre: "Posta Negra", precio: 0, cantidad: 0 },
    { nombre: "Posta Paleta", precio: 0, cantidad: 0 },
    { nombre: "Posta Rosada", precio: 0, cantidad: 0 },
    { nombre: "Punta Ganso", precio: 0, cantidad: 0 },
    { nombre: "Punta Picana", precio: 0, cantidad: 0 },
    { nombre: "Punta Paleta", precio: 0, cantidad: 0 },
    { nombre: "Sobrecostilla", precio: 0, cantidad: 0 },
    { nombre: "Tapabarriga", precio: 0, cantidad: 0 },
    { nombre: "Tapapecho", precio: 0, cantidad: 0 },
    { nombre: "Hueso Carnudo", precio: 0, cantidad: 0 },
    { nombre: "Hueso Con Carne", precio: 0, cantidad: 0 },
    { nombre: "Pata Vacuno", precio: 0, cantidad: 0 },
    { nombre: "Huachalomo Olla", precio: 0, cantidad: 0 },
    { nombre: "Cazuela Paleta", precio: 0, cantidad: 0 },
    { nombre: "Osobuco", precio: 0, cantidad: 0 },
    { nombre: "Lagarto", precio: 0, cantidad: 0 },
    { nombre: "Costilla Vacuno", precio: 0, cantidad: 0 },
    { nombre: "Tapaposta", precio: 0, cantidad: 0 },
    { nombre: "Malaya", precio: 0, cantidad: 0 },
  ]);

  const handleInputChange = (index, field, value) => {
    const nuevosCortes = [...cortes];
    nuevosCortes[index][field] = value;
    setCortes(nuevosCortes);
  };

  const handleGuardar = async () => {
    try {
      if (!nombreLista.trim()) {
        alert("Por favor, ingresa un nombre para la lista.");
        return;
      }

      await crearLista(nombreLista, cortes); // Usa el hook en lugar del servicio
      alert("Lista guardada exitosamente.");
      navigate("/animal-corte/listas-precios"); // Redirigir
    } catch (error) {
      console.error("Error guardando la lista:", error);
      alert("Hubo un error al intentar guardar la lista.");
    }
  };

  return (
    <div className="crear-lista-page">
      <h1>Crear Lista de Precios</h1>
      <div className="nombre-lista-container">
        <label htmlFor="nombreLista" className="nombre-lista-label">
          Nombre de la Lista:
        </label>
        <input
          type="text"
          id="nombreLista"
          className="nombre-lista-input"
          placeholder="Ingrese el nombre de la lista"
          value={nombreLista}
          onChange={(e) => setNombreLista(e.target.value)}
        />
      </div>

      {/* Sección donde se ingresan los precios y cantidades */}
      <div className="cortes-lista-container">
        {cortes.map((corte, index) => (
          <div key={index} className="corte-item">
            <h3>{corte.nombre}</h3>
            <label htmlFor={`precio-${index}`}>Precio:</label>
            <input
              type="number"
              id={`precio-${index}`}
              placeholder="Ingrese precio"
              value={corte.precio}
              onChange={(e) =>
                handleInputChange(index, "precio", parseFloat(e.target.value))
              }
            />
            <label htmlFor={`cantidad-${index}`}>Cantidad:</label>
            <input
              type="number"
              id={`cantidad-${index}`}
              placeholder="Ingrese cantidad"
              value={corte.cantidad}
              onChange={(e) =>
                handleInputChange(index, "cantidad", parseFloat(e.target.value))
              }
            />
          </div>
        ))}
      </div>

      <button onClick={handleGuardar}>Guardar Lista</button>
    </div>
  );
};

export default CrearListaPage;

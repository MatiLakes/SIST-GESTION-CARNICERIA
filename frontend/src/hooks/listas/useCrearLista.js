import { useState } from "react";
import axios from "axios";

const useCrearLista = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const crearLista = async (nombreLista, cortes) => {
    setLoading(true);
    try {
      const datos = { nombreLista };

      cortes.forEach((corte) => {
        const keyCantidad = corte.nombre.toLowerCase().replace(/\s+/g, "");
        const keyPrecio = `precio${corte.nombre.replace(/\s+/g, "")}`;
        datos[keyCantidad] = corte.cantidad ?? 0; 
        datos[keyPrecio] = corte.precio ?? 0;
      });

      console.log("Datos enviados al backend:", datos); 

      await axios.post("/api/animal-corte", datos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { crearLista, loading, error };
};

export default useCrearLista;
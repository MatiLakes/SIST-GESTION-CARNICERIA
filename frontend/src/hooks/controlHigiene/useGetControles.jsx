import { useState, useEffect } from "react";
import { getControles } from "@services/controlHigiene.service.js";

const useGetControles = () => {
  const [controles, setControles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchControles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getControles();
      console.log("Respuesta de getControles:", data);
      setControles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener controles de higiene:", err);
      setError(err.message || "Error al cargar los registros");
      setControles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchControles();
  }, []);

  return { controles, loading, error, fetchControles };
};

export default useGetControles;

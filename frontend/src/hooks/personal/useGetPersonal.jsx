import { useState, useEffect } from "react";
import { getPersonal } from "@services/personal.service.js";

const useGetPersonal = () => {
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPersonal = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPersonal();
      console.log("Datos de personal obtenidos:", data);
      setPersonal(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener personal:", err);
      setError(err.message || "Error al cargar el personal");
      setPersonal([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonal();
  }, []);

  return { personal, loading, error, fetchPersonal };
};

export default useGetPersonal;

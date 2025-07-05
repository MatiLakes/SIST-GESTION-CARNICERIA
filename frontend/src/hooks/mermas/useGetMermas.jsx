import { useState, useEffect } from "react";
import { getMermas } from "@services/merma.service.js";

const useGetMermas = () => {
  const [mermas, setMermas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMermas = async () => {
    setLoading(true);
    try {
      const response = await getMermas();
      setMermas(response.data || []);
    } catch (error) {
      console.error("Error al obtener las mermas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMermas();
  }, []);

  return { mermas, setMermas, loading, fetchMermas };
};

export default useGetMermas;

import { useState, useEffect } from "react";
import { getNotificaciones } from "@services/notificacion.service.js";

const useGetNotificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        setLoading(true);
        const data = await getNotificaciones();
        setNotificaciones(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotificaciones();
  }, []);

  return { notificaciones, loading, error };
};

export default useGetNotificaciones;

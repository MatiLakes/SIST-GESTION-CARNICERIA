import { useState, useEffect } from "react";
import useGetNotificaciones from "@hooks/notificacion/useGetNotificaciones.jsx";
import "@styles/notificaciones.css";

const DURACION_ANIM = 500; // igual a la animación en el CSS

const NotificacionesGlobal = () => {
  const { notificaciones, loading, error } = useGetNotificaciones();
  const [visibles, setVisibles] = useState([]);
  const [exiting, setExiting] = useState({});

  useEffect(() => {
    if (!loading && !error) {
      // Mantener las notificaciones que aún no han expirado y agregar nuevas
      setVisibles((prev) => {
        // Filtrar las que siguen activas
        const activas = prev.filter((v) =>
          notificaciones.some((n) => n.mensaje === v.mensaje)
        );
        // Agregar nuevas que no están en activas
        const nuevas = notificaciones.filter(
          (n) => !activas.some((v) => v.mensaje === n.mensaje)
        );
        return [
          ...activas,
          ...nuevas.map((n, i) => ({ ...n, _id: Date.now() + i }))
        ];
      });
    }
  }, [notificaciones, loading, error]);

  useEffect(() => {
    if (!loading && !error && visibles.length) {
      const timers = visibles.map((n) =>
        setTimeout(() => {
          setExiting((prev) => ({ ...prev, [n._id]: true }));
          setTimeout(() => {
            setVisibles((prev) => prev.filter((v) => v._id !== n._id));
            setExiting((prev) => {
              const nuevo = { ...prev };
              delete nuevo[n._id];
              return nuevo;
            });
          }, DURACION_ANIM);
        }, 5000)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [visibles, loading, error]);

  if (loading || error || !visibles.length) return null;
  return (
    <div className="notificaciones-global">
      {visibles.slice(0, 5).map((n) => (
        <div
          key={n._id}
          className={`notificacion-item${
            exiting[n._id] ? " notificacion-item-exit" : ""
          }`}
        >
          {n.mensaje}
        </div>
      ))}
      {visibles.length > 5 && (
        <div className="notificacion-item notificacion-mas">
          +{visibles.length - 5} más
        </div>
      )}
    </div>
  );
};

export default NotificacionesGlobal;

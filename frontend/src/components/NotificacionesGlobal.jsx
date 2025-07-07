import { useState, useEffect } from "react";
import useGetNotificaciones from "@hooks/notificacion/useGetNotificaciones.jsx";
import "@styles/notificaciones.css";

const DURACION_ANIM = 500; // igual a la animación en el CSS
const TIEMPO_GRUPO = 4000; // 5 segundos para mostrar cada grupo de 5 notificaciones

const NotificacionesGlobal = () => {
  const { notificaciones, loading, error } = useGetNotificaciones();
  const [visibles, setVisibles] = useState([]);
  const [exiting, setExiting] = useState({});
  const [grupoActual, setGrupoActual] = useState(0);

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
        const todasNotificaciones = [
          ...activas,
          ...nuevas.map((n, i) => ({ ...n, _id: Date.now() + i }))
        ];
        
        // Reiniciar grupo actual si hay nuevas notificaciones
        if (nuevas.length > 0) {
          setGrupoActual(0);
        }
        
        return todasNotificaciones;
      });
    }
  }, [notificaciones, loading, error]);

  // Efecto para rotar automáticamente entre grupos de notificaciones (solo una vez)
  useEffect(() => {
    if (visibles.length > 5) {
      const totalGrupos = Math.ceil(visibles.length / 5);
      let timerRotacion;
      
      const rotarGrupo = () => {
        setGrupoActual((prev) => {
          const siguienteGrupo = prev + 1;
          // Si llegamos al último grupo, no continuar rotando
          if (siguienteGrupo >= totalGrupos) {
            return prev;
          }
          // Programar la siguiente rotación
          timerRotacion = setTimeout(rotarGrupo, TIEMPO_GRUPO);
          return siguienteGrupo;
        });
      };
      
      // Iniciar la primera rotación después de 5 segundos
      timerRotacion = setTimeout(rotarGrupo, TIEMPO_GRUPO);
      
      return () => {
        if (timerRotacion) clearTimeout(timerRotacion);
      };
    }
  }, [visibles.length]);

  useEffect(() => {
    if (!loading && !error && visibles.length) {
      // Calcular el tiempo total necesario para mostrar todos los grupos
      const totalGrupos = Math.ceil(visibles.length / 5);
      const tiempoTotalNecesario = totalGrupos * TIEMPO_GRUPO;
      
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
        }, tiempoTotalNecesario + 1000) // Durar más que toda la rotación de grupos
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [visibles, loading, error]);

  if (loading || error || !visibles.length) return null;
  
  const inicioGrupo = grupoActual * 5;
  const finGrupo = inicioGrupo + 5;
  const notificacionesGrupo = visibles.slice(inicioGrupo, finGrupo);
  const totalGrupos = Math.ceil(visibles.length / 5);
  
  return (
    <div className="notificaciones-global">
      {notificacionesGrupo.map((n) => (
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
        <div className="notificacion-item notificacion-indicador">
          Grupo {grupoActual + 1} de {totalGrupos} • {visibles.length} total
        </div>
      )}
    </div>
  );
};

export default NotificacionesGlobal;
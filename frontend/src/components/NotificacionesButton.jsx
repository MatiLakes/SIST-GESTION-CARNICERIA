import { useState, useEffect } from "react";
import useGetNotificaciones from "@hooks/notificacion/useGetNotificaciones.jsx";
import Modal from "react-modal";
import { FaBell } from "react-icons/fa";
import "@styles/notificaciones.css";

const NotificacionesModal = ({ isOpen, onRequestClose, notificaciones }) => {
  // Separar notificaciones por tipo
  const pedidos = notificaciones.filter(n => n.tipo === 'pedido_entrega');
  const pagos = notificaciones.filter(n => n.tipo === 'pago_pendiente');

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Todas las notificaciones"
      className="modal-detalles"
      overlayClassName="modal-overlay"
      closeTimeoutMS={200}
      ariaHideApp={false}
    >
      <div className="modal-crear-formulario">
        <div className="modal-detalles-header">
          <h2 className="modal-detalles-titulo">Todas las notificaciones</h2>
          <button onClick={onRequestClose} className="modal-detalles-cerrar">×</button>
        </div>
        <div className="modal-detalles-contenido">
          {notificaciones.length === 0 ? (
            <p>No hay notificaciones.</p>
          ) : (
            <div className="notificaciones-modal-list">
              {pedidos.length > 0 && (
                <>
                  <h3>Pedidos</h3>
                  <ul style={{ padding: 0, listStyle: 'none' }}>
                    {pedidos.map((n, i) => (
                      <li
                        key={i}
                        className="notificacion-item-modal"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      >
                        {n.mensaje}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {pagos.length > 0 && (
                <>
                  <h3>Pagos pendientes</h3>
                  <ul style={{ padding: 0, listStyle: 'none' }}>
                    {pagos.map((n, i) => (
                      <li
                        key={i}
                        className="notificacion-item-modal"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      >
                        {n.mensaje}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

const NotificacionesButton = () => {
  const { notificaciones } = useGetNotificaciones();
  const [modalOpen, setModalOpen] = useState(false);
  const [mostrarBtn, setMostrarBtn] = useState(true);
  const cantidad = notificaciones.length;

  // Oculta el botón si hay notificaciones flotantes (notificacion-item) en el DOM
  useEffect(() => {
    const checkNotificaciones = () => {
      const hayNotificacionItem = document.querySelector('.notificacion-item');
      setMostrarBtn(!hayNotificacionItem);
    };
    checkNotificaciones();
    const interval = setInterval(checkNotificaciones, 300);
    return () => clearInterval(interval);
  }, [notificaciones]);

  return (
    <>
      {mostrarBtn && (
        <button
          className="notificaciones-btn notificaciones-btn-fade"
          onClick={() => setModalOpen(true)}
          style={{ position: 'fixed', top: 99, right: 50, zIndex: 10000 }}
          title="Ver notificaciones"
        >
          <FaBell size={24} />
          {cantidad > 0 && <span className="notificaciones-badge">{cantidad}</span>}
        </button>
      )}
      <NotificacionesModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        notificaciones={notificaciones}
      />
    </>
  );
};

export default NotificacionesButton;

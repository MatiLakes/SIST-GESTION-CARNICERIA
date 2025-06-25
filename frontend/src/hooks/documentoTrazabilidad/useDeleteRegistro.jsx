import { deleteRegistro } from "@services/documentoTrazabilidad.service.js";

const useDeleteRegistro = (fetchDocumentos) => {
  const removeRegistro = async (documentoId, registroId) => {
    await deleteRegistro(documentoId, registroId);
    if (fetchDocumentos) fetchDocumentos();
  };

  return { removeRegistro };
};

export default useDeleteRegistro;

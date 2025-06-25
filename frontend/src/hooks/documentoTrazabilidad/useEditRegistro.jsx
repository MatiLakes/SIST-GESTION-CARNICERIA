import { updateRegistro } from "@services/documentoTrazabilidad.service.js";

const useEditRegistro = (fetchDocumentos) => {
  const editRegistro = async (documentoId, registroId, data) => {
    const res = await updateRegistro(documentoId, registroId, data);
    if (fetchDocumentos) fetchDocumentos();
    return res;
  };

  return { editRegistro };
};

export default useEditRegistro;

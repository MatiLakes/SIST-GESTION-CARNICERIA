import { addRegistroToDocumento } from "@services/documentoTrazabilidad.service.js";

const useAddRegistro = (fetchDocumentos) => {
  const addRegistro = async (documentoId, data) => {
    const res = await addRegistroToDocumento(documentoId, data);
    if (fetchDocumentos) fetchDocumentos();
    return res;
  };

  return { addRegistro };
};

export default useAddRegistro;

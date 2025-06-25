import { updateDocumento } from "@services/documentoTrazabilidad.service.js";

const useEditDocumento = (fetchDocumentos) => {
  const edit = async (id, data) => {
    const res = await updateDocumento(id, data);
    if (fetchDocumentos) fetchDocumentos();
    return res;
  };

  return { edit };
};

export default useEditDocumento;

import { createDocumento } from "@services/documentoTrazabilidad.service.js";

const useCreateDocumento = (fetchDocumentos) => {
  const create = async (data) => {
    const res = await createDocumento(data);
    if (fetchDocumentos) fetchDocumentos();
    return res;
  };

  return { create };
};

export default useCreateDocumento;

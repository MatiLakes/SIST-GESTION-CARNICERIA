import { updateDocumentoTemperatura } from "@services/documentoTemperatura.service.js";

const useEditDocumentoTemperatura = (fetchDocumentos) => {
  const edit = async (id, data) => {
    const res = await updateDocumentoTemperatura(id, data);
    if (fetchDocumentos) fetchDocumentos();
    return res;
  };

  return { edit };
};

export default useEditDocumentoTemperatura;

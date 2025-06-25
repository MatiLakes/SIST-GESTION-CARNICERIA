import { createDocumentoTemperatura } from "@services/documentoTemperatura.service.js";

const useCreateDocumentoTemperatura = (fetchDocumentos) => {
  const create = async (data) => {
    const res = await createDocumentoTemperatura(data);
    if (fetchDocumentos) fetchDocumentos();
    return res;
  };

  return { create };
};

export default useCreateDocumentoTemperatura;

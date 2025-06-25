import { deleteDocumentoTemperatura } from "@services/documentoTemperatura.service.js";

const useDeleteDocumentoTemperatura = (fetchDocumentos) => {
  const remove = async (id) => {
    await deleteDocumentoTemperatura(id);
    if (fetchDocumentos) fetchDocumentos();
  };

  return { remove };
};

export default useDeleteDocumentoTemperatura;

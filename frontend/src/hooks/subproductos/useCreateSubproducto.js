import { createSubproductoService } from "@services/subproductos.service";
import Swal from "sweetalert2";

const useCreateSubproducto = (fetchSubproductos) => {
  const create = async (subproductoData) => {
    try {
      const [subproducto, error] = await createSubproductoService(subproductoData);
      if (error) {
        Swal.fire("Error", error, "error");
      } else {
        fetchSubproductos();
        Swal.fire("Éxito", "Subproducto creado con éxito", "success");
      }
    } catch (err) {
      Swal.fire("Error", "No se pudo crear el subproducto", "error");
    }
  };

  return { create };
};

export default useCreateSubproducto;

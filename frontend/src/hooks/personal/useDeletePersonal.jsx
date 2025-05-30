import { deletePersonal } from "@services/personal.service.js";

const useDeletePersonal = (fetchPersonal) => {
  const remove = async (id) => {
    await deletePersonal(id);
    if (fetchPersonal) fetchPersonal();
  };

  return { remove };
};

export default useDeletePersonal;

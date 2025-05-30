import { updatePersonal } from "@services/personal.service.js";

const useEditPersonal = (fetchPersonal) => {
  const edit = async (id, data) => {
    const res = await updatePersonal(id, data);
    if (fetchPersonal) fetchPersonal();
    return res;
  };

  return { edit };
};

export default useEditPersonal;

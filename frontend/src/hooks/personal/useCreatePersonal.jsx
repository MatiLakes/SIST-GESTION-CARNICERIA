import { createPersonal } from "@services/personal.service.js";

const useCreatePersonal = (fetchPersonal) => {
  const create = async (data) => {
    const res = await createPersonal(data);
    if (fetchPersonal) fetchPersonal();
    return res;
  };

  return { create };
};

export default useCreatePersonal;

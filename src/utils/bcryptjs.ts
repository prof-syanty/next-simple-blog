import bcryptjs from "bcryptjs";

export const hashPassword = async (password: string) => {
  return await bcryptjs.hash(password, 12);
};

export const comparePassword = async (
  storedPasword: string,
  inputPassword: string
) => {
  return await bcryptjs.compare(storedPasword, inputPassword);
};

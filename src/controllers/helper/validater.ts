const validateEmail = (email: string) => {
  const regex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (!regex.test(email)) {
    throw new Error("Email malformed");
  }
};

const validateBody = (body: string[]) => {
  if (body.some((element) => !element)) {
    throw new Error("Body malformed");
  }
};

export { validateEmail, validateBody };

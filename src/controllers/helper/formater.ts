const formatBodyToLowerCase = (body: { [key: string]: any }) => {
  const formatedBody: { [key: string]: any } = {};
  for (let [key, value] of Object.entries(body)) {
    if (typeof value === "string") {
      value = value.trim().toLowerCase();
    }
    formatedBody[key] = value;
  }
  return formatedBody;
};

export { formatBodyToLowerCase };

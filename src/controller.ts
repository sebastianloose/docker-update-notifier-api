import { Request, Response } from "express";
import { addSubscription } from "./db";

const handleSubscription = (req: Request, res: Response) => {
  try {
    const { email, organization, repository } = formatBody(req.body);

    validateBody([email, organization, repository]);
    validateEmail(email);

    addSubscription({
      email: email,
      organization: organization,
      repository: repository,
    });

    res.status(200).end();
  } catch (error: any) {
    if (error.message) {
      res.status(400).send(error.message);
      return;
    }
    res.status(500).end();
  }
};

const formatBody = (body: { [key: string]: any }) => {
  const formatedBody: { [key: string]: any } = {};
  for (let [key, value] of Object.entries(body)) {
    if (typeof value === "string") {
      value = value.trim().toLowerCase();
    }
    formatedBody[key] = value;
  }
  return formatedBody;
};

const validateBody = (body: string[]) => {
  if (body.some((element) => !element)) {
    throw new Error("Body malformed");
  }
};

const validateEmail = (email: string) => {
  const regex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (!regex.test(email)) {
    throw new Error("Email malformed");
  }
};

export { handleSubscription };

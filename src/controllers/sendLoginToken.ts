import { Request, Response } from "express";
import { getUserByEmail } from "../services/db";
import { sendLoginEmail } from "../services/email";
import { generateToken } from "../services/jwt";
import { formatBodyToLowerCase } from "./helper/formater";
import { validateBody, validateEmail } from "./helper/validater";

const handleSendLoginToken = (req: Request, res: Response) => {
  try {
    const { email } = formatBodyToLowerCase(req.body);

    validateBody([email]);
    validateEmail(email);

    const user = getUserByEmail(email);

    if (!user) {
      console.log(`User not found ${email}`);
      res.sendStatus(200).end();
      return;
    }

    const token = generateToken(user.uuid);

    sendLoginEmail(user.email, token);

    res.status(200).end();
  } catch (error: any) {
    res.sendStatus(400).end();
  }
};

export default handleSendLoginToken;

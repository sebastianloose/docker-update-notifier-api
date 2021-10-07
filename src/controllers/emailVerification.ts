import { Request, Response } from "express";
import { verifyUserEmail } from "../services/db";

const handleEmailVerification = (req: Request, res: Response) => {
  const { uuid } = req.body;

  if (!uuid) {
    res.status(400).end();
    return;
  }

  verifyUserEmail(uuid);
  res.status(200).end();
};

export default handleEmailVerification;

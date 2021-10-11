import { Request, Response } from "express";
import { verifyUserEmail } from "../services/db";

const handleEmailVerification = (req: Request, res: Response) => {
  const { uuid } = req.params;

  if (!uuid) {
    res.status(400).end();
    return;
  }

  console.log(`Verifying UUID:${uuid}`);
  verifyUserEmail(uuid);
  res.redirect("https://sebastianloose.de/docker-update-notifier/?verified=1");
};

export default handleEmailVerification;

import { Request, Response } from "express";
import { addSubscription } from "./db";

const handleSubscription = (req: Request, res: Response) => {
  addSubscription({
    mail: req.body.mail,
    organization: req.body.organization,
    repository: req.body.repository,
  });
  res.json(req.body);
};

export { handleSubscription };

import { Request, Response } from "express";
import { getSubscriptionsByEmail, getUserByUuid } from "../services/db";
import { verifyToken } from "../services/jwt";

const handleGetSubscriptions = (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).end();
      return;
    }

    const uuid = verifyToken(token);
    const user = getUserByUuid(uuid);

    if (!user) {
      throw new Error("User not found");
    }

    const subscriptions = getSubscriptionsByEmail(user.email);
    res.json(subscriptions);
  } catch (error: any) {
    res.sendStatus(400);
  }
};

export default handleGetSubscriptions;

import { Request, Response } from "express";
import { getUserByUuid, deleteSubscription } from "../services/db";
import { verifyToken } from "../services/jwt";

const deleteSubscriptionHandler = (req: Request, res: Response) => {
  try {
    const { token, organization, repository } = req.body as {
      token: string;
      organization: string;
      repository: string;
    };

    if (!(token && organization && repository)) {
      res.sendStatus(400);
      return;
    }

    const uuid = verifyToken(token);
    const user = getUserByUuid(uuid);

    if (!user) {
      throw new Error("User not found");
    }

    deleteSubscription(organization, repository, user.email);

    res.sendStatus(200);
  } catch (error: any) {
    res.sendStatus(400);
  }
};
export default deleteSubscriptionHandler;

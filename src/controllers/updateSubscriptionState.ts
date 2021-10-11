import { Request, Response } from "express";
import { getUserByUuid, updateSubscriptionState } from "../services/db";
import { verifyToken } from "../services/jwt";
import { SubscriptionUpdateState } from "../types/subscriptionUpdateStateType";

const updateSubscriptionStateHandler = (req: Request, res: Response) => {
  try {
    const { token, state } = req.body as {
      token: string;
      state: SubscriptionUpdateState;
    };

    if (
      !(
        token &&
        state.organization &&
        state.repository &&
        state.active != undefined
      )
    ) {
      res.sendStatus(400);
      return;
    }

    const uuid = verifyToken(token);
    const user = getUserByUuid(uuid);

    if (!user) {
      throw new Error("User not found");
    }

    updateSubscriptionState(state, user.email);

    res.sendStatus(200);
  } catch (error: any) {
    res.sendStatus(400);
  }
};
export default updateSubscriptionStateHandler;

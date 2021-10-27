import { Request, Response } from "express";
import { addSubscription, getUserByEmail, getUserByUuid } from "../services/db";
import { doesRepositoryExist } from "../services/dockerHub";
import { sendVerificationEmail } from "../services/email";
import { verifyToken } from "../services/jwt";
import { formatBodyToLowerCase } from "./helper/formater";
import { validateBody, validateEmail } from "./helper/validater";

const errorMessages = [
  "Repository not found",
  "User does already exist",
  "Email is not verified",
  "User not found",
];

const createSubscriptionEmailController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, organization, repository } = formatBodyToLowerCase(req.body);

    validateBody([email, organization, repository]);
    validateEmail(email);

    if (getUserByEmail(email)) {
      throw new Error("User does already exist");
    }

    if (!(await doesRepositoryExist(organization, repository))) {
      throw new Error("Repository not found");
    }

    addSubscription({
      email: email,
      organization: organization,
      repository: repository,
    });

    const user = getUserByEmail(email);

    if (!user!.verified) {
      sendVerificationEmail(user!.email, user!.uuid);
      res.send("Email is not verified");
      return;
    }

    res.status(200).end();
  } catch (error: any) {
    if (errorMessages.includes(error.message)) {
      res.status(400).send(error.message);
      return;
    }
    res.status(500).end();
  }
};

const createSubscriptionTokenController = async (
  req: Request,
  res: Response
) => {
  try {
    const { token } = req.body;
    const { organization, repository } = formatBodyToLowerCase(req.body);

    validateBody([token, organization, repository]);

    const uuid = verifyToken(token);
    const user = getUserByUuid(uuid);

    if (!user) {
      throw new Error("User not found");
    }

    if (!(await doesRepositoryExist(organization, repository))) {
      throw new Error("Repository not found");
    }

    addSubscription({
      email: user.email,
      organization: organization,
      repository: repository,
    });

    res.status(200).end();
  } catch (error: any) {
    if (errorMessages.includes(error.message)) {
      res.status(400).send(error.message);
      return;
    }
    res.status(500).end();
  }
};

export { createSubscriptionEmailController, createSubscriptionTokenController };

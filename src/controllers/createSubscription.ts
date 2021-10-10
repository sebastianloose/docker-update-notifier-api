import { Request, Response } from "express";
import { addSubscription, getUserByEmail } from "../services/db";
import { doesRepositoryExist } from "../services/dockerHub";
import { sendVerificationEmail } from "../services/email";
import { formatBodyToLowerCase } from "./helper/formater";
import { validateBody, validateEmail } from "./helper/validater";

const handleSubscription = async (req: Request, res: Response) => {
  try {
    const { email, organization, repository } = formatBodyToLowerCase(req.body);

    validateBody([email, organization, repository]);
    validateEmail(email);

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
      res.send("Verification Email");
      return;
    }

    res.status(200).end();
  } catch (error: any) {
    if (error.message) {
      res.status(400).send(error.message);
      return;
    }
    res.status(500).end();
  }
};

export default handleSubscription;

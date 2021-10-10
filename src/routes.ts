import express from "express";
import createSubscriptionController from "./controllers/createSubscription";
import getSubscriptionsController from "./controllers/getSubscriptions";
import emailVerificationController from "./controllers/emailVerification";
import sendLoginTokenController from "./controllers/sendLoginToken";

const router = express.Router();

router.post("/subscribe", createSubscriptionController);
router.get("/verify/:uuid", emailVerificationController);
router.post("/sendLoginToken", sendLoginTokenController);
router.post("/subscriptions", getSubscriptionsController);

export default router;

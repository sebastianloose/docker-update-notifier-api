import express from "express";
import createSubscriptionController from "./controllers/createSubscription";
import getSubscriptionsController from "./controllers/getSubscriptions";
import emailVerificationController from "./controllers/emailVerification";
import sendLoginTokenController from "./controllers/sendLoginToken";
import updateSubscriptionStateController from "./controllers/updateSubscriptionState";
import deleteSubscriptionController from "./controllers/deleteSubscription";

const router = express.Router();

router.post("/subscribe", createSubscriptionController);
router.get("/verify/:uuid", emailVerificationController);
router.post("/sendLoginToken", sendLoginTokenController);
router.post("/subscriptions", getSubscriptionsController);
router.post("/updateSubscriptionState", updateSubscriptionStateController);
router.post("/deleteSubscription", deleteSubscriptionController);

export default router;

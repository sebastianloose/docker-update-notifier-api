import express from "express";
import subscriptionController from "./controllers/subscription";
import emailVerificationController from "./controllers/emailVerification";
import sendLoginTokenController from "./controllers/sendLoginToken";

const router = express.Router();

router.post("/subscribe", subscriptionController);
router.get("/verify/:uuid", emailVerificationController);
router.post("/sendLoginToken", sendLoginTokenController);

export default router;

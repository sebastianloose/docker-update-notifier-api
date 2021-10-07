import express from "express";
import subscriptionController from "./controllers/subscription";
import emailVerificationController from "./controllers/emailVerification";

const router = express.Router();

router.post("/subscribe", subscriptionController);
router.post("/verifyEmail", emailVerificationController);

export default router;

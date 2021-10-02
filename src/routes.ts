import express from "express";
import { handleSubscription } from "./controller";

const router = express.Router();

router.post("/subscribe", handleSubscription);

export default router;

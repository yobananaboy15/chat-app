import express from "express";
//Importera funktioner från controller
import { renderChat, verifyAccess, getFirstPublicChannel } from "../controllers/chat.js";

const router = express.Router();

router.get("/", getFirstPublicChannel)
router.get("/:id", verifyAccess, renderChat)

export default router;

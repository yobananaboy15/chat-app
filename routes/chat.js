import express from "express";
//Importera funktioner från controller
import { renderChat, verifyAccess } from "../controllers/chat.js";

const router = express.Router();

router.get("/", verifyAccess, renderChat);

export default router;

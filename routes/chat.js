import express from "express";
//Importera funktioner från controller
import { renderChat } from "../controllers/chat.js";

const router = express.Router();

router.get("/", renderChat);

export default router;

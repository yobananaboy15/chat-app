import express from "express";
//Importera funktioner från controller
import { handleLogin, renderLoginPage } from "../controllers/login.js";

const router = express.Router();

router.get("/", renderLoginPage);
router.post("/", handleLogin);

export default router;

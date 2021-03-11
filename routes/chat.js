import express from "express";
//Importera funktioner från controller
import { renderChat, verifyAccess } from "../controllers/chat.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.redirect("/chat/603f9d2db0c39ee46a9a8a5a")
});
router.get("/:id", verifyAccess, renderChat)

export default router;

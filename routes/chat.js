import express from "express";
//Importera funktioner från controller
import { renderChat, verifyAccess } from "../controllers/chat.js";

const router = express.Router();

router.get("/", (req, res) => {
    //Gör ett databasanrop och lägg in den första?
    res.redirect("/chat/603f9d2db0c39ee46a9a8a5a")
});
router.get("/:id", verifyAccess, renderChat)

// router.post("/")

export default router;

import express from 'express';
import {renderRegisterForm, handleRegister, addUser} from "../controllers/register.js"

const router = express.Router();

router.get("/", renderRegisterForm)
router.post("/", handleRegister, addUser)

export default router;

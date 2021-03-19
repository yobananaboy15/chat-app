import express from 'express';
import { renderSettings, uploadAvatar, upload, verifyAccess, changeUserName } from '../controllers/settings.js';

const router = express.Router()

router.get("/:id", verifyAccess, renderSettings)
router.post("/:id/avatar", verifyAccess, upload.single('avatar'), uploadAvatar)
router.post("/:id/username", verifyAccess, changeUserName)

export default router;
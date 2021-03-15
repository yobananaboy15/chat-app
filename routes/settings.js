import express from 'express';
import { renderSettings, uploadAvatar, upload, verifyAccess } from '../controllers/settings.js';

const router = express.Router()

router.get("/:id", verifyAccess, renderSettings)
router.post("/:id", verifyAccess, upload.single('avatar'), uploadAvatar)

export default router;
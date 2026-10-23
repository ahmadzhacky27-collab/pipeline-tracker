import express from 'express';
import { getUsers, updateUserRole } from '../controllers/userController.js';
// Jika Anda sudah memiliki middleware autentikasi/otorisasi admin, import di sini

const router = express.Router();

// GET /api/v1/users (bisa dengan query ?role=editor)
router.get('/', getUsers);

// PATCH /api/v1/users/:id/role (ubah role pengguna)
router.patch('/:id/role', updateUserRole);

export default router;
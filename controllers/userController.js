import prisma from '../config/prisma.js';

// 1. Mendapatkan daftar pengguna (bisa difilter berdasarkan role, misal ?role=editor)
export const getUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const filter = role ? { role } : {};

        const users = await prisma.user.findMany({
            where: filter,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        return res.status(200).json(users);

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to fetch users",
            error: error.message
        });
    }
};

// 2. Mengubah role pengguna (Khusus Admin)
export const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        // Validasi role yang diperbolehkan
        const validRoles = ['creator', 'editor', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                status: false,
                message: "Invalid role value. Allowed: creator, editor, admin"
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        return res.status(200).json(updatedUser);
        
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to update user role",
            error: error.message
        });
    }
};
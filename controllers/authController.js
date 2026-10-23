import prisma from '../config/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// 1. Register Pengguna Baru
export const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Blokir pendaftaran langsung sebagai admin
        if (role === 'admin') {
            return res.status(400).json({
                status: false,
                message: "Registration as admin is not allowed."
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                status: false,
                message: "Email is already registered"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Validasi role hanya creator atau editor
        const userRole = (role === 'editor') ? 'editor' : 'creator';

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role: userRole
            }
        });

        return res.status(201).json({
            status: true,
            message: "User registered successfully",
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Registration failed",
            error: error.message
        });
    }
};

// 2. Login Pengguna
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ 
                status: false, 
                message: "Invalid email or password" 
            });
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            return res.status(400).json({ 
                status: false, 
                message: "Invalid email or password" 
            });
        }

        // Menggunakan JWT Secret dari file .env
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'default_secret_fallback',
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            status: true,
            message: "Login successful",
            token,
            data: { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            }
        });
    } catch (error) {
        return res.status(500).json({ 
            status: false, 
            message: "Login failed", 
            error: error.message 
        });
    }
};
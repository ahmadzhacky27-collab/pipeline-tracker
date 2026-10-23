import prisma from '../config/prisma.js';

// 1. Mendapatkan semua konten / pipeline
export const getContents = async (req, res) => {
    try {
        const contents = await prisma.content.findMany({
            include: {
                creator: { select: { id: true, name: true, email: true } },
                editor: { select: { id: true, name: true, email: true } },
                channel: true
            }
        });

        return res.status(200).json({
            status: true,
            message: "Contents fetched successfully",
            data: contents
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to fetch contents",
            error: error.message
        });
    }
};

// 2. Membuat konten baru
export const createContent = async (req, res) => {
    try {
        const { title, description, channelId, status } = req.body;
        const creatorId = req.user.id; // Diambil dari middleware JWT Auth

        const newContent = await prisma.content.create({
            data: {
                title,
                description,
                channelId: Number(channelId),
                creatorId: Number(creatorId),
                status: status || 'DRAFT'
            }
        });

        return res.status(201).json({
            status: true,
            message: "Content created successfully",
            data: newContent
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to create content",
            error: error.message
        });
    }
};


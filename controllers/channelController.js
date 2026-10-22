import prisma from '../config/prisma.js';

// 1. Tambah Channel Baru
export const createChannel = async (req, res) => {
    const { userId, platform, handleName } = req.body;

    if (!userId || !platform || !handleName) {
        return res.status(400).json({
            status: false,
            message: "userId, platform, and handleName are required fields.",
        });
    }

    try {
        const newChannel = await prisma.channel.create({
            data: {
                userId: Number(userId),
                platform,
                handleName
            }
        });

        return res.status(201).json({
            status: true,
            message: "Channel created successfully",
            data: newChannel,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to create channel",
            error: error.message,
        });
    }
};

// 2. Ambil Daftar Channel
export const getChannels = async (req, res) => {
    const { userId } = req.query;

    try {
        const channels = await prisma.channel.findMany({
            where: userId ? { userId: Number(userId) } : undefined,
            orderBy: { createdAt: 'desc' }
        });

        return res.status(200).json({
            status: true,
            message: "Fetch channels success",
            total: channels.length,
            data: channels,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to fetch channels",
            error: error.message,
        });
    }
};
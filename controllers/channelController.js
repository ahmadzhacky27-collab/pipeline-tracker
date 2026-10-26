import prisma from '../config/prisma.js';

// 1. Tambah Channel Baru
export const createChannel = async (req, res) => {
    try {
        const { platform, handle_name } = req.body;
        const userId = req.user?.id;

        if (!platform || !handle_name) {
            return res.status(400).json({
                status: false,
                message: "platform and handle_name are required fields.",
            });
        }

        const newChannel = await prisma.channel.create({
            data: {
                platform,
                handleName: handle_name,
                userId
            }
        });

        return res.status(201).json({
            ...newChannel,
            handle_name: newChannel.handleName
        });

    } catch (error) {        
        return res.status(500).json({
            status: false,
            message: "Failed to create channel",
            error: error.message,
        });
    }
};

// 2. Ambil Daftar Channel (Admin lihat semua, User biasa lihat miliknya sendiri)
export const getChannels = async (req, res) => {    
    try {
        const whereCondition = req.user.role === 'admin' ? {} : { userId: req.user.id };

        const channels = await prisma.channel.findMany({
            where: whereCondition,
            orderBy: { createdAt: "desc" }
        });

        const formattedChannels = channels.map((channel) => ({
            ...channel,
            handle_name: channel.handleName
        }));
        
        return res.status(200).json(formattedChannels);

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to fetch channels",
            error: error.message,
        });
    }
};
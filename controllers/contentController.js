import prisma from '../config/prisma.js';

// 1. Mendapatkan semua konten (Dilengkapi Filter & Search)
export const getContents = async (req, res) => {
    try {
        const { status, channelId, search } = req.query;

        // Menyusun kondisi filter dinamis
        const whereClause = {};

        // Filter berdasarkan Status
        if (status) {
            whereClause.status = status;
        }

        // Filter berdasarkan Channel
        if (channelId) {
            whereClause.channelId = Number(channelId);
        }

        // Filter / Search berdasarkan Judul
        if (search) {
            whereClause.title = {
                contains: search,
            };
        }

        const contents = await prisma.content.findMany({
            where: whereClause,
            include: {
                user: { select: { id: true, name: true, email: true } },
                editor: { select: { id: true, name: true, email: true } },
                channel: { select: { id: true, platform: true, handleName: true } }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json(contents);

    } catch (error) {
        console.error("Error getContents:", error);
        return res.status(500).json({
            status: false,
            message: "Failed to fetch contents",
            error: error.message
        });
    }
};

// Mendapatkan detail konten berdasarkan ID
export const getContentById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validasi jika id tidak ada atau bukan angka yang valid
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({
                status: false,
                message: "Invalid or missing content ID"
            });
        }

        const content = await prisma.content.findUnique({
            where: { id: Number(id) },
            include: {
                user: { select: { id: true, name: true, email: true } },
                editor: { select: { id: true, name: true, email: true } },
                channel: { select: { id: true, platform: true, handleName: true } }
            }
        });

        if (!content) {
            return res.status(404).json({
                status: false,
                message: "Content not found"
            });
        }

        return res.status(200).json(content);
    } catch (error) {
        console.error("Error getContentById:", error);
        return res.status(500).json({
            status: false,
            message: "Failed to fetch content detail",
            error: error.message
        });
    }
};

// 2. Membuat konten baru
export const createContent = async (req, res) => {
    try {
        const {
            title,
            format_type,
            channel_id,
            editor_id,
            status,
            scheduled_date, 
            description,    
            script_draft    
        } = req.body;

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized. User ID not found."
            });
        }

        // Simpan ke database Prisma dengan mapping dan sanitasi data yang aman
        const newContent = await prisma.content.create({
            data: {
                title,
                formatType: format_type,
                channelId: channel_id && channel_id !== "" ? Number(channel_id) : null,
                editorId: editor_id && editor_id !== "" ? Number(editor_id) : null,
                status: status || "idea",
                description: description || null,        
                scriptDraft: script_draft || null,      
                scheduledAt: scheduled_date && scheduled_date !== "" ? new Date(scheduled_date) : null, 
                userId
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                editor: { select: { id: true, name: true, email: true } },
                channel: { select: { id: true, platform: true, handleName: true } }
            }
        });

        return res.status(201).json(newContent);

    } catch (error) {
        console.error("Error createContent:", error);
        return res.status(500).json({
            status: false,
            message: "Failed to create content",
            error: error.message
        });
    }
};
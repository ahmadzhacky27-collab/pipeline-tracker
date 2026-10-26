import prisma from '../config/prisma.js';

// 1. Mendapatkan semua konten (Backend menyesuaikan frontend sepenuhnya)
export const getContents = async (req, res) => {
    try {
        const { status, channel_id, format_type, search } = req.query;

        // Menyusun kondisi filter dinamis
        const whereClause = {};

        // Filter berdasarkan Role (Admin lihat semua, User biasa lihat miliknya sendiri)
        if (req.user.role !== 'admin') {
            whereClause.userId = req.user.id;
        }

        // Filter berdasarkan Status
        if (status && status !== "all" && status !== "") {
            whereClause.status = status;
        }

        // Filter berdasarkan Channel ID (mengikuti frontend: channel_id)
        if (channel_id && channel_id !== "" && channel_id !== "all") {
            whereClause.channelId = Number(channel_id);
        }

        // Filter berdasarkan Format Type (mengikuti frontend: format_type)
        if (format_type && format_type !== "" && format_type !== "all") {
            whereClause.formatType = format_type;
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
                creator: { select: { id: true, name: true, email: true } },
                editor: { select: { id: true, name: true, email: true } },
                channel: { select: { id: true, platform: true, handleName: true } }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // 🔥 Mapping data: Format tanggal agar dibaca valid oleh frontend
        const formattedContents = contents.map((content) => ({
            ...content,
            format_type: content.formatType,
            // Jika scheduledAt ada, ubah ke string "YYYY-MM-DD", jika null/kosong kirim null
            scheduled_date: content.scheduledAt ? new Date(content.scheduledAt).toISOString().split('T')[0] : null
        }));

        return res.status(200).json(formattedContents);

    } catch (error) {
        console.error("Error getContents:", error);
        return res.status(500).json({
            status: false,
            message: "Failed to fetch contents",
            error: error.message
        });
    }
};

// 2. Mendapatkan detail konten berdasarkan ID
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
                creator: { select: { id: true, name: true, email: true } }, // 👈 Diubah dari user ke creator
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

// 3. Membuat konten baru
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
                creator: { select: { id: true, name: true, email: true } },
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
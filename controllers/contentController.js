import prisma from '../config/prisma.js';

// 1. Get content
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

        // Filter berdasarkan Channel ID
        if (channel_id && channel_id !== "" && channel_id !== "all") {
            whereClause.channelId = Number(channel_id);
        }

        // Filter berdasarkan Format Type
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

        // Mapping data format tanggal
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

// 2. Get content by id
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
                creator: { select: { id: true, name: true, email: true } },
                editor: { select: { id: true, name: true, email: true } },
                channel: { select: { id: true, platform: true, handleName: true } },
                checklists: true,
                metrics: true,
                reviews: true
            }
        });

        if (!content) {
            return res.status(404).json({
                status: false,
                message: "Content not found"
            });
        }

        // Mapping data agar properti snake_case sesuai dengan state form di Frontend
        const formattedContent = {
            ...content,
            format_type: content.formatType, // Frontend membaca format_type
            scheduled_date: content.scheduledAt ? new Date(content.scheduledAt).toISOString().split('T')[0] : "", // Format YYYY-MM-DD untuk input date
            published_date: content.publishedAt ? new Date(content.publishedAt).toISOString().split('T')[0] : "",
            channel_id: content.channelId ? String(content.channelId) : "", // Disesuaikan jadi string/number untuk select option
            editor_id: content.editorId ? String(content.editorId) : ""
        };

        return res.status(200).json(formattedContent);
    } catch (error) {
        console.error("Error getContentById:", error);
        return res.status(500).json({
            status: false,
            message: "Failed to fetch content detail",
            error: error.message
        });
    }
};

// 3. Create content
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

// 4. Memperbarui / Transisi Status Konten Validasi URL Published
export const updateContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            title, 
            format_type, 
            channel_id, 
            editor_id, 
            status, 
            priority, 
            scheduled_date, 
            published_date, 
            published_url, 
            description, 
            script_draft 
        } = req.body;

        const existingContent = await prisma.content.findUnique({ where: { id: Number(id) } });
        if (!existingContent) {
            return res.status(404).json({ status: false, message: "Content not found" });
        }

        const targetStatus = status || existingContent.status;
        const targetUrl = published_url !== undefined ? published_url : existingContent.publishedUrl;

        // Validasi aturan bisnis: Status published wajib memiliki published_url yang valid
        if (targetStatus === 'published' && (!targetUrl || targetUrl.trim() === '')) {
            return res.status(400).json({ 
                status: false, 
                message: "Konten ditolak ganti status ke published jika published_url kosong atau bukan tautan valid." 
            });
        }

        const updatedContent = await prisma.content.update({
            where: { id: Number(id) },
            data: {
                title: title !== undefined ? title : existingContent.title,
                formatType: format_type !== undefined ? format_type : existingContent.formatType,
                channelId: channel_id !== undefined ? (channel_id ? Number(channel_id) : null) : existingContent.channelId,
                editorId: editor_id !== undefined ? (editor_id ? Number(editor_id) : null) : existingContent.editorId,
                status: targetStatus,
                priority: priority !== undefined ? priority : existingContent.priority,
                scheduledAt: scheduled_date ? new Date(scheduled_date) : (scheduled_date === null ? null : existingContent.scheduledAt),
                publishedAt: published_date ? new Date(published_date) : (published_date === null ? null : existingContent.publishedAt),
                publishedUrl: targetUrl,
                description: description !== undefined ? description : existingContent.description,
                scriptDraft: script_draft !== undefined ? script_draft : existingContent.scriptDraft
            },
            include: {
                creator: { select: { id: true, name: true, email: true } },
                editor: { select: { id: true, name: true, email: true } },
                channel: { select: { id: true, platform: true, handleName: true } }
            }
        });

        return res.status(200).json({
            status: true,
            message: "Content successfully updated",
            data: updatedContent
        });

    } catch (error) {
        console.error("Error updateContent:", error);
        return res.status(500).json({
            status: false,
            message: "Failed to update content",
            error: error.message
        });
    }
};

// 5. Menghapus Konten Beserta Relasi Turunannya (Cascade Delete)
export const deleteContent = async (req, res) => {
    try {
        const { id } = req.params;

        const existingContent = await prisma.content.findUnique({ where: { id: Number(id) } });
        if (!existingContent) {
            return res.status(404).json({ status: false, message: "Content not found" });
        }

        await prisma.content.delete({ where: { id: Number(id) } });

        return res.status(200).json({
            status: true,
            message: "Content successfully deleted"
        });

    } catch (error) {
        console.error("Error deleteContent:", error);
        return res.status(500).json({
            status: false,
            message: "Failed to delete content",
            error: error.message
        });
    }
};
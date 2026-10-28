import prisma from '../config/prisma.js';

// 1. Menambah item checklist produksi pada konten tertentu
export const addChecklist = async (req, res) => {
    try {
        const { id } = req.params; // ID Content
        const { task_name } = req.body; // Dari payload frontend

        const taskText = task_name || req.body.task;

        if (!taskText || taskText.trim() === '') {
            return res.status(400).json({ 
                status: false, 
                message: "Nama tugas wajib diisi" 
            });
        }

        // Pastikan kontennya ada
        const content = await prisma.content.findUnique({ where: { id: Number(id) } });
        if (!content) {
            return res.status(404).json({ status: false, message: "Konten tidak ditemukan" });
        }

        // Buat checklist baru di database
        const newChecklist = await prisma.checklist.create({
            data: {
                contentId: Number(id),
                task: taskText,
                isDone: false
            }
        });

        // 🔥 Kembalikan object newChecklist secara langsung agar item.id terbaca di frontend
        return res.status(201).json(newChecklist);
    } catch (error) {
        console.error("Error addChecklist:", error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

// 2. Toggle status selesai (isDone) checklist
export const toggleChecklist = async (req, res) => {
    try {
        const { id } = req.params; // ID Checklist
        const checklist = await prisma.checklist.findUnique({ where: { id: Number(id) } });
        
        if (!checklist) {
            return res.status(404).json({ status: false, message: "Checklist tidak ditemukan" });
        }

        const updated = await prisma.checklist.update({
            where: { id: Number(id) },
            data: { isDone: !checklist.isDone }
        });

        return res.status(200).json(updated);
    } catch (error) {
        console.error("Error toggleChecklist:", error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

// 3. Menghapus item checklist
export const deleteChecklist = async (req, res) => {
    try {
        const { id } = req.params; // ID Checklist
        const checklist = await prisma.checklist.findUnique({ where: { id: Number(id) } });
        
        if (!checklist) {
            return res.status(404).json({ status: false, message: "Checklist tidak ditemukan" });
        }

        await prisma.checklist.delete({ where: { id: Number(id) } });

        return res.status(200).json({
            status: true,
            message: "Checklist berhasil dihapus"
        });
    } catch (error) {
        console.error("Error deleteChecklist:", error);
        return res.status(500).json({ status: false, message: error.message });
    }
};
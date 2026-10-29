import { PrismaClient } from '../src/generated/prisma/index.js';
const prisma = new PrismaClient();

// 1. Editor mengirim link hasil editing
export const submitReview = async (req, res) => {
  try {
    const { id } = req.params; // ID Content
    const reviewUrl = req.body.reviewUrl || req.body.review_url;
    const userId = req.user.id; // Dari middleware auth

    if (!reviewUrl) {
      return res.status(400).json({ message: 'Link hasil editing wajib diisi' });
    }

    // Ambil data konten terlebih dahulu untuk pengecekan editor
    const existingContent = await prisma.content.findUnique({
      where: { id: Number(id) },
    });

    if (!existingContent) {
      return res.status(404).json({ message: 'Konten tidak ditemukan' });
    }

    // Siapkan data update menggunakan relasi Prisma
    const updateData = {
      reviewUrl,
      status: 'in_review',
    };
    
    // Cek apakah editor belum diset (sesuaikan dengan field di DB lu: editorId atau editor)
    if (!existingContent.editorId) {
      updateData.editor = {
        connect: { id: Number(userId) },
      };
    }

    const updatedContent = await prisma.content.update({
      where: { id: Number(id) },
      data: updateData,
    });

    await prisma.contentReview.create({
      data: {
        contentId: Number(id),
        userId: Number(userId),
        action: 'submitted',
        reviewUrl,
      },
    });

    return res.status(200).json({
      message: 'Link berhasil dikirim untuk review',
      data: updatedContent,
    });
  } catch (error) {
    console.error('Error submit review:', error);
    return res.status(500).json({ message: 'Gagal mengirim link review', error: error.message });
  }
};

// 2. Kreator / Admin menyetujui atau minta revisi
export const processReview = async (req, res) => {
  try {
    const { id } = req.params; // ID Content
    const { action, note } = req.body; // action: 'approved' atau 'revision_requested'
    const userId = req.user.id;

    if (!['approved', 'revision_requested'].includes(action)) {
      return res.status(400).json({ message: 'Aksi review tidak valid (gunakan approved / revision_requested)' });
    }

    const newStatus = action === 'approved' ? 'ready' : 'revision';

    const updatedContent = await prisma.content.update({
      where: { id: Number(id) },
      data: {
        status: newStatus,
        reviewNote: note || null,
      },
    });

    await prisma.contentReview.create({
      data: {
        contentId: Number(id),
        userId: Number(userId),
        action,
        note: note || null,
      },
    });

    return res.status(200).json({
      message: action === 'approved' ? 'Konten disetujui (Ready)' : 'Permintaan revisi dikirim',
      data: updatedContent,
    });
  } catch (error) {
    console.error('Error process review:', error);
    return res.status(500).json({ message: 'Gagal memproses review', error: error.message });
  }
};
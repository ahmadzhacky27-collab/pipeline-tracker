import { PrismaClient } from '../src/generated/prisma/index.js';
const prisma = new PrismaClient();

// 1. Mencatat atau memperbarui metrik performa konten
export const upsertMetric = async (req, res) => {
  try {
    const { id } = req.params; // ID Content
    const { viewsCount, likesCount, commentsCount, sharesCount } = req.body;

    // Pastikan konten ada
    const content = await prisma.content.findUnique({
      where: { id: Number(id) },
    });

    if (!content) {
      return res.status(404).json({ message: 'Konten tidak ditemukan' });
    }

    // Karena relasi metric bisa jadi banyak (riwayat pencatatan) atau satu per konten, 
    // mari kita buat pencatatan baru (atau update jika ingin satu record per konten).
    // Di sini kita gunakan create untuk mencatat histori performa berkala.
    const newMetric = await prisma.metric.create({
      data: {
        contentId: Number(id),
        viewsCount: viewsCount || 0,
        likesCount: likesCount || 0,
        commentsCount: commentsCount || 0,
        sharesCount: sharesCount || 0,
      },
    });

    return res.status(201).json({
      message: 'Metrik performa berhasil dicatat',
      data: newMetric,
    });
  } catch (error) {
    console.error('Error upsert metric:', error);
    return res.status(500).json({ message: 'Gagal mencatat metrik', error: error.message });
  }
};

// 2. Mengambil riwayat metrik suatu konten
export const getMetricsByContent = async (req, res) => {
  try {
    const { id } = req.params; // ID Content

    const metrics = await prisma.metric.findMany({
      where: { contentId: Number(id) },
      orderBy: { recordedAt: 'desc' },
    });

    return res.status(200).json({
      message: 'Berhasil mengambil data metrik',
      data: metrics,
    });
  } catch (error) {
    console.error('Error get metrics:', error);
    return res.status(500).json({ message: 'Gagal mengambil data metrik', error: error.message });
  }
};
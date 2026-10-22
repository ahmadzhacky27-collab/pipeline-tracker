import { PrismaClient } from '../src/generated/prisma/index.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('SEEDER DIMULAI...'); // Pastikan baris ini ada di paling atas

    // Hapus data lama (urutan penting agar tidak kena foreign key constraint)
    await prisma.metric.deleteMany();
    await prisma.checklist.deleteMany();
    await prisma.content.deleteMany();
    await prisma.channel.deleteMany();
    await prisma.user.deleteMany();

    // Buat Akun Dummy
    const hashedPassword = await bcrypt.hash('12345678', 10);
    const dummyUser = await prisma.user.create({
        data: {
            name: 'PPKDJP',
            email: 'ppkdjp@gmail.com',
            passwordHash: hashedPassword,
            role: 'creator',
        },
    });
    console.log(`User dummy dibuat: ${dummyUser.email}`);

    // Buat 2 Channel Dummy
    const channel1 = await prisma.channel.create({
        data: {
            userId: dummyUser.id,
            platform: 'YouTube',
            handleName: '@ppkdjp',
        },
    });

    const channel2 = await prisma.channel.create({
        data: {
            userId: dummyUser.id,
            platform: 'TikTok',
            handleName: '@ppkdjp',
        },
    });
    console.log('Channel dummy berhasil dibuat.');

    // Buat 3 Contoh Konten
    await prisma.content.create({
        data: {
            userId: dummyUser.id,
            channelId: channel1.id,
            title: 'Review Setup PC Gaming Terbaru 2026',
            description: 'Membahas spesifikasi PC custom rakitan dengan Ryzen 5 dan RX 6600.',
            scriptDraft: 'Halo semuanya, selamat datang kembali di channel saya...',
            formatType: 'Long-form Video',
            priority: 'high',
            status: 'published',
        },
    });

    await prisma.content.create({
        data: {
            userId: dummyUser.id,
            channelId: channel2.id,
            title: 'Tips Setting OBS Studio Anti Lag',
            description: 'Tutorial singkat cara setting bitrate untuk live streaming TikTok.',
            scriptDraft: 'Mau live streaming tapi patah-patah? Begini caranya...',
            formatType: 'Short/Reels',
            priority: 'medium',
            status: 'in_progress',
        },
    });

    await prisma.content.create({
        data: {
            userId: dummyUser.id,
            channelId: channel1.id,
            title: 'Vlog Aktivitas Sehari-hari Backend Developer',
            description: 'Mengintip keseharian membangun REST API menggunakan Node.js dan Express.',
            scriptDraft: 'Jam 8 pagi mulai ngopi dan buka VS Code...',
            formatType: 'Vlog',
            priority: 'low',
            status: 'idea',
        },
    });

    console.log('Contoh konten berhasil dibuat.');
    console.log('Seeding selesai!');
}

main()
    .catch((e) => {
        console.error('Terjadi kesalahan saat seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
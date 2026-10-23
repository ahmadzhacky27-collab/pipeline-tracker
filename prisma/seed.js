import { PrismaClient } from '../src/generated/prisma/index.js';
import bcrypt from 'bcrypt';


const prisma = new PrismaClient();

async function main() {
    console.log('seeding start');

    // 1. Hash password default 'password123'
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    // 2. USER
    const creator = await prisma.user.upsert({
        where: { email: 'creator@demo.id' },
        update: {},
        create: {
            name: 'Demo Creator',
            email: 'creator@demo.id',
            passwordHash: defaultPassword,
            role: 'creator',
        },
    });

    const editor = await prisma.user.upsert({
        where: { email: 'editor@demo.id' },
        update: {},
        create: {
            name: 'Demo Editor',
            email: 'editor@demo.id',
            passwordHash: defaultPassword,
            role: 'editor',
        },
    });

    const admin = await prisma.user.upsert({
        where: { email: 'admin@demo.id' },
        update: {},
        create: {
            name: 'Demo Admin',
            email: 'admin@demo.id',
            passwordHash: defaultPassword,
            role: 'admin',
        },
    });

    console.log('User demo berhasil dibuat:');
    console.log('creator@demo.id (Password: password123)');
    console.log('editor@demo.id (Password: password123)');
    console.log('admin@demo.id (Password: password123)');

    // 3. CHANNEL
    const channel1 = await prisma.channel.create({
        data: {
            userId: creator.id,
            platform: 'YouTube',
            handleName: '@DemoChannelYT',
        },
    });

    // 4. CONTENT
    const content1 = await prisma.content.create({
        data: {
            userId: creator.id,
            channelId: channel1.id,
            editorId: editor.id,
            title: 'Setup studio rumahan',
            description: 'Panduan membangun studio rekaman dengan budget minim.',
            formatType: 'long',
            status: 'editing',
            priority: 'high',
        },
    });

    // 5. CHECKLIST
    await prisma.checklist.createMany({
        data: [
            { contentId: content1.id, task: 'Menulis naskah video', isDone: true },
            { contentId: content1.id, task: 'Rekam pencahayaan & mic', isDone: true },
            { contentId: content1.id, task: 'Editing warna & audio', isDone: false },
        ],
    });

    console.log('seeding end');
}

main()
    .catch((e) => {
        console.error('Error saat seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
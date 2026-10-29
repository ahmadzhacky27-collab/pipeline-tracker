CCP BACKEND CONTENT CREATOR PIPELINE
Backend API untuk aplikasi Content Creator Pipeline Tracker, dibangun menggunakan Node.js, Express, Prisma ORM, dan MySQL.

PRASYARAT
Sebelum memulai, pastikan komputer Anda telah menginstal perangkat lunak berikut:
1.  Node.js (Versi LTS yang direkomendasikan, misal v18+)
2.  npm (Manajer paket Node.js)
3.  XAMPP / MySQL Server (Untuk menjalankan database relasional MySQL)

PANDUAN INSTALASI LOKAL
Ikuti langkah-langkah di bawah ini untuk menyiapkan dan menjalankan proyek di lingkungan lokal Anda:
1.  Kloning Repositori & Masuk ke Direktori Proyek
    - git clone <url-repositori-anda>
    - cd ccp-backend
2.  Instal seluruh modul dan pustaka yang dibutuhkan menggunakan npm:
    - npm install
3.  Buat file .env di root direktori proyek Anda dengan meniru struktur dari contoh yang ada atau buat baru:
    PORT=5000
    DATABASE_URL="mysql://root:@localhost:3306/nama_database_anda"
    WT_SECRET="kunci_rahasia_jwt_anda"
4.  Lakukan migrasi skema database ke MySQL menggunakan Prisma ORM:
    - npx prisma migrate dev --name init
    Jika Anda memerlukan proses generate Prisma Client secara manual, jalankan:
    - npx prisma generate
    Jika proyek Anda memiliki data seeding awal untuk mengisi data dummy (seperti akun atau data master):
    - npm run seed

CARA MENJALANKAN SERVER
1.  Anda dapat menjalankan server dalam mode pengembangan (development mode) menggunakan nodemon agar server melakukan restart otomatis saat ada perubahan file:
    - npx nodemon index.js
2.  Atau jika sudah diset di package.json:
    - npm run dev

DAFTAR ENDPOINT UTAMA API ROUTES
1.  Autentikasi (/api/v1/auth)
    - POST /register - Mendaftar pengguna baru
    - POST /login - Masuk dan mendapatkan token JWT
2.  Pengguna (/api/v1/users)
    - GET / - Mengambil daftar pengguna
3.  Channel (/api/v1/channels)
    - GET /, POST /, dll. - Manajemen platform channel
4.  Konten & Review (/api/v1/contents)
    - GET / - Mengambil daftar konten
    - POST /:id/submit - Editor mengirim link hasil review
    - POST /:id/process - Admin/Kreator menyetujui atau meminta revisi
    - POST /:id/metrics - Mencatat metrik performa konten
    - GET /:id/metrics - Melihat riwayat metrik konten

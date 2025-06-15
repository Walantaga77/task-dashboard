📌 Task Management System

📖 Deskripsi Proyek

Task Management System adalah aplikasi berbasis web yang memungkinkan pengguna untuk membuat, mengelola, dan melacak tugas dengan berbagai fitur seperti CRUD, pencarian, filter, sorting, dan pagination. Aplikasi ini menggunakan React.js, TypeScript, dan React Query untuk pengelolaan state yang efisien.

🚀 Fitur Utama

✅ 1. Manajemen Tugas (CRUD)

Create: Pengguna dapat menambahkan tugas baru dengan memasukkan judul, deskripsi, status, due date, priority, dan assignee.

Read: Semua tugas ditampilkan dalam tabel dengan informasi detail.

Update: Pengguna dapat mengedit tugas yang sudah dibuat melalui modal update.

Delete: Pengguna dapat menghapus tugas dari daftar.

🔍 2. Pencarian & Filter

Pencarian: Pengguna dapat mencari tugas berdasarkan judul.

Filter:

Status: Todo, In Progress, Done.

Priority: Low, Medium, High.

Tanggal Deadline: Sesuai rentang yang dipilih.

📊 3. Sorting & Pagination

Sorting: Urutkan tugas berdasarkan judul, priority, atau tanggal deadline secara ascending/descending.

Pagination: Pengguna dapat memilih jumlah tugas yang ditampilkan per halaman (10, 25, 50).

Navigasi Halaman: Gunakan tombol Next dan Previous untuk berpindah halaman.

🔐 4. Autentikasi Pengguna

Login & Logout: Pengguna harus login dengan email dan password sebelum mengakses dashboard.

Role-based Access:

Admin: Memiliki akses penuh untuk mengelola tugas dan melihat semua data.

User: Hanya bisa melihat dan mengedit tugas yang ditugaskan kepadanya.

🔄 5. Optimistic Update & Data Caching

React Query digunakan untuk caching data, sehingga meningkatkan performa dan mengurangi jumlah permintaan ke server.

Optimistic Update: Saat melakukan update tugas, UI langsung diperbarui sebelum request ke server selesai.

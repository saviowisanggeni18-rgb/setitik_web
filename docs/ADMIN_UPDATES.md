# Modul Admin Konten

Modul ini membuat owner bisa mengelola homepage dari halaman `/admin` tanpa menyentuh kode.
Owner bisa menampilkan/menyembunyikan bagian homepage, mengubah urutan, menambah section custom,
dan menerbitkan foto kegiatan untuk bagian update terbaru.

## 1. Siapkan Supabase

1. Buat project di Supabase.
2. Buka menu SQL Editor.
3. Jalankan isi file `supabase-site-updates.sql`.
4. Pastikan bucket `site-updates` sudah ada dan bersifat public.

## 2. Isi environment variable

Tambahkan variable berikut di file `.env.local` untuk development, dan di dashboard hosting untuk production.

```env
NEXT_PUBLIC_SUPABASE_URL=https://project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=isi_service_role_key_dari_supabase
SUPABASE_UPDATES_BUCKET=site-updates
ADMIN_PASSWORD=ganti_dengan_password_owner
```

Catatan penting:

- `SUPABASE_SERVICE_ROLE_KEY` hanya boleh disimpan di server atau dashboard hosting. Jangan ditulis di frontend.
- `ADMIN_PASSWORD` adalah password yang dimasukkan owner di halaman `/admin`.
- Kalau bucket memakai nama lain, sesuaikan `SUPABASE_UPDATES_BUCKET`.

## 3. Cara owner memakai dashboard

1. Buka `/admin`.
2. Masukkan password admin.
3. Di tab `Susunan beranda`, gunakan tombol panah untuk mengubah urutan section.
4. Gunakan tombol mata untuk menampilkan atau menyembunyikan section.
5. Tambahkan section custom jika owner membutuhkan pengumuman, promo, atau blok cerita baru.
6. Di tab `Update foto`, isi judul, tanggal, deskripsi, dan pilih foto.
7. Cek hasilnya di homepage.

Owner juga bisa menghapus update dari daftar di halaman admin.

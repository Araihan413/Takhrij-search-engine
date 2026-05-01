# Takhrij - Hadith Search Engine

Takhrij adalah mesin pencari hadis yang cepat, akurat, dan modern. Dirancang untuk memudahkan para peneliti dan penuntut ilmu dalam menemukan hadis dari berbagai kitab rujukan dengan antarmuka yang bersih dan fungsional.

## 🚀 Fitur Utama

- **Pencarian Cepat**: Menggunakan engine Whoosh untuk pencarian teks yang sangat responsif.
- **Koreksi Typo (Did you mean?)**: Memberikan saran kata kunci jika terjadi kesalahan pengetikan.
- **Hadis Serupa**: Menemukan hadis-hadis yang berkaitan secara kontekstual menggunakan algoritma *More Like This*.
- **Filter Kitab**: Memfilter hasil pencarian berdasarkan kitab-kitab perawi tertentu.
- **Detail Hadis Komprehensif**: Menampilkan teks Arab asli, terjemahan, derajat hadis, dan bab terkait.
- **Mode Gelap/Terang**: Antarmuka yang nyaman di mata dengan dukungan tema dinamis.

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16+ (App Router)
- React 19
- Tailwind CSS v4
- Lucide Icons & Framer Motion (Subtle animations)

**Backend:**
- Python 3.x
- FastAPI
- Whoosh (Full-text Search Engine)
- Pandas (Data Processing)

**Infrastruktur:**
- pnpm (Package Manager)
- Turborepo (Monorepo Management)

## 📦 Struktur Proyek

```text
takhrij-monorepo/
├── apps/
│   ├── web/          # Frontend Next.js
│   └── api/          # Backend FastAPI
├── data/
│   └── index/        # Database Index Whoosh (diabaikan git)
├── package.json      # Konfigurasi Monorepo
└── README.md
```

## ⚙️ Cara Setup & Instalasi

### 1. Prasyarat
Pastikan Anda sudah menginstal:
- [Node.js 18+](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation)
- [Python 3.10+](https://www.python.org/)

### 2. Persiapan Data
Proyek ini membutuhkan file dataset hadis dalam format CSV agar mesin pencari dapat bekerja.
1. Unduh file `data_hadis.csv` dari [Link Google Drive Ini](https://example.com/link-gdrive-anda).
2. Letakkan file tersebut di dalam direktori: `apps/api/`
3. Pastikan nama file tetap `data_hadis.csv`.

### 3. Instalasi Dependensi
Jalankan perintah berikut di root direktori:
```bash
pnpm install
```

### 3. Setup Backend
Masuk ke direktori API dan buat virtual environment:
```bash
cd apps/api
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Inisialisasi Data
Pastikan Anda memiliki file `data_hadis.csv` di folder `apps/api/`. Kemudian jalankan:
```bash
# Inisialisasi index baru
python init_index.py

# Masukkan data dari CSV ke index
python ingest_data.py
```

### 5. Menjalankan Aplikasi
Kembali ke root direktori dan jalankan semua layanan secara bersamaan:
```bash
pnpm dev
```
- Frontend akan berjalan di: `http://localhost:3000`
- Backend akan berjalan di: `http://localhost:8000`

## 📄 Lisensi
Proyek ini dikembangkan untuk tujuan portofolio dan edukasi.

---
Handcrafted with ❤️ for Hadith Scholars.

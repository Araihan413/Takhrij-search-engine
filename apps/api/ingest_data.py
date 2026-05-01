import os
import pandas as pd
from whoosh.index import open_dir, exists_in
from whoosh.writing import AsyncWriter

# --- KONFIGURASI MAPPING KOLOM ---
# Menggunakan kolom dari CSV Anda: Perawi_ID, Nama_Perawi, Nomor_Hadits, Teks_Arab, Terjemahan, Derajat, Bab
COLUMN_MAPPING = {
    'kitab': 'Nama_Perawi',      # Nama Perawi / Kitab
    'nomor': 'Nomor_Hadits',     # Nomor hadis
    'arab': 'Teks_Arab',         # Teks Arab
    'terjemahan': 'Terjemahan',  # Teks Terjemahan
    'bab': 'Bab',                # Nama Bab
    'derajat': 'Derajat',        # Derajat hadis
    'perawi_id': 'Perawi_ID'     # ID Perawi untuk membantu membuat ID unik
}

CSV_FILE_PATH = 'data_hadis.csv'  # Path ke file CSV Anda
INDEX_DIR = "../../data/index"

def ingest_data():
    if not os.path.exists(CSV_FILE_PATH):
        print(f"Error: File {CSV_FILE_PATH} tidak ditemukan.")
        return

    if not exists_in(INDEX_DIR):
        print(f"Error: Index belum diinisialisasi. Jalankan init_index.py dulu.")
        return

    print(f"Membaca file {CSV_FILE_PATH}...")
    df = pd.read_csv(CSV_FILE_PATH)
    
    # Bersihkan data (opsional)
    df = df.fillna('') # Isi data kosong dengan string kosong

    ix = open_dir(INDEX_DIR)
    writer = AsyncWriter(ix) # Menggunakan AsyncWriter agar lebih cepat

    print("Memulai proses indexing...")
    count = 0
    
    try:
        for index, row in df.iterrows():
            # Generate ID unik: Gabungan Perawi_ID dan Nomor_Hadits
            # Contoh: Perawi 1, Hadits 10 -> ID: 1_10
            unique_id = f"{row[COLUMN_MAPPING['perawi_id']]}_{row[COLUMN_MAPPING['nomor']]}"
            
            writer.update_document(
                id=str(unique_id),
                kitab=str(row[COLUMN_MAPPING['kitab']]),
                nomor=int(row[COLUMN_MAPPING['nomor']]),
                arab=str(row[COLUMN_MAPPING['arab']]),
                terjemahan=str(row[COLUMN_MAPPING['terjemahan']]),
                bab=str(row.get(COLUMN_MAPPING['bab'], '')),
                derajat=str(row.get(COLUMN_MAPPING['derajat'], ''))
            )
            count += 1
            if count % 1000 == 0:
                print(f"Berhasil memproses {count} dokumen...")

        print("Sedang melakukan commit (menyimpan ke disk)...")
        writer.commit()
        print(f"Selesai! Total {count} hadis berhasil dimasukkan ke index.")
        
    except Exception as e:
        writer.cancel()
        print(f"Terjadi kesalahan: {e}")

if __name__ == "__main__":
    ingest_data()

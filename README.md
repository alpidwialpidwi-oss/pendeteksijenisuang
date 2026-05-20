# Pendeteksi Uang Kertas dan Uang Logam

## Identitas & Pengantar
Nama: Siti Dwi Maullidah
      Alpia Yuliam Dani
Kelas: XI RPL 3  

Proyek ini dibuat untuk mendeteksi uang kertas dan uang logam menggunakan teknologi Artificial Intelligence (AI) dan pengolahan citra digital. Sistem ini membantu pengguna mengenali nominal uang secara otomatis melalui kamera.

Use Case
- Membantu proses identifikasi uang dengan cepat
- Mengurangi kesalahan saat menghitung uang
- Dapat digunakan untuk pembelajaran AI dan Computer Vision
- Bisa dikembangkan untuk membantu tunanetra mengenali uang

---

Arsitektur Model
Proyek ini menggunakan model YOLOv11n untuk mendeteksi objek uang kertas dan uang logam secara real-time.

Alasan Memilih YOLO
- Proses deteksi cepat
- Ringan digunakan pada laptop/edge devices
- Akurasi cukup tinggi
- Cocok untuk deteksi objek secara langsung melalui kamera

Teknologi yang Digunakan
- Python
- OpenCV
- YOLO
- NumPy

---

Fitur
- Deteksi uang kertas
- Deteksi uang logam
- Identifikasi nominal uang
- Real-time menggunakan kamera
- Tampilan hasil deteksi otomatis

---

Struktur Folder
```bash
project/
│── dataset/
│── model/
│── images/
│── main.py
│── detect.py
│── requirements.txt
└── README.md

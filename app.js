// Fungsi untuk menggambar kotak deteksi AI
function drawBoxes(boxes) {

    ctxOverlay.clearRect(0, 0, overlay.width, overlay.height);

    boxes.forEach(box => {

        const scaleX = overlay.width / TARGET_SIZE;
        const scaleY = overlay.height / TARGET_SIZE;

        // POSISI ASLI
        let x = box.x * scaleX;
        let y = box.y * scaleY;
        let w = box.w * scaleX;
        let h = box.h * scaleY;

        // =========================
        // PERKECIL UKURAN BOX
        // =========================
        let newW = w * 0.75;
        let newH = h * 0.75;

        // AGAR TETAP DI TENGAH
        let newX = x + (w - newW) / 2;
        let newY = y + (h - newH) / 2;

        // =========================
        // GANTI NAMA LABEL
        // =========================
        let label = CONFIG.labels[box.classId];

        let displayLabel = "";
        let boxColor = "";

        if(label === "Kelas_Satu"){
            displayLabel = "Uang Kertas";
            boxColor = "#22c55e"; // hijau
        }
        else if(label === "Kelas_Dua"){
            displayLabel = "Uang Logam";
            boxColor = "#f59e0b"; // kuning
        }
        else{
            displayLabel = label;
            boxColor = "#3b82f6"; // biru default
        }

        // =========================
        // STYLE BOX
        // =========================
        ctxOverlay.strokeStyle = boxColor;
        ctxOverlay.lineWidth = 4;

        // EFEK GLOW
        ctxOverlay.shadowColor = boxColor;
        ctxOverlay.shadowBlur = 15;

        // BOX DETEKSI
        ctxOverlay.strokeRect(newX, newY, newW, newH);

        // =========================
        // BACKGROUND LABEL
        // =========================
        ctxOverlay.fillStyle = boxColor;

        ctxOverlay.fillRect(
            newX,
            newY - 35,
            180,
            30
        );

        // =========================
        // TEXT LABEL
        // =========================
        ctxOverlay.shadowBlur = 0;

        ctxOverlay.fillStyle = "white";
        ctxOverlay.font = "bold 16px Poppins";

        ctxOverlay.fillText(
            `${displayLabel} ${(box.score * 100).toFixed(0)}%`,
            newX + 10,
            newY - 12
        );
    });
}

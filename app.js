function drawBoxes(boxes) {
    ctxOverlay.clearRect(0, 0, overlay.width, overlay.height);

    boxes.forEach(box => {
        const scaleX = overlay.width / TARGET_SIZE;
        const scaleY = overlay.height / TARGET_SIZE;

        // Warna beda per class
        const color = box.classId === 0 ? "#22c55e" : "#3b82f6";

        ctxOverlay.strokeStyle = color;
        ctxOverlay.lineWidth = 3;
        ctxOverlay.strokeRect(
            box.x * scaleX,
            box.y * scaleY,
            box.w * scaleX,
            box.h * scaleY
        );

        // Background label
        ctxOverlay.fillStyle = color;
        ctxOverlay.fillRect(
            box.x * scaleX,
            box.y * scaleY - 28,
            140,
            24
        );

        // Text label
        ctxOverlay.fillStyle = "white";
        ctxOverlay.font = "bold 14px Arial";
        ctxOverlay.fillText(
            `${box.classId === 0 ? "💵 Uang Kertas" : "🪙 Uang Logam"} ${(box.score * 100).toFixed(0)}%`,
            box.x * scaleX + 5,
            box.y * scaleY - 10
        );
    });
}

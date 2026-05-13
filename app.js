function drawBoxes(boxes) {
    ctxOverlay.clearRect(0, 0, overlay.width, overlay.height);

    boxes.forEach(box => {
        const scaleX = overlay.width / TARGET_SIZE;
        const scaleY = overlay.height / TARGET_SIZE;

        let labelText = "";
        let color = "";

        if (box.classId === 0) {
            labelText = "🪙 Uang Logam";
            color = "#3b82f6"; // biru
        } else {
            labelText = "💵 Uang Kertas";
            color = "#22c55e"; // hijau
        }

        // kotak
        ctxOverlay.strokeStyle = color;
        ctxOverlay.lineWidth = 4;
        ctxOverlay.strokeRect(
            box.x * scaleX,
            box.y * scaleY,
            box.w * scaleX,
            box.h * scaleY
        );

        // background label
        ctxOverlay.fillStyle = color;
        ctxOverlay.fillRect(
            box.x * scaleX,
            box.y * scaleY - 30,
            180,
            26
        );

        // tulisan
        ctxOverlay.fillStyle = "#ffffff";
        ctxOverlay.font = "bold 14px Arial";
        ctxOverlay.fillText(
            `${labelText} ${(box.score * 100).toFixed(0)}%`,
            box.x * scaleX + 6,
            box.y * scaleY - 12
        );
    });
}

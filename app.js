function drawBoxes(boxes) {
    ctxOverlay.clearRect(0, 0, overlay.width, overlay.height);

    boxes.forEach(box => {
        const scaleX = overlay.width / TARGET_SIZE;
        const scaleY = overlay.height / TARGET_SIZE;

        const color = box.classId === 0 ? "#3b82f6" : "#22c55e";

        ctxOverlay.strokeStyle = color;
        ctxOverlay.lineWidth = 3;
        ctxOverlay.strokeRect(
            box.x * scaleX,
            box.y * scaleY,
            box.w * scaleX,
            box.h * scaleY
        );

        ctxOverlay.fillStyle = color;
        ctxOverlay.fillRect(
            box.x * scaleX,
            box.y * scaleY - 28,
            160,
            24
        );

        ctxOverlay.fillStyle = "white";
        ctxOverlay.font = "bold 14px Arial";

        const customLabel = box.classId === 0
            ? "🪙 Uang Logam"
            : "💵 Uang Kertas";

        ctxOverlay.fillText(
            `${customLabel} ${(box.score * 100).toFixed(0)}%`,
            box.x * scaleX + 5,
            box.y * scaleY - 10
        );
    });
}

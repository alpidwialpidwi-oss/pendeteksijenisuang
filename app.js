// ======================================================================
// 1. CONFIG PROYEK
// ======================================================================
const CONFIG = {
    modelPath: './best.onnx',

    // class 0 = uang logam, class 1 = uang kertas
    labels: ["Uang Logam", "Uang Kertas"],

    threshold: 0.20,
    iouThreshold: 0.4
};

// ======================================================================
// 2. ELEMENT HTML
// ======================================================================
const video = document.getElementById('webcam');
const overlay = document.getElementById('overlay');
const ctxOverlay = overlay.getContext('2d');

const processor = document.getElementById('processor');
const ctxProcessor = processor.getContext('2d', {
    willReadFrequently: true
});

const status = document.getElementById('status');
const initBtn = document.getElementById('btn-init');

let session;
const TARGET_SIZE = 640;

// ======================================================================
// LOAD MODEL
// ======================================================================
initBtn.addEventListener('click', async () => {
    initBtn.disabled = true;
    initBtn.innerText = "⏳ MEMUAT MODEL AI...";

    try {
        ort.env.wasm.wasmPaths =
            'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/';

        session = await ort.InferenceSession.create(
            CONFIG.modelPath,
            {
                executionProviders: ['webgl', 'wasm']
            }
        );

        startCamera();
    } catch (error) {
        status.innerText = "❌ MODEL GAGAL DIMUAT";
        console.error(error);
    }
});

// ======================================================================
// START CAMERA
// ======================================================================
async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            width: 640,
            height: 480
        },
        audio: false
    });

    video.srcObject = stream;

    video.onloadedmetadata = () => {
        video.play();
        initBtn.style.display = "none";
        status.innerText = "🟢 SISTEM AKTIF";
        requestAnimationFrame(processFrame);
    };
}

// ======================================================================
// PROCESS FRAME
// ======================================================================
async function processFrame() {
    if (!session) return;

    ctxProcessor.drawImage(
        video,
        0,
        0,
        TARGET_SIZE,
        TARGET_SIZE
    );

    const imageData = ctxProcessor.getImageData(
        0,
        0,
        TARGET_SIZE,
        TARGET_SIZE
    ).data;

    const float32Data = new Float32Array(
        3 * TARGET_SIZE * TARGET_SIZE
    );

    for (let i = 0; i < TARGET_SIZE * TARGET_SIZE; i++) {
        float32Data[i] = imageData[i * 4] / 255;
        float32Data[i + TARGET_SIZE * TARGET_SIZE] =
            imageData[i * 4 + 1] / 255;
        float32Data[i + 2 * TARGET_SIZE * TARGET_SIZE] =
            imageData[i * 4 + 2] / 255;
    }

    const inputTensor = new ort.Tensor(
        'float32',
        float32Data,
        [1, 3, TARGET_SIZE, TARGET_SIZE]
    );

    const results = await session.run({
        [session.inputNames[0]]: inputTensor
    });

    const output = results[session.outputNames[0]].data;

    const numClasses = CONFIG.labels.length;
    const elements = 8400;

    let rawBoxes = [];

    for (let i = 0; i < elements; i++) {
        let maxScore = 0;
        let classId = -1;

        for (let c = 0; c < numClasses; c++) {
            const score = output[i + (4 + c) * elements];

            if (score > maxScore) {
                maxScore = score;
                classId = c;
            }
        }

        if (maxScore > CONFIG.threshold) {
            let x = output[i];
            let y = output[i + elements];
            let w = output[i + 2 * elements];
            let h = output[i + 3 * elements];

            if (w <= 1.5) {
                x *= TARGET_SIZE;
                y *= TARGET_SIZE;
                w *= TARGET_SIZE;
                h *= TARGET_SIZE;
            }

            rawBoxes.push({
                x: x - w / 2,
                y: y - h / 2,
                w: w,
                h: h,
                score: maxScore,
                classId: classId
            });
        }
    }

    const finalBoxes = nonMaxSuppression(
        rawBoxes,
        CONFIG.iouThreshold
    );

    drawBoxes(finalBoxes);

    requestAnimationFrame(processFrame);
}

// ======================================================================
// IOU
// ======================================================================
function calculateIoU(box1, box2) {
    const xA = Math.max(box1.x, box2.x);
    const yA = Math.max(box1.y, box2.y);
    const xB = Math.min(box1.x + box1.w, box2.x + box2.w);
    const yB = Math.min(box1.y + box1.h, box2.y + box2.h);

    const intersection =
        Math.max(0, xB - xA) *
        Math.max(0, yB - yA);

    return intersection /
        ((box1.w * box1.h) +
            (box2.w * box2.h) -
            intersection);
}

// ======================================================================
// NMS
// ======================================================================
function nonMaxSuppression(boxes, iouThreshold) {
    boxes.sort((a, b) => b.score - a.score);

    const result = [];

    while (boxes.length > 0) {
        const current = boxes.shift();
        result.push(current);

        boxes = boxes.filter(
            box => calculateIoU(current, box) < iouThreshold
        );
    }

    return result;
}

// ======================================================================
// DRAW BOXES
// ======================================================================
function drawBoxes(boxes) {
    ctxOverlay.clearRect(0, 0, overlay.width, overlay.height);

    boxes.forEach(box => {
        const scaleX = overlay.width / TARGET_SIZE;
        const scaleY = overlay.height / TARGET_SIZE;

        let labelText = "";
        let color = "";

        if (box.classId === 0) {
            labelText = "🪙 Uang Logam";
            color = "#3b82f6";
        } else {
            labelText = "💵 Uang Kertas";
            color = "#22c55e";
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
            box.y * scaleY - 28,
            180,
            24
        );

        // text
        ctxOverlay.fillStyle = "white";
        ctxOverlay.font = "bold 14px Arial";
        ctxOverlay.fillText(
            `${labelText} ${(box.score * 100).toFixed(0)}%`,
            box.x * scaleX + 5,
            box.y * scaleY - 10
        );
    });
}

let videoElement;
let canvasElement;
let canvasCtx;
let signatureCanvas;
let signatureCtx;
let hands;
let camera;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let generatedSignatureData = null;

const startBtn = document.getElementById('startBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const generateBtn = document.getElementById('generateBtn');
const saveGeneratedBtn = document.getElementById('saveGeneratedBtn');
const apiKeyInput = document.getElementById('apiKey');
const ocrModelSelect = document.getElementById('ocrModel');
const genModelSelect = document.getElementById('genModel');
const statusText = document.getElementById('statusText');
const comparisonSection = document.getElementById('comparisonSection');
const processSteps = document.getElementById('processSteps');
const originalSignatureImg = document.getElementById('originalSignature');
const generatedSignatureImg = document.getElementById('generatedSignature');
const recognizedTextSpan = document.getElementById('recognizedText');
const step2Status = document.getElementById('step2Status');

const PINCH_THRESHOLD = 0.05;

document.addEventListener('DOMContentLoaded', () => {
    videoElement = document.getElementById('webcam');
    canvasElement = document.getElementById('canvas');
    canvasCtx = canvasElement.getContext('2d');
    signatureCanvas = document.getElementById('signature');
    signatureCtx = signatureCanvas.getContext('2d');

    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);

    startBtn.addEventListener('click', start);
    clearBtn.addEventListener('click', clearSignature);
    saveBtn.addEventListener('click', saveSignature);
    generateBtn.addEventListener('click', generateSignature);
    saveGeneratedBtn.addEventListener('click', saveGeneratedSignature);
    apiKeyInput.addEventListener('input', checkApiKey);

    checkApiKey();
});

function checkApiKey() {
    if (apiKeyInput.value.trim() === '') {
        generateBtn.disabled = true;
        generateBtn.title = '请先输入火山引擎API密钥';
    } else {
        generateBtn.disabled = false;
        generateBtn.title = '';
    }
}

function resizeCanvases() {
    const videoContainer = document.querySelector('.video-container');
    const width = videoContainer.clientWidth;
    const height = videoContainer.clientHeight;

    canvasElement.width = width;
    canvasElement.height = height;
    signatureCanvas.width = width;
    signatureCanvas.height = height;

    signatureCtx.strokeStyle = '#000';
    signatureCtx.lineWidth = 4;
    signatureCtx.lineCap = 'round';
    signatureCtx.lineJoin = 'round';
}

function updateStatus(message) {
    statusText.textContent = message;
}

function updateStep(stepNum, status, isCompleted = false, isActive = false) {
    const step = document.getElementById(`step${stepNum}`);
    const statusEl = step.querySelector('.step-status');
    
    step.classList.remove('completed', 'active');
    if (isCompleted) step.classList.add('completed');
    if (isActive) step.classList.add('active');
    
    statusEl.textContent = status;
}

function updateStepDetail(stepNum, detail) {
    const detailEl = document.getElementById(`step${stepNum}Detail`);
    if (detailEl) {
        detailEl.textContent = detail;
    }
}

async function start() {
    updateStatus('正在启动相机和手势识别...');

    try {
        hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.5
        });

        hands.onResults(onResults);

        camera = new Camera(videoElement, {
            onFrame: async () => {
                await hands.send({ image: videoElement });
            },
            width: 1280,
            height: 720
        });

        camera.start();
        updateStatus('相机已启动，请将食指和拇指捏合开始写字');
        startBtn.textContent = '重新开始';
    } catch (error) {
        updateStatus('启动失败: ' + error.message);
        console.error(error);
    }
}

function calculateDistance(point1, point2) {
    return Math.sqrt(
        Math.pow(point1.x - point2.x, 2) +
        Math.pow(point1.y - point2.y, 2)
    );
}

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    canvasCtx.translate(canvasElement.width, 0);
    canvasCtx.scale(-1, 1);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.setTransform(1, 0, 0, 1, 0, 0);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const handLandmarks = results.multiHandLandmarks[0];

        const mirroredLandmarks = handLandmarks.map(point => ({
            x: 1 - point.x,
            y: point.y,
            z: point.z
        }));

        drawConnectors(canvasCtx, mirroredLandmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 1 });
        drawLandmarks(canvasCtx, mirroredLandmarks, { color: '#FF0000', lineWidth: 1, radius: 3 });

        const thumbTip = mirroredLandmarks[4];
        const indexTip = mirroredLandmarks[8];
        const pinchDistance = calculateDistance(thumbTip, indexTip);
        
        const x = indexTip.x * canvasElement.width;
        const y = indexTip.y * canvasElement.height;

        if (pinchDistance < PINCH_THRESHOLD) {
            if (!isDrawing) {
                isDrawing = true;
                lastX = x;
                lastY = y;
                updateStatus('正在书写...');
            } else {
                signatureCtx.beginPath();
                signatureCtx.moveTo(lastX, lastY);
                signatureCtx.lineTo(x, y);
                signatureCtx.stroke();
                lastX = x;
                lastY = y;
            }
        } else {
            if (isDrawing) {
                isDrawing = false;
                updateStatus('已停止书写');
            }
        }
    } else {
        if (isDrawing) {
            isDrawing = false;
            updateStatus('未检测到手部');
        }
    }

    canvasCtx.restore();
}

function clearSignature() {
    signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    comparisonSection.style.display = 'none';
    processSteps.style.display = 'none';
    
    // 清空流程中的状态与细节
    for (let i = 1; i <= 3; i++) {
        updateStep(i, '⏳', false, false);
        updateStepDetail(i, '');
    }
    recognizedTextSpan.textContent = '-';
    
    generatedSignatureData = null;
    updateStatus('签名已清除');
}

function getSignatureImageData() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = signatureCanvas.width;
    tempCanvas.height = signatureCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(signatureCanvas, 0, 0);
    return tempCanvas.toDataURL('image/png');
}

function saveSignature() {
    const imageData = getSignatureImageData();
    const link = document.createElement('a');
    link.download = 'original-signature.png';
    link.href = imageData;
    link.click();
    updateStatus('原始签名已保存');
}

function saveGeneratedSignature() {
    if (generatedSignatureData) {
        const link = document.createElement('a');
        link.download = 'generated-signature.png';
        link.href = generatedSignatureData;
        link.click();
        updateStatus('美化签名已保存');
    }
}

async function performOCR(imageData) {
    updateStep(1, '⏳', false, true);
    updateStepDetail(1, '正在准备图片数据...');
    
    try {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            throw new Error('请输入API密钥');
        }
        
        updateStatus('调用火山引擎 VLM Seed 2.0 Pro 模型...');
        updateStepDetail(1, '正在向火山方舟发起 POST 请求 (seed-2.0-pro)...');
        
        const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'seed-2.0-pro',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'image_url',
                                image_url: {
                                    url: imageData
                                }
                            },
                            {
                                type: 'text',
                                text: '识别图片中的文字内容，只返回识别结果，不要其他说明。'
                            }
                        ]
                    }
                ],
                temperature: 0.1
            })
        });
        
        if (!response.ok) {
            throw new Error(`API调用失败: HTTP ${response.status}`);
        }
        
        updateStepDetail(1, '等待 VLM 模型解析结果...');
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content?.trim() || '签名';
        
        updateStepDetail(1, `识别成功，响应时间: ${data.created ? new Date(data.created * 1000).toLocaleTimeString() : '完成'}`);
        updateStep(1, '✅', true, false);
        return text;
    } catch (error) {
        console.error('VLM识别失败:', error);
        updateStepDetail(1, `识别失败: ${error.message}`);
        updateStep(1, '⚠️', true, false);
        return '签名';
    }
}

async function generateSignatureImage(text, genModel) {
    updateStep(3, '⏳', false, true);
    
    try {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            throw new Error('请输入API密钥');
        }
        
        updateStatus('调用火山引擎 SeedDream 模型...');
        const promptText = `生成一个漂亮的手写体签名，内容是"${text}"，使用优雅的手写风格，白色背景，黑色文字，字体流畅自然。`;
        updateStepDetail(3, `构建 Prompt: ${promptText}`);
        
        const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'seeddream-latest',
                prompt: promptText,
                n: 1,
                size: '512x512'
            })
        });
        
        if (!response.ok) {
            throw new Error(`API调用失败: HTTP ${response.status}`);
        }
        
        updateStepDetail(3, 'API 响应成功，正在提取图片 URL...');
        const data = await response.json();
        const imageUrl = data.data?.[0]?.url;
        
        if (!imageUrl) {
            throw new Error('API返回格式错误，未找到图片URL');
        }
        
        updateStepDetail(3, '获取到图片 URL，正在下载图片...');
        const imageResponse = await fetch(imageUrl);
        const blob = await imageResponse.blob();
        const imageData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
        
        updateStepDetail(3, '签名图片生成完毕');
        updateStep(3, '✅', true, false);
        return imageData;
    } catch (error) {
        console.error('签名生成失败:', error);
        updateStepDetail(3, `生成失败: ${error.message}`);
        updateStep(3, '⚠️', true, false);
        throw error;
    }
}

async function generateSignature() {
    const imageData = getSignatureImageData();
    originalSignatureImg.src = imageData;
    comparisonSection.style.display = 'block';
    processSteps.style.display = 'block';
    generateBtn.disabled = true;
    
    updateStatus('开始生成美化签名...');
    recognizedTextSpan.textContent = '-';
    
    for (let i = 1; i <= 3; i++) {
        updateStep(i, '⏳', false, false);
        updateStepDetail(i, ''); // 清空之前的细节
    }
    
    try {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            updateStatus('请输入火山引擎API密钥');
            generateBtn.disabled = false;
            return;
        }
        
        updateStatus('准备调用火山引擎API...');
        
        const recognizedText = await performOCR(imageData);
        recognizedTextSpan.textContent = recognizedText;
        updateStep(2, '✅', true, false);
        step2Status.textContent = '✅';
        
        updateStatus('识别完成，开始生成签名...');
        
        const genModel = genModelSelect.value;
        generatedSignatureData = await generateSignatureImage(recognizedText, genModel);
        generatedSignatureImg.src = generatedSignatureData;
        
        updateStatus('美化签名生成成功！');
    } catch (error) {
        console.error('生成签名失败:', error);
        updateStatus('生成签名失败: ' + error.message);
        generatedSignatureImg.src = imageData;
    } finally {
        generateBtn.disabled = false;
    }
}

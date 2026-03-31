let generatedSignatureData = null;

// DOM Elements
const signatureInput = document.getElementById('signatureInput');
const apiKeyInput = document.getElementById('apiKey');
const genModelSelect = document.getElementById('genModel');
const generateBtn = document.getElementById('generateBtn');
const saveGeneratedBtn = document.getElementById('saveGeneratedBtn');
const statusText = document.getElementById('statusText');
const comparisonSection = document.getElementById('comparisonSection');
const processSteps = document.getElementById('processSteps');
const generatedSignatureImg = document.getElementById('generatedSignature');

document.addEventListener('DOMContentLoaded', () => {
    generateBtn.addEventListener('click', generateSignature);
    saveGeneratedBtn.addEventListener('click', saveGeneratedSignature);
    apiKeyInput.addEventListener('input', checkInputState);
    signatureInput.addEventListener('input', checkInputState);

    checkInputState();
});

function checkInputState() {
    const apiKey = apiKeyInput.value.trim();
    const text = signatureInput.value.trim();
    if (apiKey === '' || text === '') {
        generateBtn.disabled = true;
        generateBtn.title = '请先输入名字和火山引擎API密钥';
    } else {
        generateBtn.disabled = false;
        generateBtn.title = '';
    }
}

function updateStatus(message) {
    statusText.textContent = message;
}

function updateStep(stepNum, status, isCompleted = false, isActive = false) {
    const step = document.getElementById(`step${stepNum}`);
    if (!step) return;
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

function saveGeneratedSignature() {
    if (generatedSignatureData) {
        // 如果是直接的 URL，可以使用 fetch 下载并转换为 blob 再保存
        // 但是由于跨域问题，fetch(generatedSignatureData) 可能会失败
        // 我们尝试打开新窗口让用户手动保存，或者利用一个简单的跨域代理，这里最稳妥的是尝试下载
        
        fetch(generatedSignatureData)
            .then(res => res.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = 'generated-signature.png';
                link.href = url;
                link.click();
                window.URL.revokeObjectURL(url);
                updateStatus('美化签名已保存');
            })
            .catch(err => {
                console.warn('跨域下载失败，尝试在新标签页打开:', err);
                window.open(generatedSignatureData, '_blank');
                updateStatus('由于浏览器安全限制，已在新标签页打开图片，请右键保存');
            });
    }
}

async function generateSignatureImage(text, genModel) {
    updateStep(1, '⏳', false, true);
    
    try {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            throw new Error('请输入API密钥');
        }
        
        updateStatus('调用火山引擎 SeedDream 模型...');
        const promptText = `生成一个漂亮的手写体签名，内容是"${text}"，使用优雅的手写风格，白色背景，黑色文字，字体流畅自然。`;
        updateStepDetail(1, `构建 Prompt: ${promptText}`);
        
        const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'ep-20250909161150-2tfck',
                prompt: promptText
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API调用失败: HTTP ${response.status} - ${errorData.error?.message || '未知错误'}`);
        }
        
        updateStepDetail(1, 'API 响应成功，正在提取图片 URL...');
        const data = await response.json();
        const imageUrl = data.data?.[0]?.url;
        
        if (!imageUrl) {
            throw new Error('API返回格式错误，未找到图片URL');
        }
        
        updateStepDetail(1, '获取到图片 URL，正在处理...');
        // 由于火山引擎返回的图片 URL (TOS) 可能不支持浏览器的跨域请求 (CORS)，
        // 我们直接将 URL 赋值给 img 标签，而不是用 fetch 下载 blob。
        // 这会跳过 FileReader 转换为 Base64 的过程，直接利用浏览器的图片加载机制。
        
        updateStepDetail(1, '签名图片生成完毕');
        updateStep(1, '✅', true, false);
        return imageUrl; // 直接返回图片 URL
    } catch (error) {
        console.error('签名生成失败:', error);
        updateStepDetail(1, `生成失败: ${error.message}`);
        updateStep(1, '⚠️', true, false);
        throw error;
    }
}

async function generateSignature() {
    const text = signatureInput.value.trim();
    if (!text) {
        updateStatus('请输入需要生成签名的名字');
        return;
    }

    comparisonSection.style.display = 'block';
    processSteps.style.display = 'block';
    generateBtn.disabled = true;
    
    updateStatus('开始生成美化签名...');
    
    updateStep(1, '⏳', false, false);
    updateStepDetail(1, '');
    
    try {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            updateStatus('请输入火山引擎API密钥');
            generateBtn.disabled = false;
            return;
        }
        
        const genModel = genModelSelect.value;
        generatedSignatureData = await generateSignatureImage(text, genModel);
        generatedSignatureImg.src = generatedSignatureData;
        
        updateStatus('美化签名生成成功！');
    } catch (error) {
        console.error('生成签名失败:', error);
        updateStatus('生成签名失败: ' + error.message);
    } finally {
        generateBtn.disabled = false;
    }
}

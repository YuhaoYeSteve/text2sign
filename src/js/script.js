let generatedSignatureData = null;
let isLoginMode = true;
let currentUsername = localStorage.getItem('text2sign_current_user') || null;

// ============ View Router ============
const VIEWS = {
    HOME: 'home',
    GENERATOR: 'generator'
};

let currentView = VIEWS.HOME;

function switchView(viewName) {
    if (!viewName || (viewName !== VIEWS.HOME && viewName !== VIEWS.GENERATOR)) return;

    // 隐藏所有视图
    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active');
    });

    // 显示目标视图 - CSS 中已经有 view.active 的动画了
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
        targetView.classList.add('active');
    }

    currentView = viewName;

    // 更新 URL hash（不触发 hashchange）
    if (window.history && window.history.pushState) {
        history.pushState(null, '', `#${viewName}`);
    } else {
        window.location.hash = viewName;
    }

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 重新渲染 Lucide 图标
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 特殊处理：进入生成器页时 focus 输入框
    if (viewName === VIEWS.GENERATOR) {
        setTimeout(() => {
            if (isLoggedIn() && signatureInput) {
                signatureInput.focus();
            } else if (!isLoggedIn()) {
                // 未登录则弹出登录框
                openModal();
            }
        }, 500);
    }
}

const USERS_KEY = 'text2sign_users';
const CURRENT_USER_KEY = 'text2sign_current_user';

function migrateLegacyData() {
    const legacyToken = localStorage.getItem('auth_token');
    const legacyUser = localStorage.getItem('auth_username');
    if (legacyToken && legacyUser && !currentUsername) {
        const users = getUsers();
        if (!findUser(legacyUser)) {
            users.push({ username: legacyUser, password: '', apiKey: '', apiEndpoint: 'https://ark.cn-beijing.volces.com/api/v3/images/generations', genModel: 'ep-20250909161150-2tfck' });
            saveUsers(users);
        }
        currentUsername = legacyUser;
        localStorage.setItem(CURRENT_USER_KEY, currentUsername);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_username');
    }
}

// DOM Elements
const signatureInput = document.getElementById('signatureInput');
const apiKeyInput = document.getElementById('apiKey');
const apiEndpointInput = document.getElementById('apiEndpoint');
const genModelInput = document.getElementById('genModel');
const generateBtn = document.getElementById('generateBtn');
const saveGeneratedBtn = document.getElementById('saveGeneratedBtn');
const statusText = document.getElementById('statusText');
const resultPlaceholder = document.getElementById('resultPlaceholder');
const resultContent = document.getElementById('resultContent');
const generatedSignatureImg = document.getElementById('generatedSignature');

// Auth DOM Elements
const navLoginBtn = document.getElementById('navLoginBtn');
const navLogoutBtn = document.getElementById('navLogoutBtn');
const navUsername = document.getElementById('navUsername');
const authModal = document.getElementById('authModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalTitle = document.getElementById('modalTitle');
const authUsername = document.getElementById('authUsername');
const authPassword = document.getElementById('authPassword');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authSwitchLink = document.getElementById('authSwitchLink');
const authSwitchText = document.getElementById('authSwitchText');
const authErrorMsg = document.getElementById('authErrorMsg');
const apiUnauthMsg = document.getElementById('apiUnauthMsg');
const apiInputWrapper = document.getElementById('apiInputWrapper');
const toggleApiKeyVisibilityBtn = document.getElementById('toggleApiKeyVisibility');
const endpointSection = document.getElementById('endpointSection');
const modelSection = document.getElementById('modelSection');
const toggleEndpointVisibilityBtn = document.getElementById('toggleEndpointVisibility');
const toggleModelVisibilityBtn = document.getElementById('toggleModelVisibility');

document.addEventListener('DOMContentLoaded', () => {
    migrateLegacyData();
    
    generateBtn.addEventListener('click', generateSignature);
    saveGeneratedBtn.addEventListener('click', saveGeneratedSignature);
    apiKeyInput.addEventListener('input', () => {
        checkInputState();
        saveUserConfig();
    });
    apiEndpointInput.addEventListener('input', () => {
        checkInputState();
        saveUserConfig();
    });
    genModelInput.addEventListener('input', () => {
        checkInputState();
        saveUserConfig();
    });
    signatureInput.addEventListener('input', checkInputState);

    // Auth Event Listeners
    navLoginBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    navLogoutBtn.addEventListener('click', logout);
    authSubmitBtn.addEventListener('click', handleAuthSubmit);
    
    // 使用事件委托处理切换链接，避免重复绑定
    authSwitchText.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'authSwitchLink') {
            e.preventDefault();
            toggleAuthMode(e);
        }
    });
    
    // API Key visibility toggle
    toggleApiKeyVisibilityBtn.addEventListener('click', () => {
        const isPassword = apiKeyInput.type === 'password';
        apiKeyInput.type = isPassword ? 'text' : 'password';
        
        const icon = toggleApiKeyVisibilityBtn.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
            lucide.createIcons();
        }
        
        toggleApiKeyVisibilityBtn.classList.toggle('active', !isPassword);
    });
    
    // Endpoint visibility toggle
    toggleEndpointVisibilityBtn.addEventListener('click', () => {
        const isPassword = apiEndpointInput.type === 'password';
        apiEndpointInput.type = isPassword ? 'text' : 'password';
        const icon = toggleEndpointVisibilityBtn.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
            lucide.createIcons();
        }
        toggleEndpointVisibilityBtn.classList.toggle('active', !isPassword);
    });
    
    // Model ID visibility toggle
    toggleModelVisibilityBtn.addEventListener('click', () => {
        const isPassword = genModelInput.type === 'password';
        genModelInput.type = isPassword ? 'text' : 'password';
        const icon = toggleModelVisibilityBtn.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
            lucide.createIcons();
        }
        toggleModelVisibilityBtn.classList.toggle('active', !isPassword);
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeModal();
        }
    });

    // Keyboard shortcuts
    signatureInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !generateBtn.disabled) {
            generateSignature();
        }
    });
    
    authPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAuthSubmit();
        }
    });

    updateAuthState();
    checkInputState();
    
    triggerEntranceAnimations();

    // ============ View Routing Events ============

    // Hash 变化监听（浏览器前进/后退）
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.slice(1) || VIEWS.HOME;
        if (hash !== currentView && (hash === VIEWS.HOME || hash === VIEWS.GENERATOR)) {
            switchView(hash);
        }
    });

    // popstate 监听（浏览器后退按钮）
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.slice(1) || VIEWS.HOME;
        if (hash !== currentView) {
            switchView(hash);
        }
    });

    // 初始化时检查 hash
    const initialHash = window.location.hash.slice(1);
    if (initialHash === VIEWS.GENERATOR) {
        switchView(VIEWS.GENERATOR);
    }

    // CTA 按钮 → 跳转到生成器
    const ctaStartBtn = document.getElementById('ctaStartBtn');
    if (ctaStartBtn) {
        ctaStartBtn.addEventListener('click', () => {
            switchView(VIEWS.GENERATOR);
        });
    }

    // 返回按钮 → 回到首页
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', () => {
            switchView(VIEWS.HOME);
        });
    }

    // Navbar 品牌点击 → 回到首页（可选增强）
    const navBrand = document.querySelector('.nav-brand');
    if (navBrand) {
        navBrand.style.cursor = 'pointer';
        navBrand.addEventListener('click', () => {
            if (currentView !== VIEWS.HOME) {
                switchView(VIEWS.HOME);
            }
        });
    }
});

function triggerEntranceAnimations() {
    // CSS 中已经定义了 animate-fade-in-up 的动画，无需额外处理
    // 该类已经包含了 opacity: 0 到 opacity: 1 的渐变动画
}

function setButtonLoading(button, isLoading, loadingText = '处理中...') {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = `<span class="spinner"></span> ${loadingText}`;
        button.classList.add('loading');
    } else {
        button.disabled = false;
        button.classList.remove('loading');
    }
}

function setAuthButtonLoading(isLoading) {
    if (isLoading) {
        authSubmitBtn.disabled = true;
        authSubmitBtn.innerHTML = '<span class="spinner"></span> 处理中...';
        authSubmitBtn.classList.add('loading');
    } else {
        authSubmitBtn.disabled = false;
        authSubmitBtn.innerHTML = isLoginMode ? '登录' : '注册';
        authSubmitBtn.classList.remove('loading');
    }
}

function updateStatus(message) {
    statusText.textContent = message;
}

// LocalStorage Helpers
function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUser(username) {
    const users = getUsers();
    return users.find(u => u.username === username);
}

function isLoggedIn() {
    return currentUsername !== null && currentUsername !== '';
}

// Auth Functions
function updateAuthState() {
    if (isLoggedIn()) {
        navLoginBtn.style.display = 'none';
        navLogoutBtn.style.display = 'block';
        navUsername.style.display = 'block';
        navUsername.textContent = `欢迎, ${currentUsername}`;
        
        apiUnauthMsg.style.display = 'none';
        apiInputWrapper.style.display = 'flex';
        endpointSection.style.display = '';
        modelSection.style.display = '';
        
        fetchUserConfig();
    } else {
        navLoginBtn.style.display = 'block';
        navLogoutBtn.style.display = 'none';
        navUsername.style.display = 'none';
        
        apiUnauthMsg.style.display = 'block';
        apiInputWrapper.style.display = 'none';
        endpointSection.style.display = 'none';
        modelSection.style.display = 'none';
        apiKeyInput.value = '';
        apiEndpointInput.value = '';
        genModelInput.value = '';
    }
    checkInputState();
}

function openModal() {
    authModal.classList.add('show');
    authErrorMsg.textContent = '';
    authUsername.value = '';
    authPassword.value = '';
    isLoginMode = true;
    updateModalUI();
    
    setTimeout(() => {
        authUsername.focus();
    }, 300);
}

function closeModal() {
    authModal.classList.remove('show');
}

function toggleAuthMode(e) {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    updateModalUI();
}

function updateModalUI() {
    authErrorMsg.textContent = '';
    if (isLoginMode) {
        modalTitle.textContent = '登录';
        authSubmitBtn.textContent = '登录';
        authSwitchText.innerHTML = '没有账号？<a href="#" id="authSwitchLink">去注册</a>';
    } else {
        modalTitle.textContent = '注册';
        authSubmitBtn.textContent = '注册';
        authSwitchText.innerHTML = '已有账号？<a href="#" id="authSwitchLink">去登录</a>';
    }
    document.getElementById('authSwitchLink').addEventListener('click', toggleAuthMode);
}

function handleAuthSubmit() {
    const username = authUsername.value.trim();
    const password = authPassword.value.trim();
    
    if (!username || !password) {
        authErrorMsg.textContent = '用户名和密码不能为空';
        return;
    }
    
    setAuthButtonLoading(true);
    authErrorMsg.textContent = '';
    
    setTimeout(() => {
        try {
            if (isLoginMode) {
                handleLogin(username, password);
            } else {
                handleRegister(username, password);
            }
        } catch (error) {
            authErrorMsg.textContent = error.message;
        } finally {
            setAuthButtonLoading(false);
        }
    }, 300);
}

function handleRegister(username, password) {
    const users = getUsers();
    
    if (findUser(username)) {
        throw new Error('用户名已存在');
    }
    
    users.push({ 
        username, 
        password, 
        apiKey: '', 
        apiEndpoint: 'https://ark.cn-beijing.volces.com/api/v3/images/generations',
        genModel: 'ep-20250909161150-2tfck'
    });
    saveUsers(users);
    
    isLoginMode = true;
    updateModalUI();
    authErrorMsg.textContent = '注册成功，请登录';
    authErrorMsg.style.color = 'var(--color-success)';
    setTimeout(() => { authErrorMsg.style.color = '#ef4444'; }, 3000);
}

function handleLogin(username, password) {
    const user = findUser(username);
    
    if (!user) {
        throw new Error('用户名或密码错误');
    }
    
    if (user.password !== password) {
        throw new Error('用户名或密码错误');
    }
    
    currentUsername = username;
    localStorage.setItem(CURRENT_USER_KEY, currentUsername);
    
    closeModal();
    updateAuthState();
    updateStatus('登录成功');
}

function logout() {
    currentUsername = null;
    localStorage.removeItem(CURRENT_USER_KEY);
    updateAuthState();
    updateStatus('已退出登录');
}

// User Config Local Storage (API Key + Endpoint + Model)
let saveTimeout;
function saveUserConfig() {
    if (!isLoggedIn()) return;
    
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        const users = getUsers();
        const idx = users.findIndex(u => u.username === currentUsername);
        if (idx !== -1) {
            users[idx].apiKey = apiKeyInput.value.trim();
            users[idx].apiEndpoint = apiEndpointInput.value.trim();
            users[idx].genModel = genModelInput.value.trim();
            saveUsers(users);
            updateStatus('配置已保存');
        }
    }, 500);
}

function fetchUserConfig() {
    if (!isLoggedIn()) return;
    
    const user = findUser(currentUsername);
    if (user) {
        if (user.apiKey) apiKeyInput.value = user.apiKey;
        if (user.apiEndpoint) apiEndpointInput.value = user.apiEndpoint;
        if (user.genModel) genModelInput.value = user.genModel;
        checkInputState();
        setTimeout(checkInputState, 100);
    }
}

function checkInputState() {
    const text = signatureInput ? signatureInput.value.trim() : '';
    
    if (!isLoggedIn()) {
        generateBtn.disabled = true;
        generateBtn.title = '请先登录';
        return;
    }

    const apiKey = apiKeyInput ? apiKeyInput.value.trim() : '';
    const endpoint = apiEndpointInput ? apiEndpointInput.value.trim() : '';
    const model = genModelInput ? genModelInput.value.trim() : '';
    if (apiKey === '' || text === '' || endpoint === '' || model === '') {
        generateBtn.disabled = true;
        generateBtn.title = '请填写完整：名字、API 密钥、端点地址、模型 ID';
    } else {
        generateBtn.disabled = false;
        generateBtn.title = '';
    }
}

function saveGeneratedSignature() {
    if (generatedSignatureData) {
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

async function generateSignatureImage(text) {    
    try {
        const apiKey = apiKeyInput.value.trim();
        const apiEndpoint = apiEndpointInput.value.trim();
        const genModel = genModelInput.value.trim();
        
        if (!apiKey) throw new Error('请输入API密钥');
        if (!apiEndpoint) throw new Error('请输入 API 端点地址');
        if (!genModel) throw new Error('请输入模型 ID');
        
        updateStatus(`调用模型 ${genModel}...`);
        const promptText = `生成一个漂亮的手写体签名，内容是"${text}"，使用优雅的手写风格，白色背景，黑色文字，字体流畅自然。`;
        
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: genModel,
                prompt: promptText
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API调用失败: HTTP ${response.status} - ${errorData.error?.message || '未知错误'}`);
        }
        
        const data = await response.json();
        const imageUrl = data.data?.[0]?.url;
        
        if (!imageUrl) {
            throw new Error('API返回格式错误，未找到图片URL');
        }
        
        return imageUrl;
    } catch (error) {
        console.error('签名生成失败:', error);
        throw error;
    }
}

async function generateSignature() {
    if (!isLoggedIn()) {
        updateStatus('请先登录');
        openModal();
        return;
    }

    const text = signatureInput.value.trim();
    if (!text) {
        updateStatus('请输入需要生成签名的名字');
        return;
    }

    resultPlaceholder.style.display = 'none';
    resultContent.style.display = 'flex';
    setButtonLoading(generateBtn, true, '正在生成...');
    
    updateStatus('开始生成美化签名...');
    
    try {
        generatedSignatureData = await generateSignatureImage(text);
        generatedSignatureImg.src = generatedSignatureData;
        
        updateStatus('美化签名生成成功！');
    } catch (error) {
        console.error('生成签名失败:', error);
        updateStatus('生成签名失败: ' + error.message);
        resultPlaceholder.style.display = 'flex';
        resultContent.style.display = 'none';
    } finally {
        setButtonLoading(generateBtn, false);
    }
}

<div align="center">

# ✨ text2sign ✨

**豆包大模型个性化签名生成器 | Doubao LLM Personalized Signature Generator**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Volcengine](https://img.shields.io/badge/Volcengine-SeedDream-blue?style=for-the-badge)](https://www.volcengine.com/)
[![Trae](https://img.shields.io/badge/Built_with-Trae_Vibe_Coding-blueviolet?style=for-the-badge)](https://www.trae.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[中文文档](#中文文档) • [English Documentation](#english-documentation)

---

</div>

<h2 id="中文文档">🇨🇳 中文文档</h2>

### 📖 项目简介

**text2sign** 是一个前后端分离的 Web 应用，通过输入你的名字，无缝对接**火山引擎 (Volcengine) 的 SeedDream 大模型**，为你生成极具艺术感和个人风格的手写签名图片。

> 💡 **本项目是完全基于 Trae Vibe Coding 完成。**

前端采用原生 HTML/CSS/JS 构建，后端基于 Express + MySQL 提供用户认证与 API Key 管理服务。

### 🏗️ 项目架构

```
text2sign/
├── index.html              # 前端主页面
├── src/
│   ├── css/style.css       # 前端样式
│   └── js/script.js        # 前端逻辑
├── backend/
│   ├── index.js            # Express 后端服务
│   ├── db.js               # MySQL 数据库连接池
│   ├── package.json        # 后端依赖
│   └── .env.example        # 环境变量示例
└── README.md
```

### 🚀 核心特性

- **🔐 用户认证系统**：支持注册/登录，密码加密存储（bcrypt），JWT Token 鉴权。
- **🔑 API Key 管理**：用户可绑定火山引擎 API Key，服务端安全存储，登录后自动加载。
- **⌨️ 极简输入**：直接输入名字即可生成签名，方便快捷。
- **🎨 大模型赋能**：对接火山引擎 SeedDream 模型，生成高质量、白底黑字的流畅手写体。
- **⚙️ 高级设置**：支持自定义 API 端点地址和模型 ID，灵活适配不同模型版本。
- **💾 一键保存**：生成的签名支持一键下载至本地，方便用于电子文档、名片等场景。
- **🖥️ 现代化界面**：多视图 SPA 导航（首页 + 工作台），Lucide 图标库，流畅的动画与交互体验。
- **📊 生成流程可视化**：实时展示签名生成的步骤与状态，清晰直观。

### 🛠️ 使用方法

#### 前端（纯静态）

1. **克隆项目到本地**
   ```bash
   git clone https://github.com/YuhaoYeSteve/text2sign.git
   ```
2. **运行前端**
   - 直接双击打开根目录下的 `index.html`，或者使用 VS Code 的 Live Server 插件打开以获得更好的体验。
   - 前端使用 localStorage 进行用户数据管理，无需后端即可运行。

#### 后端（可选，用于服务端用户管理）

1. **安装后端依赖**
   ```bash
   cd backend
   npm install
   ```
2. **配置环境变量**
   ```bash
   cp .env.example .env
   # 编辑 .env 文件，填入数据库连接信息和 JWT 密钥
   ```
3. **确保 MySQL 已运行并创建数据库**
   ```sql
   CREATE DATABASE text2sign;
   ```
4. **启动后端服务**
   ```bash
   npm start
   ```
   服务默认运行在 `http://localhost:3000`。

#### 生成与保存

1. 注册/登录账号。
2. 在设置中输入您的 [火山引擎 API 密钥](https://console.volcengine.com/)。
3. 输入你的名字，点击**"生成美化签名"**。
4. 等待生成完成后，点击**"保存美化签名"**即可下载图片。

### 🔧 后端 API

| 接口 | 方法 | 说明 | 鉴权 |
|------|------|------|------|
| `/register` | POST | 用户注册 | ❌ |
| `/login` | POST | 用户登录 | ❌ |
| `/api_key` | GET | 获取绑定的 API Key | ✅ JWT |
| `/api_key` | POST | 更新绑定的 API Key | ✅ JWT |

### 📸 界面预览

*(稍后您可以将实际的项目截图替换此处的占位图)*
<p align="center">
  <img src="https://via.placeholder.com/800x450?text=Screenshot+Placeholder" alt="Screenshot" width="800"/>
</p>

### 📄 许可证
本项目基于 [MIT License](LICENSE) 开源。

---

<br>

<h2 id="english-documentation">🇬🇧 English Documentation</h2>

### 📖 Introduction

**text2sign** is a full-stack web application with a separated frontend and backend. By simply typing your name, it seamlessly integrates with the **Volcengine SeedDream Large Model** to generate an artistic, highly personalized handwritten signature image.

> 💡 **This project is completely built based on Trae Vibe Coding.**

The frontend is built with vanilla HTML/CSS/JS, while the backend is powered by Express + MySQL, providing user authentication and API Key management services.

### 🏗️ Project Architecture

```
text2sign/
├── index.html              # Frontend main page
├── src/
│   ├── css/style.css       # Frontend styles
│   └── js/script.js        # Frontend logic
├── backend/
│   ├── index.js            # Express backend service
│   ├── db.js               # MySQL connection pool
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Environment variable template
└── README.md
```

### 🚀 Features

- **🔐 User Authentication**: Registration/login with bcrypt password hashing and JWT token authentication.
- **🔑 API Key Management**: Bind your Volcengine API Key securely on the server side, auto-loaded after login.
- **⌨️ Simple Input**: Type your name to generate a signature, quick and easy.
- **🎨 AI-Powered**: Integrates with Volcengine's SeedDream model to generate high-quality, fluent handwritten styles with a white background and black text.
- **⚙️ Advanced Settings**: Customize API endpoint and model ID to flexibly adapt to different model versions.
- **💾 One-Click Save**: Download your generated signature instantly for use in digital documents, business cards, etc.
- **🖥️ Modern UI**: Multi-view SPA navigation (Home + Workspace), Lucide icons, smooth animations and interactions.
- **📊 Generation Progress Visualization**: Real-time step-by-step status display during signature generation.

### 🛠️ Getting Started

#### Frontend (Static)

1. **Clone the repository**
   ```bash
   git clone https://github.com/YuhaoYeSteve/text2sign.git
   ```
2. **Run the frontend**
   - Simply double-click `index.html` in the root directory, or use the VS Code Live Server extension for a better experience.
   - The frontend uses localStorage for user data management and can run without the backend.

#### Backend (Optional, for server-side user management)

1. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```
2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your database connection info and JWT secret
   ```
3. **Ensure MySQL is running and create the database**
   ```sql
   CREATE DATABASE text2sign;
   ```
4. **Start the backend server**
   ```bash
   npm start
   ```
   The server runs on `http://localhost:3000` by default.

#### Generate & Save

1. Register/Login to your account.
2. Enter your [Volcengine API Key](https://console.volcengine.com/) in the settings.
3. Type your name and click **"Generate Beautiful Signature"**.
4. Once generated, click **"Save Signature"** to download the image.

### 🔧 Backend API

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/register` | POST | User registration | ❌ |
| `/login` | POST | User login | ❌ |
| `/api_key` | GET | Get bound API Key | ✅ JWT |
| `/api_key` | POST | Update bound API Key | ✅ JWT |

### 📸 Screenshot

*(You can replace this placeholder with a real screenshot of your app later)*
<p align="center">
  <img src="https://via.placeholder.com/800x450?text=Screenshot+Placeholder" alt="Screenshot" width="800"/>
</p>

### 📄 License
This project is licensed under the [MIT License](LICENSE).

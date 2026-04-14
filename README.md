<div align="center">

# TEXT2SIGN

**豆包大模型个性化签名生成器**

[![Volcengine SeedDream](https://img.shields.io/badge/SeedDream-Volcengine-blue?style=flat-square)](https://www.volcengine.com/)
[![Built with Trae](https://img.shields.io/badge/Trae-Vibe_Coding-blueviolet?style=flat-square)](https://www.trae.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](https://opensource.org/licenses/MIT)

[English](README_EN.md)

</div>

---

### 📖 项目简介

**TEXT2SIGN** 是一个前后端分离的 Web 应用，通过输入你的名字，无缝对接**火山引擎 (Volcengine) 的 SeedDream 大模型**，为你生成极具艺术感和个人风格的手写签名图片。

> 💡 **本项目是完全基于 Trae Vibe Coding 完成。**

前端采用原生 HTML/CSS/JS 构建，UI 遵循 Apple 设计规范；后端基于 Express + MySQL 提供用户认证与 API Key 管理服务。

### 📸 界面预览

<p align="center">
  <img src="screenshot/screenshot-20260410-222235.png" alt="签名工作台预览" width="800"/>
</p>
<p align="center">
  <img src="screenshot/screenshot-20260412-184353.png" alt="首页预览" width="800"/>
</p>

### 🏗️ 项目架构

```
text2sign/
├── index.html              # 前端主页面
├── src/
│   ├── css/style.css       # 前端样式（Apple Design System）
│   └── js/script.js        # 前端逻辑（SPA 路由 + 状态管理）
├── backend/
│   ├── index.js            # Express 后端服务
│   ├── db.js               # MySQL 数据库连接池
│   ├── package.json        # 后端依赖
│   └── .env.example        # 环境变量示例
└── README.md
```

### 🚀 核心特性

- **🍎 Apple 风格 UI**：采用 Apple 色彩体系、毛玻璃导航栏、圆角卡片、精致阴影与流畅动画，全屏沉浸式布局。
- **🔀 SPA 多视图导航**：首页（Hero + CTA + 功能展示）与签名工作台两个视图，支持 URL Hash 路由与浏览器前进/后退。
- **🔐 用户认证系统**：支持注册/登录，密码加密存储（bcrypt），JWT Token 鉴权。
- **🔑 API Key 管理**：用户可绑定火山引擎 API Key，服务端安全存储，登录后自动加载。
- **⌨️ 极简输入**：直接输入名字即可生成签名，支持 Enter 快捷键触发。
- **🎨 大模型赋能**：对接火山引擎 SeedDream 模型，生成高质量、白底黑字的流畅手写体。
- **⚙️ 高级设置**：支持自定义 API 端点地址和模型 ID，各字段均支持显示/隐藏切换，灵活适配不同模型版本。
- **💾 一键保存**：生成的签名支持一键下载至本地，方便用于电子文档、名片等场景。
- **🖼️ 左右分栏工作台**：左侧输入配置区 + 右侧结果预览区，操作与结果一目了然。
- **🔄 加载状态反馈**：按钮加载动画、状态栏实时提示，操作过程清晰可感知。
- **✨ Lucide 图标库**：全站使用 Lucide 图标，视觉统一、专业精致。

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

1. 在首页点击**"立即开始创建"**进入签名工作台。
2. 注册/登录账号（未登录会自动弹出登录框）。
3. 输入您的 [火山引擎 API 密钥](https://console.volcengine.com/)。
4. 输入你的名字，点击**"生成美化签名"**（或按 Enter 键）。
5. 等待生成完成后，点击**"保存签名"**即可下载图片。

### 🔧 后端 API

| 接口 | 方法 | 说明 | 鉴权 |
|------|------|------|------|
| `/register` | POST | 用户注册 | ❌ |
| `/login` | POST | 用户登录 | ❌ |
| `/api_key` | GET | 获取绑定的 API Key | ✅ JWT |
| `/api_key` | POST | 更新绑定的 API Key | ✅ JWT |

### 📄 许可证
本项目基于 [MIT License](LICENSE) 开源。

# 手势手写签名生成器 (cam_handwrite2sign)

基于 Web 摄像头的 AR 指尖书写应用，利用计算机视觉技术捕捉手部动作，让你在空气中挥洒创意，并结合大模型技术生成美化签名。

## 项目简介

本项目通过调用用户的电脑摄像头，使用 MediaPipe 进行实时的手势追踪。
当用户捏合食指和拇指时，即可在屏幕上进行“隔空写字”。写完后，系统将调用火山引擎大模型：
1. **VLM 模型**：识别手写的文字内容。
2. **SeedDream 模型**：根据识别到的文字，生成具有艺术感的美化签名。

## 目录结构

```text
.
├── src/
│   ├── css/
│   │   └── style.css       # 页面样式
│   └── js/
│       └── script.js       # 核心逻辑（摄像头、Canvas 绘制、API 调用等）
├── index.html              # 主页面入口
├── README.md               # 项目说明文档
└── .gitignore              # Git 忽略配置
```

## 快速开始

本项目是一个轻量级的纯前端（Vanilla JS）项目，**无需安装依赖，无需构建打包**。

1. 克隆或下载本项目到本地：
   ```bash
   git clone https://github.com/YuhaoYeSteve/cam_handwrite2sign.git
   ```
2. 直接双击打开根目录下的 `index.html` 文件，或使用 VS Code 的 Live Server 插件打开。
3. 允许浏览器访问摄像头权限。

## 使用说明

1. **配置 API 密钥**：在页面中输入您的【火山引擎 API 密钥】以启用签名生成功能。
2. **手势书写**：将手暴露在摄像头视野内，**捏合食指和拇指**即可开始写字，松开即可停止。
3. **生成签名**：写完后点击“生成美化签名”按钮，等待大模型处理。
4. **保存图片**：支持保存您的原始手写轨迹，或大模型生成的美化签名。

## 依赖与感谢

- [MediaPipe](https://google.github.io/mediapipe/)：提供实时的手势识别和追踪。
- [Tesseract.js](https://tesseract.projectnaptha.com/)：提供基础的纯前端 OCR 功能（部分备用）。
- **火山引擎 (Volcengine)**：提供 VLM 多模态大模型与 SeedDream 图像生成模型。

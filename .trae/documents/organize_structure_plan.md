# 项目结构整理计划

## 1. 总结

当前项目的根目录下直接放置了 HTML、JS、CSS 文件，并且存在一个意外产生的空文件夹。本次整理将通过基础的目录归类和清理工作，使项目结构更加清晰规范，同时补充必要的开源项目文档（README.md），保持项目轻量且易于维护。

## 2. 现状分析

* **核心代码直接暴露**：`script.js` 和 `style.css` 都在根目录，随着项目扩大，根目录会显得拥挤。

* **无用文件夹残留**：根目录下存在一个 `coding/Trae/cam_handwrite2sign/.trae/specs/...` 结构的文件夹，经排查内部全为空文件夹，没有任何实质代码或文件，属于误生成的垃圾目录。

* **缺乏文档**：项目已经上传至 GitHub，但缺少标准的 `README.md` 文件来说明项目用途和使用方法。

## 3. 具体修改方案

1. **删除冗余文件夹**：

   * 删除根目录下的 `coding` 文件夹及其所有子目录。
2. **创建源码目录 (src)**：

   * 在根目录新建 `src/css` 和 `src/js` 文件夹。

   * 将 `style.css` 移动至 `src/css/style.css`。

   * 将 `script.js` 移动至 `src/js/script.js`。
3. **更新 HTML 引用路径**：

   * 修改 `index.html` 第 7 行：将 `<link rel="stylesheet" href="style.css">` 改为 `<link rel="stylesheet" href="src/css/style.css">`。

   * 修改 `index.html` 第 97 行：将 `<script src="script.js"></script>` 改为 `<script src="src/js/script.js"></script>`。
4. **补充 README.md 文档**：

   * 在根目录创建 `README.md`，内容包含：

     * 项目名称：手势手写签名生成器 (cam\_handwrite2sign)

     * 项目简介：基于 Web 摄像头的 AR 指尖书写应用，结合火山引擎大模型生成美化签名。

     * 快速开始指南：说明直接用浏览器打开 `index.html` 即可运行。

     * 注意事项：说明需要配置火山引擎 API 密钥。

## 4. 假设与决策

* **保持静态网页架构**：根据用户的选择，不引入打包工具（如 Webpack/Vite）或模块化拆分，以确保用户可以直接双击 `index.html` 在浏览器中运行，无需启动本地 Node 服务。

* **安全的删除**：已通过命令行排查确认 `coding` 目录及其子目录下不存在任何用户的源代码文件，删除是安全的。

## 5. 验证步骤

1. 执行 `tree` 或 `ls -R` 命令，确认目录结构已变更为：

   ```text
   .
   ├── src
   │   ├── css
   │   │   └── style.css
   │   └── js
   │       └── script.js
   ├── index.html
   ├── README.md
   ├── .gitignore
   └── .trae
   ```
2. 检查 `index.html` 的修改内容，确认路径更新正确。
3. 确保清理和移动后，本地 Git 状态正确跟踪了这些变更（使用 `git status` 检查重命名和删除操作）。


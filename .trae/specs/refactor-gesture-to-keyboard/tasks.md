# Tasks

*- [x] Task 1: 精简 HTML 结构并更新名称

  * [ ] SubTask 1.1: 移除 `index.html` 中的 MediaPipe 和 Tesseract 脚本引入。

  * [ ] SubTask 1.2: 移除视频容器 (`video-container`) 及其内部的 video 和 canvas 元素。

  * [ ] SubTask 1.3: 移除"开始"、"清除"、"保存原始签名"等不再需要的按钮。

  * [ ] SubTask 1.4: 添加一个新的文本输入框，用于用户输入签名内容。

  * [ ] SubTask 1.5: 精简模型选择区域，移除 OCR 模型的选择。

  * [ ] SubTask 1.6: 更新生成流程显示的 UI，移除 OCR 相关的步骤展示。

  * [ ] SubTask 1.7: 更新页面 Title、h1 标题等，体现“豆包大模型个性化签名生成器”。

*- [x] Task 2: 清理并更新 CSS 样式

  * [ ] SubTask 2.1: 移除 `style.css` 中与视频流、canvas 和不需要的按钮相关的样式。

  * [ ] SubTask 2.2: 为新增的文本输入框添加样式。

  * [ ] SubTask 2.3: 调整整体布局，使其在移除视频区域后依然美观。

- [x] Task 3: 重构 JavaScript 逻辑

  * [ ] SubTask 3.1: 移除 `script.js` 中所有与摄像头、MediaPipe 手势识别相关的变量和函数 (`start`, `onResults`, `calculateDistance` 等)。

  * [ ] SubTask 3.2: 移除与 Canvas 绘制相关的逻辑 (`resizeCanvases`, 绘制轨迹代码等)。

  * [ ] SubTask 3.3: 移除 `performOCR` 函数及相关的 VLM API 调用逻辑。

  * [ ] SubTask 3.4: 修改 `generateSignature` 函数，使其直接从新增的文本输入框获取文字，并传递给 `generateSignatureImage` 函数。

  * [ ] SubTask 3.5: 更新按钮禁用/启用逻辑，除了检查 API 密钥外，还需检查文本输入框是否为空。

  * [ ] SubTask 3.6: 更新状态提示信息和流程显示逻辑，使其符合新的简简版流程。

# Task Dependencies

* \[Task 2] depends on \[Task 1]

* \[Task 3] depends on \[Task 1]


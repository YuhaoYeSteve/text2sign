# 手势手写签名生成 - Product Requirement Document

## Overview

* **Summary**: 通过摄像头实时识别手势（食指与拇指捏合），在屏幕上显示并记录写字轨迹，然后调用火山引擎API将手写内容转换为漂亮的手写体签名。

* **Purpose**: 提供一种便捷的手势交互方式，让用户可以通过自然的手势动作在屏幕上写字，并利用AI能力将其转换为美观的签名。

* **Target Users**: 需要创建手写签名、喜欢尝试新技术的用户。

## Goals

* 通过摄像头实时捕捉并识别用户手势

* 检测食指与拇指的捏合动作作为写字触发信号

* 在屏幕上显示写字轨迹并保存

* 调用火山引擎API生成美观的手写体签名

* 提供友好的用户界面和交互体验

## Non-Goals (Out of Scope)

* 不支持多语言文字识别（仅支持中文和英文）

* 不支持复杂的图形绘制

* 不支持多人同时使用

* 不提供签名的法律有效性保证

## Background & Context

* 使用 MediaPipe 进行手势识别

* 使用 Web 技术（HTML/CSS/JavaScript）构建前端界面

* 使用火山引擎的文字生成相关API进行签名美化

* 项目将在浏览器中运行，无需安装桌面应用

## Functional Requirements

* **FR-1**: 实时摄像头访问和视频流显示

* **FR-2**: 手势识别（21个关键点）

* **FR-3**: 食指与拇指捏合动作检测

* **FR-4**: 在视频画面上实时绘制写字轨迹

* **FR-5**: 保存手写内容为图片

* **FR-6**: 调用火山引擎API生成签名

* **FR-7**: 显示原始手写和生成的签名对比

## Non-Functional Requirements

* **NFR-1**: 手势识别延迟 < 100ms

* **NFR-2**: 写字轨迹流畅，无明显卡顿

* **NFR-3**: 响应式设计，支持主流屏幕尺寸

* **NFR-4**: 清晰的用户指导和错误提示

## Constraints

* **Technical**: 浏览器必须支持 WebRTC 和 MediaPipe

* **Business**: 需要用户提供火山引擎API密钥

* **Dependencies**: MediaPipe Hands, 火山引擎API

## Assumptions

* 用户设备配备可用的摄像头

* 用户有稳定的网络连接访问火山引擎API

* 用户能够提供有效的火山引擎API密钥

* 浏览器支持必要的Web API（WebRTC, Canvas等）

## Acceptance Criteria

### AC-1: 摄像头访问成功

* **Given**: 用户允许访问摄像头

* **When**: 打开应用页面

* **Then**: 视频流正常显示在页面上

* **Verification**: `programmatic`

### AC-2: 手势识别正常

* **Given**: 摄像头正常工作

* **When**: 用户将手放在摄像头前

* **Then**: 能够识别出手部21个关键点

* **Verification**: `programmatic`

### AC-3: 捏合动作检测

* **Given**: 手势识别正在运行

* **When**: 用户将食指和拇指捏合在一起

* **Then**: 系统检测到捏合动作并开始写字

* **Verification**: `programmatic`

### AC-4: 写字轨迹显示

* **Given**: 检测到捏合动作

* **When**: 用户移动手部进行写字

* **Then**: 屏幕上实时显示写字轨迹

* **Verification**: `human-judgment`

### AC-5: 生成签名

* **Given**: 用户完成写字并点击生成签名

* **When**: 调用火山引擎API

* **Then**: 显示生成的美观手写体签名

* **Verification**: `human-judgment`

## Open Questions

* [ ] 火山引擎具体使用哪个API进行签名生成？

* [ ] 是否需要保存用户的历史签名？

* [ ] 支持的签名样式有哪些？

## What Changes
- **BREAKING**: 移除 MediaPipe 相关的依赖和手势识别逻辑
- **BREAKING**: 移除摄像头视频流显示和相关的 Canvas 绘制逻辑
- 添加一个文本输入框供用户直接输入想要生成签名的文字
- 简化界面布局，移除不需要的控制按钮（如"开始摄像头"、"清除"等）
- 保持火山引擎 API（SeedDream模型）调用逻辑不变，但不再需要调用 OCR（VLM模型）识别图片文字
- 将项目名称及界面标题更新为包含“豆包大模型生成个性化签名”等字样的名称，以突出模型提供方。


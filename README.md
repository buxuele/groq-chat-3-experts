# AI 智囊团

### https://groq-chat-3-experts.vercel.app/


从三位专家视角获取洞察：历史专家、硅谷创业导师、行为心理学专家。

## 特色功能

- 三位 AI 专家同时分析你的问题
- 对话历史本地存储
- Markdown 和代码高亮支持
- 玻璃拟态 UI 设计（透明毛玻璃效果）
- 可爱背景图片
- 纯前端应用，无需后端

## UI 特性

- 玻璃拟态设计风格（Glassmorphism）
- 半透明毛玻璃卡片效果
- 背景图片 + 渐变叠加
- 响应式布局，支持移动端
- 深色主题优化

## 本地开发

1. 安装依赖：
```bash
npm install
```

2. 创建 `.env` 文件并添加 Groq API Key：
```bash
VITE_GROQ_API_KEY=your_api_key_here
```

获取免费 API Key：[console.groq.com](https://console.groq.com)

3. 启动开发服务器：
```bash
npm run dev
```

4. 访问 http://localhost:5173

## 部署到 Vercel

1. 将代码推送到 GitHub

2. 访问 [vercel.com](https://vercel.com)

3. 点击 "Import Project"

4. 选择你的 GitHub 仓库

5. 配置项目：
   - Framework Preset: Vite
   - Root Directory: `.` (或留空)
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. 添加环境变量：
   - Name: `VITE_GROQ_API_KEY`
   - Value: 你的 Groq API Key

7. 点击 "Deploy"

## 构建生产版本

```bash
npm run build
```

构建产物在 `dist` 目录。

## 技术栈

- React 19
- Vite
- Tailwind CSS
- Groq API
- React Markdown
- LocalStorage
- Lucide React Icons

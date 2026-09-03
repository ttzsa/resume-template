# 极简简历

结构化、模块化、所见即所得的 A4 简历编辑器。内容不是一整块不可控的富文本，而是由个人信息、教育背景、实习经历、项目经历、自由模块和可嵌套内容块组成。

## 完整启动流程

### 1. 环境要求

- Node.js `22.13.0` 或更高版本
- npm
- Python 3.10 或更高版本
- Windows 10/11（项目内置的 `npm run server` 命令使用 Windows 虚拟环境路径）

### 2. 获取项目

```powershell
git clone https://github.com/ttzsa/resume-template.git
cd resume-template
```

如果已经下载了项目，直接进入 `resume-template` 目录即可。

### 3. 安装前端依赖

```powershell
npm install
```

### 4. 创建并安装 PDF 服务环境

```powershell
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r server\requirements.txt
.\.venv\Scripts\python.exe -m playwright install chromium
```

PDF 服务使用 Playwright 启动无头 Chromium，把与网页预览一致的简历页面导出成 PDF。

### 5. 配置本地环境变量

```powershell
Copy-Item .env.example .env.local
```

默认配置如下，无需修改即可本地运行：

```env
NEXT_PUBLIC_PDF_SERVICE_URL=http://localhost:8000
FRONTEND_ORIGINS=http://localhost:3000
```

### 6. 启动前端

打开第一个 PowerShell 窗口：

```powershell
npm run dev
```

前端默认地址：<http://localhost:3000>

### 7. 启动 PDF 服务

保持前端运行，再打开第二个 PowerShell 窗口：

```powershell
npm run server
```

PDF 服务默认地址：<http://localhost:8000>

可以通过下面的地址检查服务状态：

<http://localhost:8000/health>

### 8. 打开应用

浏览器访问：

<http://localhost:3000>

至此，内容编辑、实时预览、本地保存、JSON 导入导出和 PDF 导出均可使用。

### macOS / Linux 启动 PDF 服务

前端启动方式不变。后端请使用以下命令：

```bash
python3 -m venv .venv
.venv/bin/python -m pip install --upgrade pip
.venv/bin/python -m pip install -r server/requirements.txt
.venv/bin/python -m playwright install chromium
.venv/bin/python -m uvicorn server.main:app --port 8000
```

## 使用说明

### 编辑个人信息

1. 在左侧选择“个人信息”。
2. 编辑姓名、意向岗位、电话、邮箱、GitHub 和自定义字段。
3. 电话、邮箱和 GitHub 可以分别控制是否显示。
4. 上传照片后，可以调整宽度、高度、左右偏移和上下偏移。
5. 联系方式过长时会在照片左侧自动换行，不会与照片重叠。

### 编辑教育、实习和项目经历

1. 在“简历结构”中选择对应模块。
2. 直接修改学校、学位、专业、公司、岗位、项目名称、职责、日期和其他信息。
3. 每段经历都可以添加、删除和拖动排序。
4. “字段行 · 单独排版”支持：
   - 单行或自动换行；
   - 单独调整字号；
   - 点号、短横线或无分隔符；
   - 调整字段间距；
   - 分别隐藏字段或移除整行。
5. 空字段不会在简历中留下多余圆点或分隔符。

### 修改局部文字样式

1. 在左侧富文本输入框中选中文字。
2. 使用浮动工具栏修改字体、字号、粗体、斜体、下划线、颜色和链接。
3. 支持微软雅黑、宋体、思源黑体、Times New Roman 和楷体。
4. 颜色工具会保留原文字选区，选择颜色后会应用到已经选中的文字。

### 添加内容块

经历和自由模块支持以下结构化内容：

- 段落；
- 键值对；
- 空心圆列表；
- 实心圆列表；
- 数字列表；
- 嵌套列表和分组。

内容块可以添加、删除和拖动排序。列表缩进支持负数，向左移动时不会改变右侧边界。

### 调整全局样式

切换到左侧“设计”页签，可以调整：

- A4 页面四周边距；
- 默认字体、字号和行高；
- 正文颜色；
- 大模块间距和段落内容间距；
- 模块标题字号、颜色、粗细和横线；
- 日期颜色；
- 字段分隔符与字段间距；
- Bullet 缩进、大小、颜色和内容项间距；
- 链接颜色和下划线。

“模块间距”只控制个人信息、教育背景、实习经历、项目经历、科研经历、专业技能以及新增大模块之间的距离。

### 保存和恢复

- 编辑内容会自动保存到浏览器 IndexedDB。
- 点击顶部“保存”可以立即保存。
- 支持撤销、重做以及 `Ctrl+Z`。
- 浏览器中的历史草稿优先于默认示例加载。
- 如需恢复匿名演示数据，请先导出 JSON 备份，再点击预览工具栏中的“恢复默认示例”。

### JSON 导入和导出

- “导出 JSON”会下载完整的结构化简历数据。
- “导入”可以恢复之前导出的 JSON 文件。
- 导入时会通过 Resume Schema 校验，避免不完整数据破坏编辑器。

### 导出 PDF

确保前端和 PDF 服务都在运行，然后点击右上角“导出 PDF”。

导出流程：

1. 前端把当前结构化简历发送到本地 PDF 服务。
2. PDF 服务打开专用打印页面。
3. Chromium 按 A4 尺寸生成 PDF。
4. 浏览器自动下载文件。

如果未配置或无法连接 PDF 服务，应用会回退到浏览器打印功能。

## 功能特点

- 结构化 Resume Schema，而不是单一富文本 HTML。
- 模块、经历、项目和内容块均可独立排序。
- A4 实时预览和自动分页。
- 预览与 PDF 共用同一套 Renderer 和 CSS Variables。
- 局部富文本样式与全局设计系统并存。
- 照片右上角定位及数值偏移。
- 本地 IndexedDB 自动保存。
- JSON 可移植数据格式。
- 匿名化默认演示数据。
- 桌面端双栏编辑，窄屏自动切换为单栏。

## 技术栈

### 前端

- React 19
- TypeScript
- Vinext / Vite
- Zustand
- Tiptap
- dnd-kit
- Zod
- idb-keyval

### PDF 服务

- Python
- FastAPI
- Playwright
- Chromium

### 测试

- Vitest
- Testing Library
- Playwright End-to-End

## 项目结构

```text
resume-template/
├─ app/                      页面入口、全局样式和元数据
├─ public/                   静态资源和分享预览图
├─ server/                   FastAPI PDF 服务
├─ src/
│  ├─ editor/                编辑器和设计面板
│  ├─ pagination/            A4 自动分页
│  ├─ pdf/                   PDF 载荷与打印页面
│  ├─ renderer/              简历渲染组件
│  ├─ richtext/              Tiptap 富文本编辑器
│  ├─ schema/                Resume Schema、类型和默认数据
│  ├─ store/                 Zustand 状态、本地存储和导入导出
│  └─ themes/                主题与 CSS Variables
├─ e2e/                      端到端测试
├─ package.json
└─ playwright.config.ts
```

## 常用命令

```powershell
# 启动前端开发服务器
npm run dev

# 启动 Windows PDF 服务
npm run server

# 运行单元测试
npm test

# 监听模式运行测试
npm run test:watch

# 运行端到端测试
npm run test:e2e

# 生成生产构建
npm run build

# 检查代码
npm run lint

# 格式化代码
npm run format
```

## 数据和隐私

- 默认演示内容使用“姓名”“学校名”“公司名”“项目名”等占位信息。
- 简历草稿默认保存在当前浏览器中，不会自动上传到远程服务器。
- PDF 导出只会把当前简历发送到你配置的 PDF 服务地址。
- `.env`、虚拟环境、依赖目录、构建产物、本地输出文件和测试结果均已加入 `.gitignore`。

## 常见问题

### 页面可以打开，但无法导出 PDF

确认第二个终端中的 PDF 服务正在运行，并访问 <http://localhost:8000/health>。如果 Playwright 提示缺少浏览器，执行：

```powershell
.\.venv\Scripts\python.exe -m playwright install chromium
```

### 修改默认数据后，页面仍显示旧内容

应用会优先恢复浏览器里保存的草稿。请先导出 JSON 备份，再点击“恢复默认示例”。

### PowerShell 不允许激活虚拟环境

README 中的命令直接调用 `.venv\Scripts\python.exe`，不需要执行激活脚本，因此不受 PowerShell 执行策略影响。

### 端口被占用

- 前端默认使用 `3000` 端口。
- PDF 服务默认使用 `8000` 端口。
- 修改端口后，请同步更新 `.env.local` 中的地址以及 `FRONTEND_ORIGINS`。

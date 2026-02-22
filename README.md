<div align="center">
  <h1>🎲 恶棍角色生成器 (Knave Character Builder)</h1>
  <p>一个轻量级、直观的网页端工具，专为 OSR 跑团游戏《Knave（恶棍）》设计，用于快速生成和管理角色卡。</p>
</div>

## ✨ 核心功能

- **⚡ 一键生成**：一键随机掷骰生成属性（Stats）、生命值（HP）、特质（Traits）及初始装备。
- **📝 灵活编辑**：支持手动调整角色等级、经验值、生命值，并可以自由交换属性点数。
- **🎒 物品栏管理**：自动计算体质属性（Constitution）对应的背包槽位，支持物品的手动添加、修改与删除。
- **📚 规则与速查**：内置《Knave》核心规则以及法术、物品速查表，随时翻阅，无缝体验。
- **🖨️ 打印输出**：提供干净、直观的“角色卡”视图，非常适合一键打印为实体卡片使用。

## 🚀 本地运行体验

**环境要求：**
- Node.js (推荐 v16+ 版本)

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动本地开发服务器**
   ```bash
   npm run dev
   ```

3. **构建生产版本** (可选)
   ```bash
   npm run build
   ```

## 🌐 线上部署 (GitHub Pages)

本项目已经配置好了自动发布到 [GitHub Pages](https://pages.github.com/) 的工作流。

**部署步骤：**
1. 确保你已将此代码库（包含 `.github/workflows/deploy.yml`）推送到你自己的 GitHub 仓库。
2. 在你的 GitHub 仓库主页，点击上方的 **Settings** 标签。
3. 在左侧菜单中找到并点击 **Pages**。
4. 在 **Build and deployment** 下的 **Source** 下拉菜单中，选择 **GitHub Actions**。
5. 等待 GitHub Actions 自动运行完成，你的网页就可以在线访问了！链接格式通常为 `https://<你的用户名>.github.io/<仓库名>/`。

## 🛠️ 技术栈

- **框架**：React 18, Vite
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **图标**：Lucide React

## 📄 致谢
- **Knave 英文原作**：[Questing Beast](https://questingbeast.itch.io/knave)
- **Knave 中文版翻译与校对**：ZzNoah, 白药君, 年糕
- 本应用使用 AI 结对编程驱动完成。

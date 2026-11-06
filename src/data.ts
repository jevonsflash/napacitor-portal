export const DOCS_BASE = 'https://napacitor.matoapp.net/docs';
export const GITHUB_BASE = 'https://github.com/jevonsflash/Napacitor';

export const quickSteps = [
  {
    number: '01',
    title: '插入你的 Web 应用',
    description: '保留现有页面、组件与构建工具。安装核心运行时，再把 MAUI 宿主和 CLI 加入开发依赖。',
    note: '原生 JS / React / Vue / Angular 都可以',
    commands: ['npm i @napacitor/core', 'npm i -D @napacitor/maui @napacitor/cli'],
  },
  {
    number: '02',
    title: '初始化，并同步原生宿主',
    description: '指定应用 ID、名称和 Web 产物目录。Napacitor 会生成一份 MAUI 工程，并自动连接 Web 产物与插件工程。',
    note: '之后每次前端改动，运行 npx nap sync',
    commands: ['npx nap init com.example.app "My App" --web-dir dist', 'npx nap add maui'],
  },
  {
    number: '03',
    title: '让同一套代码原生运行',
    description: '选择目标平台，一条命令完成宿主构建与运行。你的 Web 界面，现在开始使用真正的设备能力。',
    note: '目标可选 android / ios / maccatalyst / windows',
    commands: ['npx nap run --target android'],
  },
];

export const plugins = [
  { id: 'camera', name: 'Camera', description: '拍照、录像与媒体选择，用一致的 Promise API 调用系统能力。', color: '#ff7a66' },
  { id: 'geolocation', name: 'Geolocation', description: '获取当前位置，并持续跟踪设备的位置变化。', color: '#64f4d2' },
  { id: 'filesystem', name: 'Filesystem', description: '访问应用目录、打包文件与系统文件选择器。', color: '#a390f2' },
  { id: 'preferences', name: 'Preferences', description: '用轻量键值存储保存应用设置与用户偏好。', color: '#f5f871' },
  { id: 'share', name: 'Share', description: '唤起系统分享面板，把内容自然交给其他应用。', color: '#ff5cb8' },
  { id: 'clipboard', name: 'Clipboard', description: '读写系统剪贴板，在应用之间传递文本。', color: '#75b9ff' },
];

export const documents = [
  { title: '快速开始', description: '从环境准备到第一次运行，完成首个 Napacitor 应用。', path: '/main/getting-started/installation', color: '#f5f871' },
  { title: 'CLI 参考', description: 'init、sync、build、run 与 assets 的完整命令和参数。', path: '/cli', color: '#64f4d2' },
  { title: '插件 API', description: '浏览官方插件的 TypeScript 接口与平台行为。', path: '/apis', color: '#ff7a66' },
  { title: '创建插件', description: '用一个 C# 类和 TypeScript 定义连接自有原生能力。', path: '/plugins/creating-plugins/overview', color: '#a390f2' },
  { title: 'MAUI 平台', description: '理解 BlazorWebView 宿主、配置与多平台目标。', path: '/main/maui', color: '#75b9ff' },
  { title: '商店发布', description: '了解 App Store 发布，并继续探索其他商店指南。', path: '/main/maui/deploying-to-app-store', color: '#ff5cb8' },
];

export const scenarios = [
  { industry: '企业内部系统', title: '一套业务前端，覆盖工位与外勤', description: '复用现有 Web 表单与业务界面，让桌面客户端和移动终端共享同一套产品逻辑。', accent: '#64f4d2' },
  { industry: '工业现场', title: '把设备能力带到触控终端', description: '通过设备、文件与传感器插件，让熟悉的 Web 界面连接真实现场。', accent: '#ff7a66' },
  { industry: '零售门店', title: '从收银桌面到店员平板', description: '统一门店界面与交互，在不同屏幕之间延续一致的使用体验。', accent: '#f5f871' },
  { industry: '教育内容', title: '让课程应用走进更多课堂', description: '把既有课程内容与互动页面带到课堂平板、学生手机和家用电脑。', accent: '#a390f2' },
  { industry: '效率工具', title: 'Web 迭代速度，桌面能力边界', description: '用 JavaScript 快速演进界面，用 .NET 连接文件、窗口与系统服务。', accent: '#ff5cb8' },
  { industry: '团队工程化', title: '把跨平台交付写进自动化', description: '让 CLI 进入脚本与 CI，重复执行同步、构建、清理和运行。', accent: '#75b9ff' },
];

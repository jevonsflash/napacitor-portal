# Napacitor 流程图集

> 依据 [Napacitor.md](./Napacitor.md) 整理的专业流程框图，全部使用 Mermaid 绘制（支持 VS Code / GitHub / AtomGit 原生渲染）。

---

## 1. 总体架构分层图

自顶向下四层：应用工程 → MAUI Blazor 宿主 → Napacitor 运行时 + 插件 → .NET MAUI。

```mermaid
flowchart TB
    subgraph L1["① 应用工程（用户的 Web 前端项目）"]
        direction LR
        DIST["dist/<br/>Web 构建产物"]
        CFG["napacitor.config.json"]
        PKGS["node_modules/@napacitor/<br/>core · maui · device · …"]
    end

    subgraph L2["② MAUI Blazor 宿主（nap add maui 生成 maui/ 目录）"]
        direction LR
        CSPROJ["App.csproj（多 TFM）<br/>MainPage(BlazorWebView)"]
        WWW["wwwroot/<br/>nap copy 拷入的 Web 产物<br/>+ entries.json"]
        PROPS["napacitor.build.props<br/>（nap sync 生成，接入 C# 工程）"]
    end

    subgraph L3["③ Napacitor 运行时 + 插件（C#，反射自动发现）"]
        direction LR
        RUNTIME["NapacitorRuntime<br/>eval 注入 native-bridge.js"]
        BRIDGE["JS ⇄ DotNet.invokeMethodAsync<br/>('Napacitor', …)"]
    end

    subgraph L4["④ .NET MAUI 10"]
        direction LR
        TFM["net10.0-android · net10.0-ios<br/>net10.0-maccatalyst<br/>net10.0-windows10.0.19041"]
    end

    L1 -- "nap add maui / nap sync" --> L2
    L2 --> L3
    L3 --> L4

    style L1 fill:#e8f4fd,stroke:#4a90d9
    style L2 fill:#eafbea,stroke:#4caf50
    style L3 fill:#fff4e0,stroke:#ff9800
    style L4 fill:#f3e8fd,stroke:#9c27b0
```

---

## 2. 用户工作流（快速上手，与 Capacitor 同形）

```mermaid
flowchart LR
    subgraph S1["① 安装与初始化（Web 前端项目中）"]
        direction TB
        A1["npm install @napacitor/core<br/>@napacitor/maui @napacitor/cli -D"]
        A2["npm install @napacitor/device<br/>@napacitor/battery（按需装插件）"]
        A3["npx nap init<br/>com.example.app 'My App' --web-dir dist"]
        A1 --> A2 --> A3
    end

    subgraph S2["② 生成宿主与同步"]
        direction TB
        B1["npm run build<br/>（产物输出到 dist/）"]
        B2["npx nap add maui<br/>生成 maui/ 宿主工程（自动 sync）"]
        B3["npx nap assets（可选）<br/>注入品牌图标/启动屏/主题颜色"]
        B1 --> B2 --> B3
    end

    subgraph S3["③ 构建与运行"]
        direction TB
        C1["npx nap build --target windows"]
        C2["npx nap run --target<br/>windows / android / ios / maccatalyst"]
        C3["npx nap open maui<br/>（用 IDE 打开宿主工程）"]
        C1 --> C2
    end

    S1 --> S2 --> S3
    S3 -. "每次改动前端" .-> D["npx nap sync<br/>copy + 重新生成 napacitor.build.props"]
    D --> S3
    C2 -. "清理（先停止运行）" .-> E["npx nap clean --target windows"]

    style S1 fill:#e8f4fd,stroke:#4a90d9
    style S2 fill:#eafbea,stroke:#4caf50
    style S3 fill:#fff4e0,stroke:#ff9800
```

> 注：Windows 平台的 `run` 不含构建，需先 `build` 再 `run`；应用运行中会锁定 DLL，`clean` 前需先停止。

---

## 3. 宿主启动模型（时序）

```mermaid
sequenceDiagram
    autonumber
    participant Host as MAUI Blazor 宿主
    participant BWV as BlazorWebView
    participant RT as NapacitorRuntime
    participant JS as Web 页面 (window)

    Host->>BWV: 加载 wwwroot/index.html<br/>根组件 Main.razor 挂到 #napacitor-root
    BWV-->>Host: OnAfterRenderAsync(firstRender)
    Host->>RT: StartAsync(JS)
    RT->>RT: 反射发现 [NapacitorPlugin] 插件
    RT->>JS: eval 注入 window.NapacitorNative 平台信息桩<br/>+ 内嵌 napacitor-native-bridge.js<br/>（接管 window.Napacitor，console 按需转发）
    RT->>JS: __fetchText 读 napacitor.config.json
    Note over RT: 应用 loggingBehavior<br/>none / debug(缺省) / production<br/>并打开 JS console 转发
    RT->>JS: 按 napacitor.entries.json 顺序<br/>import() Web 入口脚本
    JS-->>Host: 应用启动完成
```

---

## 4. 插件调用链路（JS ⇄ C# 双向通信）

```mermaid
sequenceDiagram
    autonumber
    participant Web as Web 前端（@napacitor/device 等）
    participant Bridge as napacitor-native-bridge.js（window.Napacitor）
    participant Runtime as NapacitorRuntime（C#）
    participant Plugin as 插件类（NapacitorPluginBase 子类）
    participant Native as MAUI Essentials 原生 API

    Web->>Bridge: 调用插件 API（如 Device.getInfo()）
    Bridge->>Runtime: DotNet.invokeMethodAsync('Napacitor',<br/>'NAP_invoke', pluginId, method, argsJson)
    Runtime->>Runtime: 按程序集名前缀 Napacitor* 反射定位插件
    Runtime->>Plugin: 分发调用（camelCase ↔ PascalCase 忽略大小写）
    Plugin->>Native: 访问原生能力
    Native-->>Plugin: 返回结果
    Plugin-->>Runtime: 返回值（不可用功能抛 NotImplemented）
    Runtime-->>Bridge: 信封 ok+data JSON（异常 → NOT_IMPLEMENTED NapacitorException）
    Bridge-->>Web: Promise resolve

    Note over Plugin,Bridge: 事件流（反向）
    Native-->>Plugin: 原生事件（如 BatteryInfoChanged）
    Plugin->>Bridge: NotifyListeners(eventName, data)<br/>→ NapacitorNative.__emit(callbackId, dataJson)
    Bridge-->>Web: 触发 addListener 回调
    Plugin->>Bridge: TriggerJSEventAsync(name, target, data)<br/>（原生 → Web 广播，JS 以 window.addEventListener 接收）
```

---

## 5. 插件开发结构（三段式，以 plugins/device 为样板）

```mermaid
flowchart TB
    subgraph TS["TS 层（src/ + dist/）"]
        direction LR
        IDX["index.ts<br/>registerPlugin 封装"]
        DEF["definitions.ts<br/>类型定义"]
        WEB["web.ts<br/>浏览器实现"]
        DIST2["dist/（tsc 产物 CJS + d.ts，已提交）"]
        IDX --> DIST2
        DEF --> DIST2
        WEB --> DIST2
    end

    subgraph CS["C# 原生层（maui/）"]
        direction LR
        CSP["Napacitor.Device.csproj<br/>net10.0 · 引用运行时<br/>Maui.Essentials 10.0.20"]
        IMPL["DevicePlugin.cs<br/>NapacitorPlugin(Device) 特性标注<br/>+ NapacitorMethod —— 零注册"]
        CSP --> IMPL
    end

    subgraph PKG["package.json"]
        PEER["peerDeps: @napacitor/core<br/>files: dist/ + maui/"]
    end

    TS --> APP["应用侧使用：<br/>import { Device } from '@napacitor/device'"]
    CS --> APP
    PKG --> APP

    style TS fill:#e8f4fd,stroke:#4a90d9
    style CS fill:#fff4e0,stroke:#ff9800
    style PKG fill:#f3e8fd,stroke:#9c27b0
    style APP fill:#eafbea,stroke:#4caf50
```

### C# 侧要点分支

```mermaid
flowchart LR
    M["插件公共方法<br/>[NapacitorMethod]"] --> P1{"参数形态"}
    P1 --> P1a["0 个参数"]
    P1 --> P1b["1 个强类型 DTO<br/>camelCase 自动反序列化"]
    P1 --> P1c["1 个 NapacitorCall<br/>松散访问"]
    M --> P2{"能力类型"}
    P2 --> P2a["方法调用<br/>→ 返回 ok+data 信封"]
    P2 --> P2b["事件监听<br/>OnListenerAdded 订阅 /<br/>OnListenerRemoved 退订<br/>（见 plugins/battery）"]
    P2 --> P2c["原生→Web 广播<br/>TriggerJSEventAsync"]
    P2 --> P2d["不可用功能<br/>抛 NotImplemented(...)<br/>→ JS 收到 NOT_IMPLEMENTED"]

    style M fill:#fff4e0,stroke:#ff9800
```

---

## 6. 内置插件与原生映射总览

```mermaid
flowchart LR
    subgraph PLUGINS["官方插件套件（20 个）"]
        direction TB
        G1["设备信息类<br/>device · battery · app-info"]
        G2["交互类<br/>haptics · dialog · action-sheet · clipboard"]
        G3["分享与通信类<br/>share · email · sms · phone-dialer<br/>browser · app-launcher · file-viewer"]
        G4["系统状态类<br/>connectivity · flashlight · motion"]
        G5["数据类<br/>preferences · geolocation"]
    end

    subgraph ESSENTIALS["MAUI Essentials 映射"]
        E1["DeviceInfo · CultureInfo"]
        E2["Clipboard.SetTextAsync / GetTextAsync"]
        E3["Vibration（10/25/40ms 时长映射，Windows 无操作）"]
        E4["Share.RequestAsync(ShareTextRequest)"]
        E5["Battery.ChargeLevel / PowerSource /<br/>BatteryInfoChanged（事件管线示范）"]
    end

    PLUGINS --> RUN["NapacitorRuntime 反射发现<br/>（程序集名前缀 Napacitor*）"] --> ESSENTIALS

    style PLUGINS fill:#e8f4fd,stroke:#4a90d9
    style ESSENTIALS fill:#eafbea,stroke:#4caf50
    style RUN fill:#fff4e0,stroke:#ff9800
```

---

## 7. 仓库开发工作流

```mermaid
flowchart TB
    DEV["修改源码（core / cli / plugins）"] --> BUILD["npm run build --workspaces<br/>各包 tsc → 生成已提交的 dist/"]
    BUILD --> SYNC["npm run sync"]
    SYNC --> C1["core/dist/native-bridge.js<br/>→ maui/src/JSBridge/"]
    SYNC --> C2["maui-template/<br/>→ cli/assets/maui-template/"]
    C1 --> CONS["约束：<br/>· TS 严格模式，CJS + d.ts（兼容 Vue CLI 4 / webpack 4）<br/>· CLI 零 npm 运行时依赖（偏离 Capacitor）<br/>· C# 目标 .NET 10 / MAUI 10.0.20 /<br/>  JSInterop 10.0.0 / Maui.Essentials 10.0.20"]

    style DEV fill:#e8f4fd,stroke:#4a90d9
    style BUILD fill:#fff4e0,stroke:#ff9800
    style SYNC fill:#f3e8fd,stroke:#9c27b0
```

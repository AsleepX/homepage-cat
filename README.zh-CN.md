# Homepage Cat · 主页小猫

从 [AsleepX 的个人主页](https://asleepx.github.io/) 独立出来的 SVG 小猫组件。零运行时依赖，MIT 开源，适合个人主页和静态网站。

[交互示例源码](demo/index.html) · [下载演示视频](media/homepage-cat-demo.mp4) · [完整 API / English](README.md)

https://github.com/user-attachments/assets/8dd5c2d1-02ca-441d-9909-79d7047ffc55

## 能做什么

- 点击或用键盘唤醒，沿分隔线行走后重新睡下。
- 抓头、身体、尾巴时呈现不同悬挂姿态，支持指针和触摸输入。
- 松手后落在文字轮廓上，双脚分别寻找接触点，再步行、跳跃回家。
- 自动适应文字换行和字体加载；用 `data-cat-platform` 标记额外平台。
- 焦点在小猫上时按 Escape 归位，也可以调用 `reset()`。
- 支持减少动态效果偏好、隐藏标签页复位，以及 SPA 卸载清理。
- 可选扩展：头像融合、照片场景平台和自定义灯箱坐标映射。

## 三步接入

1. 把仓库完整的 `src/` 目录复制到网站的 `/vendor/homepage-cat/`。
2. 引入 CSS，在页面中放一个有宽度的容器作为小猫的家。
3. 页面挂载后调用 `createCat()`：

```html
<link rel="stylesheet" href="/vendor/homepage-cat/homepage-cat.css">
<main id="page">
  <h1>你好，世界。</h1>
  <div id="cat-home" style="border-top:1px solid #aaa"></div>
  <p>页面上的文字，就是小猫的落脚点。</p>
</main>
<script type="module">
  import { createCat } from '/vendor/homepage-cat/index.js';
  const cat = createCat({ track: '#cat-home', root: '#page' });
  // cat.reset();   // 回家
  // cat.destroy(); // 路由切换或组件卸载时清理
</script>
```

通过 HTTP(S) 访问，不要直接打开 `file://`。无需 npm 发布或构建。每个页面支持一只猫，重新挂载前调用 `destroy()`。请为组件保留 `.cat` / `cat-` CSS 类名；不要给 body 加 transform。

## React / Vue

在 React `useEffect` 或 Vue `onMounted` 内初始化；在 effect 清理函数或 `onBeforeUnmount` 中调用 `destroy()`。模块可以在 SSR 导入，但初始化必须在浏览器 DOM 挂载后执行。具体示例见英文文档。

## 配置和扩展

- `track`：必填，DOM 元素或选择器。
- `root`：地形扫描范围，默认 body，必须包含 track。
- `platformSelector`：额外平台选择器，默认 `[data-cat-platform]`。
- `data-cat-ignore`：排除不需要扫描的文字区域。
- 头像融合需要传入 `portrait`、`portraitImage` 和 `earButtons`，并自行提供耳朵/胡须图层。核心示例不包含个人头像、照片。
- 照片平台通过 `photoScenes` 注册归一化坐标，再设置 `data-cat-scene`。换照片需要重新描边。灯箱仅提供映射函数，不包含灯箱界面。

当前主要适用于普通文档布局；嵌套滚动容器、竖排文字、变换后的文字和封闭 Shadow DOM 不在支持范围。没有 CORS 权限的跨域图片会跳过轮廓采样。

## 本地开发

```sh
npm test
python3 -m http.server 4173
```

访问 `http://localhost:4173/demo/`。视频是真实浏览器操作录制，附英文字幕、无音轨。项目使用 MIT 许可证，转载和修改请保留 LICENSE。

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Copy, Github, Menu, Moon, Pause, Play, RotateCcw, Sun, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BootDevices, BrandMark, CliVisual, EcosystemVisual, HeroPlatforms, PlatformVisual, PluginDoodle, ProductVisual, TechLogoWall } from './components/Visuals';
import { DOCS_BASE, GITHUB_BASE, documents, plugins, quickSteps, scenarios } from './data';

function docLink(path: string) {
  return `${DOCS_BASE}${path}`;
}

function CodeBlock({ commands, step, onCopy, copied }: { commands: string[]; step: string; onCopy: (commands: string[], step: string) => void; copied: boolean }) {
  return (
    <div className="code-block">
      <div className="code-block__bar">
        <span><i /> bash</span>
        <button type="button" onClick={() => onCopy(commands, step)} aria-label={`复制第 ${Number(step)} 步命令`}>
          {copied ? <Check size={15} /> : <Copy size={15} />}
          <span>{copied ? '已复制' : '复制命令'}</span>
        </button>
      </div>
      <pre>{commands.map((command) => <code key={command}><span>$</span> {command}</code>)}</pre>
    </div>
  );
}

function SectionHeading({ label, title, description, light = false }: { label: string; title: React.ReactNode; description?: string; light?: boolean }) {
  return (
    <div className={`section-heading ${light ? 'section-heading--light' : ''}`} data-reveal>
      <div className="section-heading__label">{label}</div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

type Theme = 'dark' | 'light';

function App() {
  const root = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    try {
      return window.localStorage.getItem('napacitor-theme') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [copiedStep, setCopiedStep] = useState('');
  const [marqueePaused, setMarqueePaused] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.hero-product', { opacity: 0, scale: 0.94, x: 36, duration: 0.55 })
          .from('.hero-kicker', { opacity: 0, y: 14, duration: 0.25 }, '-=.35')
          .from('.hero-title-line', { opacity: 0, yPercent: 100, duration: 0.38, stagger: 0.06 }, '-=.18')
          .from('.hero-description, .hero-platforms, .hero-actions', { opacity: 0, y: 16, duration: 0.3, stagger: 0.05 }, '-=.18');

        gsap.to('.hero-product', {
          yPercent: 10,
          scale: 1.04,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.7 },
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
          gsap.from(element, {
            opacity: 0,
            y: 42,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 86%', once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal-media]').forEach((element) => {
          gsap.from(element, {
            opacity: 0,
            clipPath: 'inset(0 0 100% 0 round 24px)',
            scale: 1.04,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 82%', once: true },
          });
        });

        gsap.from('.quick-step__line', {
          scaleY: 0,
          transformOrigin: 'top',
          ease: 'none',
          scrollTrigger: { trigger: '.quick-steps', start: 'top 65%', end: 'bottom 70%', scrub: 0.5 },
        });

        const bootTimeline = gsap.timeline({
          scrollTrigger: { trigger: '.quick-step--run', start: 'top 88%', end: 'center 46%', scrub: 0.65 },
        });
        bootTimeline
          .from('.boot-laptop-wrap', { x: 240, scale: 0.78, opacity: 0.35 }, 0)
          .from('.boot-tablet-wrap', { y: 80, scale: 1.12, opacity: 0.45 }, 0)
          .from('.boot-phone-wrap', { x: -210, scale: 0.82, opacity: 0.35 }, 0)
          .from('.boot-ray', { opacity: 0, strokeDashoffset: 80 }, 0.15);

        const heroLayers = gsap.utils.toArray<HTMLElement>('.hero-layer + .hero-layer');
        const heroProduct = root.current?.querySelector('.hero-product');
        if (heroProduct && heroLayers.length) {
          let breathe: gsap.core.Tween | null = null;
          const settleAndBreathe = () => {
            breathe?.kill();
            breathe = gsap.to(heroLayers, { marginTop: '-39%', duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
          };
          gsap.set(heroLayers, { marginTop: '-50%' });
          gsap.to(heroLayers, { marginTop: '-41%', duration: 1.4, ease: 'power3.out', delay: 0.1, onComplete: settleAndBreathe });
          const onHeroEnter = () => {
            breathe?.kill();
            gsap.to(heroLayers, { marginTop: '-35%', duration: 0.6, ease: 'power3.out', overwrite: true });
          };
          const onHeroLeave = () => {
            breathe?.kill();
            gsap.to(heroLayers, { marginTop: '-41%', duration: 0.6, ease: 'power3.out', overwrite: true, onComplete: settleAndBreathe });
          };
          heroProduct.addEventListener('mouseenter', onHeroEnter);
          heroProduct.addEventListener('mouseleave', onHeroLeave);
          return () => {
            heroProduct.removeEventListener('mouseenter', onHeroEnter);
            heroProduct.removeEventListener('mouseleave', onHeroLeave);
          };
        }
      });
    }, root);
    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f7f5ff' : '#07060d');
    try {
      window.localStorage.setItem('napacitor-theme', theme);
    } catch {
      // Theme switching still works when storage is unavailable.
    }
  }, [theme]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('menu-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  async function copyCommands(commands: string[], step: string) {
    const text = commands.join('\n');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    setCopiedStep(step);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopiedStep(''), 2200);
  }

  const closeMenu = () => setMenuOpen(false);

  return (
    <div ref={root} className="site-shell">
      <a className="skip-link" href="#main">跳到主要内容</a>
      <header className="site-header">
        <div className="nav-wrap">
          <a className="brand-link" href="#top" aria-label="Napacitor 首页" onClick={closeMenu}><BrandMark /></a>
          <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="主导航" id="main-nav">
            <a href="#quickstart" onClick={closeMenu}>快速开始</a>
            <a href="#features" onClick={closeMenu}>核心能力</a>
            <a href="#scenarios" onClick={closeMenu}>行业场景</a>
            <a className="nav-github" href={GITHUB_BASE} target="_blank" rel="noreferrer" onClick={closeMenu}><Github size={17} /> GitHub</a>
          </nav>
          <button
            className="theme-toggle"
            type="button"
            aria-label={theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'}
            aria-pressed={theme === 'light'}
            title={theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'}
            onClick={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
            <a  className="button button--small nav-cta" href={docLink('')} target="_blank" rel="noreferrer" onClick={closeMenu}>开发文档 <ArrowUpRight size={13} /></a>

        
          <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="main-nav" aria-label={menuOpen ? '关闭导航菜单' : '打开导航菜单'} onClick={() => setMenuOpen((value) => !value)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-aurora" aria-hidden="true" />
          <div className="hero-grid" aria-hidden="true" />
          <div className="container hero-layout">
            <div className="hero-copy">
              <h1>
                <span className="hero-title-mask"><span className="hero-title-line">Napacitor</span></span>
                <span className="hero-title-mask"><span className="hero-title-line hero-title-line--color">混合开发应用的最佳实践</span></span>
              </h1>
              <p className="hero-description">使用现代 Web 工具链，为 Android、iOS、Windows 和 macOS 构建高性能原生应用——由单一 C# 运行时驱动所有平台。</p>
              <HeroPlatforms />
              <div className="hero-actions">
                <a className="button button--primary" href="#quickstart">快速开始 <ArrowDown size={17} /></a>
                <a className="text-link" href={docLink('')} target="_blank" rel="noreferrer">浏览开发文档 <ArrowUpRight size={16} /></a>
              </div>
            </div>
            <ProductVisual />
          </div>
        </section>

        <section className="quickstart section" id="quickstart">
          <div className="container">
            <SectionHeading label="快速开始" title={<>用三条命令<br /><span className="text-color">完成原生集成</span></>} description="不用推翻现有项目。保留你熟悉的开发方式，让 Napacitor 处理原生宿主、同步与运行。" />
            <div className="quick-steps">
              <div className="quick-step__line" aria-hidden="true" />
              {quickSteps.map((step, index) => (
                <article className={`quick-step ${index === 2 ? 'quick-step--run' : ''}`} key={step.number}>
                  <div className="quick-step__copy" data-reveal>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    <small><Check size={14} />{step.note}</small>
                  </div>
                  <div className="quick-step__content" data-reveal-media>
                    <CodeBlock commands={step.commands} step={step.number} onCopy={copyCommands} copied={copiedStep === step.number} />
                    {index === 2 && <>
                      <BootDevices replayKey={replayKey} />
                      <button className="replay-button" type="button" onClick={() => setReplayKey((key) => key + 1)}><RotateCcw size={14} /> 重播启动动画</button>
                    </>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="web-feature section" id="features">
          <div className="container feature-layout">
            <div className="feature-copy" data-reveal>
              <div className="feature-index">任意 WEB</div>
              <h2>兼容标准 Web 构建产物，<br /><span className="text-color">无需更换现有技术栈</span>。</h2>
              <p>原生 JavaScript、HTML、CSS，或 React、Angular、Vue——只要它能构建为 Web 产物，就能进入 Napacitor 的原生宿主。</p>
              <p>继续使用 Ant Design Mobile、Ionic、Framework7，也可以选择 MUI、Bootstrap、Tailwind CSS、Vuetify、Quasar 等你熟悉的组件生态。</p>
              <a className="text-link text-link--dark" href={docLink('/main/getting-started/templates')} target="_blank" rel="noreferrer">查看应用模板 <ArrowUpRight size={16} /></a>
            </div>
            <div data-reveal-media><TechLogoWall /></div>
          </div>
        </section>

        <section className="plugins-feature section">
          <div className="container">
            <SectionHeading label="官方插件" title={<>将原生 API 封装为<br /><span className="text-color">基于 Promise 的 JavaScript 接口</span></>} description="每个官方插件都把 .NET MAUI 原生 API 包装为一致、基于 Promise 的 JavaScript 接口。按需安装，无需重写业务前端。" />
            <div className="plugin-grid">
              {plugins.map((plugin) => (
                <a className={`plugin-card plugin-card--${plugin.id}`} href={docLink(`/apis/${plugin.id}`)} target="_blank" rel="noreferrer" key={plugin.id} data-reveal style={{ '--plugin-color': plugin.color } as React.CSSProperties}>
                  <div className="plugin-card__top"><PluginDoodle type={plugin.id} /><ArrowUpRight size={18} /></div>
                  <h3>{plugin.name}</h3>
                  <p>{plugin.description}</p>
                  <code>@napacitor/{plugin.id}</code>
                </a>
              ))}
            </div>
            <a className="feature-more" href={docLink('/apis')} target="_blank" rel="noreferrer">浏览全部官方插件 <ArrowRight size={16} /></a>
          </div>
        </section>

        <section className="cli-feature section">
          <div className="container feature-layout feature-layout--reverse">
            <div className="feature-copy" data-reveal>
              <div className="feature-index">CLI 自动化</div>
              <h2>配置、构建与运行的全流程<br /><span className="text-mint">由显式命令行完成</span>。</h2>
              <p>从 <code>init</code> 到 <code>run</code>，CLI 用同一条命令链完成配置、宿主生成、Web 同步、构建、清理与运行。零 npm 运行时依赖，让自动化环境更轻、更容易复现。</p>
              <div className="feature-points">
                <div><strong>面向自动化运维</strong><p>显式的目标与 Release 参数可写入脚本和 CI，减少依赖 IDE 的手工步骤；品牌图标、启动屏也能通过 <code>nap assets</code> 纳入流程。</p></div>
                <div><strong>面向 AI 开发</strong><p>命令边界清晰、参数可读，编码 Agent 能按同一工作流执行与验证，不必模拟鼠标操作 IDE。</p></div>
              </div>
              <a className="text-link" href={docLink('/cli')} target="_blank" rel="noreferrer">打开 CLI 参考 <ArrowUpRight size={16} /></a>
            </div>
            <div data-reveal-media><CliVisual /></div>
          </div>
        </section>

        <section className="ecosystem-feature section">
          <div className="container feature-layout">
            <div className="feature-copy" data-reveal>
              <div className="feature-index">双生态</div>
              <h2>JavaScript 与 .NET 两套生态，<br /><span className="text-color">在同一运行时内协作</span>。</h2>
              <p>界面层继续使用 npm、TypeScript 与你熟悉的框架；原生层则用 C# 插件、.NET MAUI 和 JSInterop 连接系统能力。</p>
              <p>团队可以延续依赖注入、模块化与 Volo.Abp 等 .NET 生态实践，让前端灵活性与成熟的工程体系在同一个应用里协作。</p>
              <a className="text-link" href={docLink('/plugins/creating-plugins/overview')} target="_blank" rel="noreferrer">了解插件开发模型 <ArrowUpRight size={16} /></a>
            </div>
            <div data-reveal-media><EcosystemVisual /></div>
          </div>
        </section>

        <section className="platform-feature section">
          <div className="container">
            <SectionHeading label="多平台兼容" title={<>单一 C# 运行时，<br />覆盖 <span className="text-yellow">手机与桌面四平台</span></>} description="一份 Web 前端代码，一个 C# 运行时，覆盖手机、平板与桌面。相比 Capacitor 的官方核心目标，Napacitor 将 Windows 与 macOS 桌面应用纳入同一工作流。" />
            <div className="platform-layout">
              <div data-reveal-media><PlatformVisual /></div>
              <div className="platform-table-wrap" data-reveal>
                <table className="platform-table">
                  <caption>官方目标平台与工作流</caption>
                  <thead><tr><th>平台</th><th>Napacitor</th><th>Capacitor</th></tr></thead>
                  <tbody>
                    <tr><td>Android / iOS</td><td><Check /> 单一 MAUI 宿主</td><td>官方支持</td></tr>
                    <tr><td>Windows</td><td><Check /> 桌面原生</td><td>非核心目标</td></tr>
                    <tr><td>macOS</td><td><Check /> Mac Catalyst</td><td>非核心目标</td></tr>
                    <tr><td>统一运行时</td><td><Check /> C# / .NET</td><td>多平台原生层</td></tr>
                  </tbody>
                </table>
                <a className="text-link" href={docLink('/main/maui')} target="_blank" rel="noreferrer">查看 MAUI 平台文档 <ArrowUpRight size={16} /></a>
              </div>
            </div>
          </div>
        </section>

        <section className="docs-section section" id="docs">
          <div className="container">
            <SectionHeading label="开发文档" title={<>文档按开发流程组织，<br /><span className="text-color">按当前任务直接查阅</span>。</>} description="从第一条命令到发布上架，找到与你当前任务对应的指南。" />
            <div className="docs-grid">
              {documents.map((document) => (
                <a className="doc-card" href={docLink(document.path)} target="_blank" rel="noreferrer" key={document.title} data-reveal style={{ '--doc-color': document.color } as React.CSSProperties}>
                  <div className="doc-card__number"><ArrowUpRight size={19} /></div>
                  <h3>{document.title}</h3>
                  <p>{document.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="scenarios-section section" id="scenarios">
          <div className="container scenarios-heading" data-reveal>
            <div>
              <div className="section-heading__label">价值与行业场景</div>
              <h2>同一运行时，<br /><span className="text-color">支撑多类典型工程场景</span>。</h2>
            </div>
            <div className="scenarios-heading__aside">
              <p>从既有 Web 系统到跨端工具，这些典型工作流都能复用 Napacitor 的桥接能力。</p>
              <button type="button" className="marquee-toggle" onClick={() => setMarqueePaused((value) => !value)} aria-label={marqueePaused ? '继续滚动行业场景' : '暂停滚动行业场景'}>
                {marqueePaused ? <Play size={15} /> : <Pause size={15} />}{marqueePaused ? '继续滚动' : '暂停滚动'}
              </button>
            </div>
          </div>
          <div className={`scenario-marquee ${marqueePaused ? 'is-paused' : ''}`}>
            <div className="scenario-track">
              {[...scenarios, ...scenarios].map((scenario, index) => (
                <article className="scenario-card" key={`${scenario.industry}-${index}`} aria-hidden={index >= scenarios.length} style={{ '--scenario-color': scenario.accent } as React.CSSProperties}>
                  <div className="scenario-card__tag"><i /> 适用场景 · {scenario.industry}</div>
                  <h3>{scenario.title}</h3>
                  <p>{scenario.description}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="container principle-quotes" data-reveal>
            <blockquote>“工作流同形，前端团队不必重学一套项目组织。”<cite>Napacitor 项目设计</cite></blockquote>
            <blockquote>“一个 C# 类，把自己的原生能力带进 Web。”<cite>插件开发模型</cite></blockquote>
            <blockquote>“同步、构建与运行，都能进入同一条自动化命令链。”<cite>CLI 工作流</cite></blockquote>
          </div>
        </section>

        <section className="final-cta section">
          <div className="container">
            <div className="cta-panel" data-reveal>
              <div className="cta-spectrum" aria-hidden="true" />
              <div className="cta-word" aria-hidden="true">NAPACITOR</div>
              <h2>现在使用Napacitor，</h2>
              <h2 className="cta-accent">为你的Web应用集成原生能力</h2>
              <div className="cta-actions">
                <a className="button button--dark"  href={docLink('')} target="_blank" rel="noreferrer" onClick={closeMenu}>开发文档 <ArrowUpRight size={13} /></a>
                <a className="button button--ghost-dark" href={GITHUB_BASE} target="_blank" rel="noreferrer"><Github size={17} /> 在 GitHub 查看</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <a className="brand-link" href="#top"><BrandMark /></a>

          </div>
          <div className="footer-links">
            <div><h3>产品</h3><a href="#quickstart">Napacitor</a></div>
            <div><h3>资源</h3><a href={docLink('')} target="_blank" rel="noreferrer">Napacitor开发文档</a><a href={"https://learn.microsoft.com/zh-cn/dotnet/maui"} target="_blank" rel="noreferrer">.NET Multi-Platform App UI 文档</a></div>
            <div><h3>项目</h3><a href={GITHUB_BASE} target="_blank" rel="noreferrer">GitHub</a><a href="https://github.com/jevonsflash/napacitor-starters" target="_blank" rel="noreferrer">Starters</a><a href={`${GITHUB_BASE}/issues`} target="_blank" rel="noreferrer">问题反馈</a><a href={`${GITHUB_BASE}/releases`} target="_blank" rel="noreferrer">版本发布</a></div>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 Napacitor. 保留所有权利。</span>
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">ICP 粤ICP备19056721号</a>
          <a href="#top">回到顶部 ↑</a>
        </div>
      </footer>
      <div className="sr-only" role="status" aria-live="polite">{copiedStep ? `第 ${Number(copiedStep)} 步命令已复制` : ''}</div>
    </div>
  );
}

export default App;

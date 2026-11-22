import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Copy, Github, Languages, Menu, Moon, Sun, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import { BrandMark, CapabilityDoodle, DocDoodle, HeroPlatforms, PluginDoodle, ProductVisual, TechLogoWall } from './components/Visuals';
import { DOCS_BASE, GITHUB_BASE, STARTERS_BASE, VCONTROL_BASE, documents, mauiDocsUrl, plugins, quickSteps, scenarios } from './data';
import { LANGUAGES } from './i18n';

function docLink(path: string) {
  return `${DOCS_BASE}${path}`;
}

function CodeBlock({ commands, step, onCopy, copied }: { commands: string[]; step: string; onCopy: (commands: string[], step: string) => void; copied: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="code-block">
      <div className="code-block__bar">
        <span><i /> {t('quickstart.bash')}</span>
        <button type="button" onClick={() => onCopy(commands, step)} aria-label={t('quickstart.copyStep', { step: Number(step) })}>
          {copied ? <Check size={15} /> : <Copy size={15} />}
          <span>{copied ? t('quickstart.copied') : t('quickstart.copy')}</span>
        </button>
      </div>
      <pre>{commands.map((command) => <code key={command}><span>$</span> {command}</code>)}</pre>
    </div>
  );
}

function SectionHeading({ label, title, description, light = false }: { label?: string; title?: React.ReactNode; description?: string; light?: boolean }) {
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
  const { t, i18n } = useTranslation();
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
  const [marqueePaused] = useState(false);
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
    document.documentElement.lang = i18n.language;
    document.title = t('meta.title');
  }, [i18n, i18n.language, t]);

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
  const currentLanguage = LANGUAGES.find((language) => language.code === i18n.language) ?? LANGUAGES[0];
  const toggleLanguage = () => {
    const nextIndex = (LANGUAGES.findIndex((language) => language.code === currentLanguage.code) + 1) % LANGUAGES.length;
    i18n.changeLanguage(LANGUAGES[nextIndex].code);
  };

  return (
    <div ref={root} className="site-shell">
      <a className="skip-link" href="#main">{t('common.skipLink')}</a>
      <header className="site-header">
        <div className="nav-wrap">
          <a className="brand-link" href="#top" aria-label={t('common.homeLabel')} onClick={closeMenu}><BrandMark /></a>
          <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label={t('common.mainNav')} id="main-nav">
            <a href="#quickstart" onClick={closeMenu}>{t('nav.quickstart')}</a>
            <a href="#capabilities" onClick={closeMenu}>{t('nav.capabilities')}</a>
            <a href="#scenarios" onClick={closeMenu}>{t('nav.scenarios')}</a>
            <a className="nav-github" href={GITHUB_BASE} target="_blank" rel="noreferrer" onClick={closeMenu}><Github size={17} /> {t('common.github')}</a>
          </nav>
          <button
            className="theme-toggle"
            type="button"
            aria-label={theme === 'dark' ? t('common.themeToLight') : t('common.themeToDark')}
            aria-pressed={theme === 'light'}
            title={theme === 'dark' ? t('common.themeToLight') : t('common.themeToDark')}
            onClick={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="lang-toggle"
            type="button"
            aria-label={t('common.languageToggle')}
            title={t('common.languageToggle')}
            onClick={toggleLanguage}
          >
            <Languages size={18} /> <span>{currentLanguage.label}</span>
          </button>
          <a className="button button--small nav-cta" href={docLink('')} target="_blank" rel="noreferrer" onClick={closeMenu}>{t('common.docs')} <ArrowUpRight size={13} /></a>
          <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="main-nav" aria-label={menuOpen ? t('common.menuClose') : t('common.menuOpen')} onClick={() => setMenuOpen((value) => !value)}>
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
                <span className="hero-title-mask"><span className="hero-title-line hero-title-line--color">{t('hero.titleLine2')}</span></span>
              </h1>
              <p className="hero-description">{t('hero.description')}</p>
              <HeroPlatforms />
              <div className="hero-actions">
                <a className="button button--primary" href="#quickstart">{t('hero.quickstart')} <ArrowDown size={17} /></a>
                <a className="text-link" href={docLink('')} target="_blank" rel="noreferrer">{t('hero.browseDocs')} <ArrowUpRight size={16} /></a>
              </div>
            </div>
            <ProductVisual />
          </div>
        </section>

        <section className="quickstart section" id="quickstart">
          <div className="container">
            <SectionHeading title={t('quickstart.title')} ></SectionHeading>
            <div className="quick-steps">
              {quickSteps.map((step) => {
                const description = t(`quickstart.steps.${step.number}.description`, { defaultValue: '' });
                return (
                  <article className="quick-step" key={step.number} data-reveal>
                    <div className="quick-step__copy">
                      <span className="quick-step__number">{step.number}</span>
                      <h3>{t(`quickstart.steps.${step.number}.title`)}</h3>
                      {description && <p>{description}</p>}
                    </div>
                    <div className="quick-step__content">
                      <CodeBlock commands={step.commands} step={step.number} onCopy={copyCommands} copied={copiedStep === step.number} />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="capabilities section" id="capabilities">
          <div className="container">
            <SectionHeading title={t('capabilities.title')} description={t('capabilities.description')} />
            <div className="capability-grid">
              {(['web', 'native', 'dotnet'] as const).map((type) => (
                <article className={`capability-card capability-card--${type}`} key={type} data-reveal>
                  <CapabilityDoodle type={type} />
                  <h3>{t(`capabilities.items.${type}.title`)}</h3>
                  <p>{t(`capabilities.items.${type}.description`)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="web-feature section" id="features">
          <div className="container feature-layout">
            <div className="feature-copy" data-reveal>
              <h2>{t('webFeature.title')}<br /><span className="text-color">{t('webFeature.titleAccent')}</span></h2>
              <p>{t('webFeature.p1')}</p>
              <p>{t('webFeature.p2')}</p>
              <a className="text-link text-link--dark" href={docLink('/main/getting-started/templates')} target="_blank" rel="noreferrer">{t('webFeature.templates')} <ArrowUpRight size={16} /></a>
            </div>
            <div data-reveal-media><TechLogoWall /></div>
          </div>
        </section>

        <section className="plugins-feature section">
          <div className="container">
            <SectionHeading  title={t('plugins.title')} description={t('plugins.description')} />
            <div className="plugin-grid">
              {plugins.map((plugin) => (
                <a className={`plugin-card plugin-card--${plugin.id}`} href={docLink(`/apis/${plugin.id}`)} target="_blank" rel="noreferrer" key={plugin.id} data-reveal style={{ '--plugin-color': plugin.color } as React.CSSProperties}>
                  <div className="plugin-card__top"><PluginDoodle type={plugin.id} /><ArrowUpRight size={18} /></div>
                  <h3>{plugin.name}</h3>
                  <p>{t(`plugins.items.${plugin.id}.description`)}</p>
                  <code>@napacitor/{plugin.id}</code>
                </a>
              ))}
            </div>
            <a className="feature-more" href={docLink('/apis')} target="_blank" rel="noreferrer">{t('plugins.browseAll')} <ArrowRight size={16} /></a>
          </div>
        </section>

        <section className="docs-section section" id="docs">
          <div className="container">
            <SectionHeading title={t('docs.title')}/>
            <div className="docs-grid">
              {documents.map((document) => (
                <a className="doc-card" href={docLink(document.path)} target="_blank" rel="noreferrer" key={document.id} data-reveal>
                  <DocDoodle type={document.icon} />
                  <h3>{t(`docs.items.${document.id}.title`)}</h3>
                  <p>{t(`docs.items.${document.id}.description`)}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="scenarios-section section" id="scenarios">
          <div className={`scenario-marquee ${marqueePaused ? 'is-paused' : ''}`}>
            <div className="scenario-track">
              {[...scenarios, ...scenarios].map((scenario, index) => (
                <article className="scenario-card" key={`${scenario.id}-${index}`} aria-hidden={index >= scenarios.length} style={{ '--scenario-color': scenario.accent } as React.CSSProperties}>
                  <div className="scenario-card__tag"><i /> {t('scenarios.tag', { industry: t(`scenarios.items.${scenario.id}.industry`) })}</div>
                  <h3>{t(`scenarios.items.${scenario.id}.title`)}</h3>
                  <p>{t(`scenarios.items.${scenario.id}.description`)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta section">
          <div className="container">
            <div className="cta-panel" data-reveal>
              <div className="cta-spectrum" aria-hidden="true" />
              <div className="cta-word" aria-hidden="true">NAPACITOR</div>
              <h2>{t('cta.line1')}</h2>
              <h2 className="cta-accent">{t('cta.line2')}</h2>
              <div className="cta-actions">
                <a className="button button--dark"  href={docLink('')} target="_blank" rel="noreferrer" onClick={closeMenu}>{t('common.docs')} <ArrowUpRight size={13} /></a>
                <a className="button button--ghost-dark" href={GITHUB_BASE} target="_blank" rel="noreferrer"><Github size={17} /> {t('cta.github')}</a>
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
            <div><h3>{t('footer.product')}</h3><a href="#quickstart">{t('footer.napacitor')}</a><a href={VCONTROL_BASE} target="_blank" rel="noreferrer">{t('footer.vcontrol')}</a></div>
            <div><h3>{t('footer.resources')}</h3><a href={docLink('')} target="_blank" rel="noreferrer">{t('footer.devDocs')}</a><a href={mauiDocsUrl(i18n.language)} target="_blank" rel="noreferrer">{t('footer.mauiDocs')}</a></div>
            <div><h3>{t('footer.project')}</h3><a href={GITHUB_BASE} target="_blank" rel="noreferrer">{t('common.github')}</a><a href={STARTERS_BASE} target="_blank" rel="noreferrer">{t('footer.starters')}</a><a href={`${GITHUB_BASE}/issues`} target="_blank" rel="noreferrer">{t('footer.issues')}</a><a href={`${GITHUB_BASE}/releases`} target="_blank" rel="noreferrer">{t('footer.releases')}</a></div>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>{t('footer.rights')}</span>
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">{t('footer.icp')}</a>
          <a href="#top">{t('footer.backToTop')}</a>
        </div>
      </footer>
      <div className="sr-only" role="status" aria-live="polite">{copiedStep ? t('quickstart.copiedStatus', { step: Number(copiedStep) }) : ''}</div>

    </div>
  );
}

export default App;

export const DOCS_BASE = 'https://napacitor.matoapp.net/docs';
export const GITHUB_BASE = 'https://github.com/jevonsflash/Napacitor';
export const STARTERS_BASE = 'https://github.com/jevonsflash/napacitor-starters';
export const VCONTROL_BASE = 'https://vcontrol.matoapp.net/';

// The Microsoft Learn MAUI docs are locale-aware; pick the right path per language.
export function mauiDocsUrl(language: string) {
  return language === 'zh'
    ? 'https://learn.microsoft.com/zh-cn/dotnet/maui'
    : 'https://learn.microsoft.com/en-us/dotnet/maui';
}

// Structural config only — all human-readable copy lives in the i18n bundles,
// keyed by `number` (quickSteps) or `id` (everything else).
export const quickSteps = [
  {
    number: '01',
    commands: ['npm i @napacitor/core', 'npm i -D @napacitor/maui @napacitor/cli'],
  },
  {
    number: '02',
    commands: ['npx nap init com.example.app "My App" --web-dir dist', 'npx nap add maui'],
  },
  {
    number: '03',
    commands: ['npx nap run --target android'],
  },
];

export const plugins = [
  { id: 'camera', name: 'Camera', color: '#ff7a66' },
  { id: 'geolocation', name: 'Geolocation', color: '#64f4d2' },
  { id: 'filesystem', name: 'Filesystem', color: '#a390f2' },
  { id: 'preferences', name: 'Preferences', color: '#f5f871' },
  { id: 'share', name: 'Share', color: '#ff5cb8' },
  { id: 'clipboard', name: 'Clipboard', color: '#75b9ff' },
];

export const documents = [
  { id: 'install', path: '/getting-started', color: '#f5f871', icon: 'start' },
  { id: 'cli', path: '/cli', color: '#64f4d2', icon: 'cli' },
  { id: 'apis', path: '/apis', color: '#ff7a66', icon: 'api' },
];

export const scenarios = [
  { id: 'enterprise', accent: '#64f4d2' },
  { id: 'industrial', accent: '#ff7a66' },
  { id: 'retail', accent: '#f5f871' },
  { id: 'education', accent: '#a390f2' },
  { id: 'productivity', accent: '#ff5cb8' },
  { id: 'engineering', accent: '#75b9ff' },
];

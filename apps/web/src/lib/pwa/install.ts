import { APP_RELEASE } from '@/lib/app-release';

export const PWA_SW_PATH = '/sw.js';
export const PWA_CACHE_BUST = APP_RELEASE.version;

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isIosSafari(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !(window as Window & { MSStream?: unknown }).MSStream;
}

export function canRegisterServiceWorker(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!canRegisterServiceWorker()) return null;

  try {
    return await navigator.serviceWorker.register(`${PWA_SW_PATH}?v=${PWA_CACHE_BUST}`, { scope: '/' });
  } catch (error) {
    console.warn('Service worker registration failed:', error);
    return null;
  }
}

export function subscribeToInstallPrompt(onPrompt: (event: BeforeInstallPromptEvent) => void) {
  if (typeof window === 'undefined') return () => undefined;

  const handler = (event: Event) => {
    event.preventDefault();
    onPrompt(event as BeforeInstallPromptEvent);
  };

  window.addEventListener('beforeinstallprompt', handler);
  return () => window.removeEventListener('beforeinstallprompt', handler);
}

export async function triggerInstallPrompt(event: BeforeInstallPromptEvent): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  try {
    await event.prompt();
    const { outcome } = await event.userChoice;
    return outcome;
  } catch {
    return 'unavailable';
  }
}

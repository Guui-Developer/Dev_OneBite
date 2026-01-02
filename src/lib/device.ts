/**
 * 네이티브 앱 환경인지 확인합니다.
 * Capacitor, Cordova, React Native WebView 등을 감지합니다.
 */
export function isNativeApp(): boolean {
  return !!(
    (window as any).Capacitor ||
    (window as any).cordova ||
    (window as any).ReactNativeWebView
  );
}

/**
 * PWA로 설치되어 실행 중인지 확인합니다.
 */
export function isPWAInstalled(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

/**
 * 브라우저(웹)에서 실행 중인지 확인합니다.
 * 네이티브 앱도 아니고 PWA도 아닌 경우입니다.
 */
export function isWebBrowser(): boolean {
  return !isNativeApp() && !isPWAInstalled();
}

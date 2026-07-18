import { registerRootComponent } from 'expo';

import App from './App';
import {
  recordBootError,
  setBootStage,
} from './src/services/bootDiagnostics';

setBootStage('js_entry');

// Best-effort logging for fatal JS errors in standalone builds (no redbox / adb).
// Swallowing fatals avoids the process exit that looks like "splash then close".
try {
  const errorUtils = globalThis.ErrorUtils;
  if (errorUtils?.getGlobalHandler && errorUtils?.setGlobalHandler) {
    const previous = errorUtils.getGlobalHandler();
    errorUtils.setGlobalHandler((error, isFatal) => {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : String(error);
      console.error('[NestBridge] Uncaught error', { isFatal, message });
      void recordBootError(isFatal ? 'fatal' : 'uncaught', message);

      // Non-fatal: keep default reporting. Fatal: do not rethrow/kill the APK —
      // AppErrorBoundary / next-launch banner can surface the persisted message.
      if (!isFatal && typeof previous === 'function') {
        previous(error, isFatal);
      }
    });
  }
} catch {
  // Ignore — never block app registration.
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

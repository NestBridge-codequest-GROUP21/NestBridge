import { registerRootComponent } from 'expo';

import App from './App';

// Best-effort logging for fatal JS errors in standalone builds (no redbox).
try {
  const errorUtils = globalThis.ErrorUtils;
  if (errorUtils?.getGlobalHandler && errorUtils?.setGlobalHandler) {
    const previous = errorUtils.getGlobalHandler();
    errorUtils.setGlobalHandler((error, isFatal) => {
      console.error('[NestBridge] Uncaught error', { isFatal, message: String(error) });
      if (typeof previous === 'function') {
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

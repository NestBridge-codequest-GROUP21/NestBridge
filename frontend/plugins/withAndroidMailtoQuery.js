const { withAndroidManifest, createRunOncePlugin } = require('expo/config-plugins');

/**
 * Android 11+ package visibility: allow resolving mailto / tel intents so
 * Linking.openURL('mailto:…') and tel: links work in release APKs.
 */
function ensureIntentQuery(queries, intent) {
  const list = Array.isArray(queries) ? queries : [];
  const actionName = intent.action?.[0]?.$?.['android:name'];
  const scheme = intent.data?.[0]?.$?.['android:scheme'];

  const alreadyPresent = list.some((entry) => {
    const intents = entry.intent;
    if (!Array.isArray(intents)) {
      return false;
    }
    return intents.some((existing) => {
      const existingAction = existing.action?.[0]?.$?.['android:name'];
      const existingScheme = existing.data?.[0]?.$?.['android:scheme'];
      if (scheme) {
        return existingAction === actionName && existingScheme === scheme;
      }
      return existingAction === actionName;
    });
  });

  if (alreadyPresent) {
    return list;
  }

  return [
    ...list,
    {
      intent: [intent],
    },
  ];
}

const withAndroidMailtoQuery = (config) =>
  withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    let queries = manifest.queries ?? [];

    queries = ensureIntentQuery(queries, {
      action: [{ $: { 'android:name': 'android.intent.action.SENDTO' } }],
      data: [{ $: { 'android:scheme': 'mailto' } }],
    });

    queries = ensureIntentQuery(queries, {
      action: [{ $: { 'android:name': 'android.intent.action.DIAL' } }],
    });

    manifest.queries = queries;
    return config;
  });

module.exports = createRunOncePlugin(
  withAndroidMailtoQuery,
  'withAndroidMailtoQuery',
  '1.0.0',
);

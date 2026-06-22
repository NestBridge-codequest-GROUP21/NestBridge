import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StudentEntryNavigator from './src/navigation/StudentEntryNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StudentEntryNavigator />
    </SafeAreaProvider>
  );
}

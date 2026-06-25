import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BootLoader from '../components/BootLoader';
import { useAuth } from '../context/AuthContext';
import { useAccountProfile } from '../context/AccountProfileContext';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

export default function RootNavigator() {
  const { user, isLoading: authLoading } = useAuth();
  const { isLoading: profileLoading } = useAccountProfile();

  if (authLoading || (user && profileLoading)) {
    return <BootLoader />;
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

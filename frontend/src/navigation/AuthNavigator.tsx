import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/auth/SplashScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import { splashMock, welcomeMock, registerMock, loginMock } from '../data/studentOnboardingMock';
import { useAuth } from '../context/AuthContext';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  const { register, signIn } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Splash">
        {({ navigation }) => (
          <SplashScreen
            {...splashMock}
            onContinue={() => navigation.replace('Welcome')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Welcome">
        {({ navigation }) => (
          <WelcomeScreen
            {...welcomeMock}
            onCreateAccount={() => navigation.navigate('Register')}
            onSignIn={() => navigation.navigate('Login')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Register">
        {({ navigation }) => (
          <RegisterScreen
            {...registerMock}
            fullName={fullName}
            email={email}
            password={password}
            keepSignedIn={keepSignedIn}
            errorMessage={registerError}
            onFullNameChange={setFullName}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onToggleKeepSignedIn={() => setKeepSignedIn((value) => !value)}
            onSubmit={async () => {
              try {
                setRegisterError('');
                await register(fullName, email, password, keepSignedIn);
              } catch (error) {
                setRegisterError(
                  error instanceof Error ? error.message : 'Could not create account.',
                );
              }
            }}
            onSignInPress={() => navigation.navigate('Login')}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Login">
        {({ navigation }) => (
          <LoginScreen
            {...loginMock}
            email={email}
            password={password}
            keepSignedIn={keepSignedIn}
            errorMessage={loginError}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onToggleKeepSignedIn={() => setKeepSignedIn((value) => !value)}
            onSubmit={async () => {
              setLoginError('');
              const ok = await signIn(email, password, keepSignedIn);
              if (!ok) {
                setLoginError('Email or password is incorrect.');
              }
            }}
            onCreateAccountPress={() => navigation.navigate('Register')}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

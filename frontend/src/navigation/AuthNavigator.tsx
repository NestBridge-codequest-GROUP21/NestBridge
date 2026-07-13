import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import { welcomeMock, registerMock, loginMock } from '../data/studentOnboardingMock';
import { DEMO_ACTOR_ACCOUNTS, DEMO_PASSWORD, type DemoAccount } from '../data/demoAccounts';
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
  const [demoLoginBusy, setDemoLoginBusy] = useState(false);

  const handleDemoLogin = async (account: DemoAccount) => {
    setLoginError('');
    setDemoLoginBusy(true);
    try {
      const ok = await signIn(account.email, DEMO_PASSWORD, keepSignedIn);
      if (!ok) {
        setLoginError(
          `Could not sign in as ${account.name}. Make sure the backend is running and Flyway seeds have applied.`,
        );
      }
    } finally {
      setDemoLoginBusy(false);
    }
  };

  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
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
                if (!fullName.trim()) {
                  setRegisterError('Please enter your full name.');
                  return;
                }
                if (!email.trim()) {
                  setRegisterError('Please enter your email address.');
                  return;
                }
                if (password.length < 6) {
                  setRegisterError('Password must be at least 6 characters.');
                  return;
                }
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
            demoAccounts={DEMO_ACTOR_ACCOUNTS}
            demoLoginBusy={demoLoginBusy}
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
            onDemoLogin={(account) => {
              void handleDemoLogin(account);
            }}
            onCreateAccountPress={() => navigation.navigate('Register')}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

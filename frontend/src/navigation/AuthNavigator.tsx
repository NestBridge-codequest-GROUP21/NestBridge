import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import VerifyEmailScreen from '../screens/auth/VerifyEmailScreen';
import { welcomeMock, registerMock, loginMock } from '../data/studentOnboardingMock';
import { DEMO_ACTOR_ACCOUNTS, DEMO_PASSWORD, type DemoAccount } from '../data/demoAccounts';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
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
  const [verifyStatus, setVerifyStatus] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [resendBusy, setResendBusy] = useState(false);

  const handleDemoLogin = async (account: DemoAccount) => {
    setLoginError('');
    setDemoLoginBusy(true);
    try {
      await signIn(account.email, DEMO_PASSWORD, keepSignedIn);
    } catch {
      setLoginError(
        `Could not sign in as ${account.name}. Make sure the backend is running and Flyway seeds have applied.`,
      );
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
                const result = await register(fullName, email, password, keepSignedIn);
                if (result.requiresEmailVerification) {
                  navigation.navigate('VerifyEmail', { email: result.email });
                } else {
                  await signIn(email, password, keepSignedIn);
                }
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

      <Stack.Screen name="VerifyEmail">
        {({ navigation, route }) => (
          <VerifyEmailScreen
            email={route.params.email}
            statusMessage={verifyStatus}
            errorMessage={verifyError}
            resendBusy={resendBusy}
            onResend={async () => {
              setVerifyStatus('');
              setVerifyError('');
              setResendBusy(true);
              try {
                await api.resendVerificationEmail(route.params.email);
                setVerifyStatus('Verification email sent. Check your inbox.');
              } catch (error) {
                setVerifyError(api.getApiErrorMessage(error));
              } finally {
                setResendBusy(false);
              }
            }}
            onBackToSignIn={() => {
              setVerifyStatus('');
              setVerifyError('');
              navigation.navigate('Login');
            }}
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
              try {
                await signIn(email, password, keepSignedIn);
              } catch (error) {
                const message =
                  error instanceof Error ? error.message : 'Email or password is incorrect.';
                setLoginError(message);
                if (message.toLowerCase().includes('verify your email')) {
                  navigation.navigate('VerifyEmail', { email: email.trim() });
                }
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

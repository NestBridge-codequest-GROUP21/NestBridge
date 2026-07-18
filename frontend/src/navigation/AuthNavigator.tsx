import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import VerifyEmailScreen from '../screens/auth/VerifyEmailScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import { welcomeMock, registerMock, loginMock } from '../data/studentOnboardingMock';
import {
  DEMO_ACTOR_ACCOUNTS,
  DEMO_PASSWORD,
  demoPresetForAccount,
  type DemoAccount,
} from '../data/demoAccounts';
import { isDemoQuickLoginEnabled } from '../config/demoMode';
import { useAuth } from '../context/AuthContext';
import { useAccountProfile } from '../context/AccountProfileContext';
import * as api from '../services/api';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface AuthNavigatorProps {
  initialResetToken?: string;
  onResetTokenConsumed?: () => void;
}

export default function AuthNavigator({
  initialResetToken,
  onResetTokenConsumed,
}: AuthNavigatorProps) {
  const { register, signIn } = useAuth();
  const { applyDevPreset, setPrimaryIntent } = useAccountProfile();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [demoLoginBusy, setDemoLoginBusy] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [resendBusy, setResendBusy] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotStatus, setForgotStatus] = useState('');
  const [forgotBusy, setForgotBusy] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetStatus, setResetStatus] = useState('');
  const [resetBusy, setResetBusy] = useState(false);

  const demoAccounts = isDemoQuickLoginEnabled() ? DEMO_ACTOR_ACCOUNTS : [];

  useEffect(() => {
    if (initialResetToken) {
      setResetError('');
      setResetStatus('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  }, [initialResetToken]);

  const handleDemoLogin = async (account: DemoAccount) => {
    setLoginError('');
    setRegisterError('');
    setDemoLoginBusy(true);
    try {
      await signIn(account.email, DEMO_PASSWORD, keepSignedIn);
      await applyDevPreset(demoPresetForAccount(account));
      await setPrimaryIntent(account.intent);
    } catch {
      const message = `Could not sign in as ${account.name}. Make sure the backend is running and Flyway seeds have applied.`;
      setLoginError(message);
      setRegisterError(message);
    } finally {
      setDemoLoginBusy(false);
    }
  };

  const initialRoute = initialResetToken ? 'ResetPassword' : 'Welcome';

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="Welcome">
        {({ navigation }) => (
          <WelcomeScreen
            {...welcomeMock}
            demoAccounts={demoAccounts}
            demoLoginBusy={demoLoginBusy}
            onDemoLogin={(account) => {
              void handleDemoLogin(account);
            }}
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
            demoAccounts={demoAccounts}
            demoLoginBusy={demoLoginBusy}
            onDemoLogin={(account) => {
              void handleDemoLogin(account);
            }}
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

      <Stack.Screen name="ForgotPassword">
        {({ navigation }) => (
          <ForgotPasswordScreen
            email={email}
            errorMessage={forgotError}
            statusMessage={forgotStatus}
            submitting={forgotBusy}
            onEmailChange={(value) => {
              setEmail(value);
              setForgotError('');
            }}
            onSubmit={async () => {
              setForgotError('');
              setForgotStatus('');
              if (!email.trim()) {
                setForgotError('Please enter your email address.');
                return;
              }
              setForgotBusy(true);
              try {
                await api.requestPasswordReset(email.trim());
                setForgotStatus(
                  'If an account exists for this email, we sent password reset instructions.',
                );
              } catch (error) {
                setForgotError(api.getApiErrorMessage(error));
              } finally {
                setForgotBusy(false);
              }
            }}
            onBack={() => {
              setForgotError('');
              setForgotStatus('');
              navigation.navigate('Login');
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="ResetPassword"
        initialParams={initialResetToken ? { token: initialResetToken } : undefined}
      >
        {({ navigation, route }) => {
          const token = route.params.token || initialResetToken || '';
          return (
            <ResetPasswordScreen
              password={newPassword}
              confirmPassword={confirmNewPassword}
              errorMessage={resetError}
              statusMessage={resetStatus}
              submitting={resetBusy}
              onPasswordChange={(value) => {
                setNewPassword(value);
                setResetError('');
              }}
              onConfirmPasswordChange={(value) => {
                setConfirmNewPassword(value);
                setResetError('');
              }}
              onSubmit={async () => {
                setResetError('');
                setResetStatus('');
                if (!token) {
                  setResetError('Reset link is invalid. Request a new one from sign in.');
                  return;
                }
                if (newPassword.length < 6) {
                  setResetError('Password must be at least 6 characters.');
                  return;
                }
                if (newPassword !== confirmNewPassword) {
                  setResetError('Passwords do not match.');
                  return;
                }
                setResetBusy(true);
                try {
                  await api.resetPassword(token, newPassword);
                  setResetStatus('Password updated. You can sign in with your new password.');
                  onResetTokenConsumed?.();
                } catch (error) {
                  setResetError(api.getApiErrorMessage(error));
                } finally {
                  setResetBusy(false);
                }
              }}
              onBack={() => {
                setResetError('');
                setResetStatus('');
                onResetTokenConsumed?.();
                navigation.navigate('Login');
              }}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="Login">
        {({ navigation }) => (
          <LoginScreen
            {...loginMock}
            email={email}
            password={password}
            keepSignedIn={keepSignedIn}
            errorMessage={loginError}
            demoAccounts={demoAccounts}
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
            onForgotPasswordPress={() => {
              setForgotError('');
              setForgotStatus('');
              navigation.navigate('ForgotPassword');
            }}
            onCreateAccountPress={() => navigation.navigate('Register')}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

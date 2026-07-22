import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import StaffSignInScreen from '../screens/auth/StaffSignInScreen';
import VerifyEmailScreen, {
  openNestBridgeSupportEmail,
} from '../screens/auth/VerifyEmailScreen';
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
import {
  ACCOUNT_CREATED_VERIFY_COPY,
  EMAIL_DELIVERY_FAILED_COPY,
  UNVERIFIED_LOGIN_COPY,
  isUnverifiedEmailError,
} from '../utils/authErrors';
import type { AuthStackParamList } from './types';

const APP_VERSION =
  Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? '1.0.1';

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface AuthNavigatorProps {
  initialResetToken?: string;
  onResetTokenConsumed?: () => void;
}

export default function AuthNavigator({
  initialResetToken,
  onResetTokenConsumed,
}: AuthNavigatorProps) {
  const { register, signIn, signOut } = useAuth();
  const { applyDevPreset, setPrimaryIntent } = useAccountProfile();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [staffLoginError, setStaffLoginError] = useState('');
  const [staffLoginBusy, setStaffLoginBusy] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [demoLoginBusy, setDemoLoginBusy] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [verifySubtitle, setVerifySubtitle] = useState(
    'Open the verification link we sent, then come back and sign in to NestBridge.',
  );
  const [resendBusy, setResendBusy] = useState(false);
  const [loginNeedsVerification, setLoginNeedsVerification] = useState(false);
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
    setDemoLoginBusy(true);
    try {
      const signedIn = await signIn(account.email, DEMO_PASSWORD, keepSignedIn);
      if (account.id === 'staff' || signedIn.isStaff) {
        // Staff lands on the ops shell — do not apply a tourist consumer preset.
        return;
      }
      await applyDevPreset(demoPresetForAccount(account));
      await setPrimaryIntent(account.intent);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : `Could not sign in as ${account.name}. Make sure the backend is running.`;
      Alert.alert('Quick sign-in failed', message);
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
            onStaffSignIn={() => {
              setStaffLoginError('');
              navigation.navigate('StaffSignIn');
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="StaffSignIn">
        {({ navigation }) => (
          <StaffSignInScreen
            email={email}
            password={password}
            keepSignedIn={keepSignedIn}
            errorMessage={staffLoginError}
            submitting={staffLoginBusy}
            onEmailChange={(value) => {
              setEmail(value);
              setStaffLoginError('');
            }}
            onPasswordChange={setPassword}
            onToggleKeepSignedIn={() => setKeepSignedIn((value) => !value)}
            onForgotPasswordPress={() => {
              setStaffLoginError('');
              setForgotError('');
              setForgotStatus('');
              navigation.navigate('ForgotPassword');
            }}
            onSubmit={async () => {
              setStaffLoginError('');
              if (!email.trim()) {
                setStaffLoginError('Enter your staff email address.');
                return;
              }
              if (!password) {
                setStaffLoginError('Enter your password.');
                return;
              }
              setStaffLoginBusy(true);
              try {
                const signedIn = await signIn(email.trim(), password, keepSignedIn);
                if (!signedIn.isStaff) {
                  await signOut();
                  setStaffLoginError(
                    'This portal is for NestBridge staff only. Use the regular Sign in for student, host, guide, or tourist accounts.',
                  );
                }
              } catch (error) {
                const message =
                  error instanceof Error ? error.message : 'Email or password is incorrect.';
                setStaffLoginError(
                  message.includes('Invalid email or password')
                    ? 'Incorrect email or password. Use Forgot password if you need to reset it — this is the same password as your NestBridge account.'
                    : message,
                );
              } finally {
                setStaffLoginBusy(false);
              }
            }}
            onBack={() => {
              setStaffLoginError('');
              navigation.goBack();
            }}
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
                  const createdCopy =
                    result.message?.trim() || ACCOUNT_CREATED_VERIFY_COPY;
                  if (result.emailDeliveryFailed) {
                    setVerifyStatus('');
                    setVerifyError(EMAIL_DELIVERY_FAILED_COPY);
                    setVerifySubtitle(
                      'Your account exists, but we could not deliver the verification email yet.',
                    );
                  } else {
                    setVerifyStatus(createdCopy);
                    setVerifyError('');
                    setVerifySubtitle(
                      'Open the verification link we sent, then come back and sign in to NestBridge.',
                    );
                  }
                  navigation.navigate('VerifyEmail', { email: result.email });
                } else {
                  await signIn(email, password, keepSignedIn);
                }
              } catch (error) {
                const message =
                  error instanceof Error ? error.message : 'Could not create account.';
                if (isUnverifiedEmailError(message)) {
                  setRegisterError('');
                  setVerifyStatus('');
                  setVerifyError(message);
                  setVerifySubtitle(
                    'This email already started signup. Resend the verification link, then sign in.',
                  );
                  navigation.navigate('VerifyEmail', {
                    email: email.trim().toLowerCase(),
                  });
                  return;
                }
                setRegisterError(message);
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
            subtitle={verifySubtitle}
            statusMessage={verifyStatus}
            errorMessage={verifyError}
            resendBusy={resendBusy}
            onResend={async () => {
              setVerifyStatus('');
              setVerifyError('');
              setResendBusy(true);
              try {
                await api.resendVerificationEmail(route.params.email);
                setVerifyStatus('Verification email sent. Check your inbox (and spam folder).');
              } catch (error) {
                setVerifyError(api.getApiErrorMessage(error));
              } finally {
                setResendBusy(false);
              }
            }}
            onChangeEmail={() => {
              setVerifyStatus('');
              setVerifyError('');
              setRegisterError('');
              navigation.navigate('Register');
            }}
            onContactSupport={() => {
              void openNestBridgeSupportEmail(route.params.email);
            }}
            onBackToSignIn={() => {
              setVerifyStatus('');
              setVerifyError('');
              setLoginError('');
              setLoginNeedsVerification(false);
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
            showResendVerification={loginNeedsVerification}
            resendBusy={resendBusy}
            appVersion={APP_VERSION}
            onEmailChange={(value) => {
              setEmail(value);
              setLoginNeedsVerification(false);
            }}
            onPasswordChange={setPassword}
            onToggleKeepSignedIn={() => setKeepSignedIn((value) => !value)}
            onSubmit={async () => {
              setLoginError('');
              setLoginNeedsVerification(false);
              if (!email.trim()) {
                setLoginError('Enter your email address.');
                return;
              }
              if (!password) {
                setLoginError('Enter your password.');
                return;
              }
              try {
                await signIn(email, password, keepSignedIn);
              } catch (error) {
                const message =
                  error instanceof Error ? error.message : 'Email or password is incorrect.';
                if (isUnverifiedEmailError(message)) {
                  setLoginError(UNVERIFIED_LOGIN_COPY);
                  setLoginNeedsVerification(true);
                  return;
                }
                setLoginError(message);
              }
            }}
            onResendVerification={async () => {
              if (!email.trim()) {
                setLoginError('Enter your email address.');
                return;
              }
              setResendBusy(true);
              try {
                await api.resendVerificationEmail(email.trim().toLowerCase());
                setLoginError('');
                setLoginNeedsVerification(false);
                setVerifyStatus('Verification email sent. Check your inbox (and spam folder).');
                setVerifyError('');
                setVerifySubtitle(
                  'Open the verification link we sent, then come back and sign in to NestBridge.',
                );
                navigation.navigate('VerifyEmail', {
                  email: email.trim().toLowerCase(),
                });
              } catch (error) {
                setLoginError(api.getApiErrorMessage(error));
              } finally {
                setResendBusy(false);
              }
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

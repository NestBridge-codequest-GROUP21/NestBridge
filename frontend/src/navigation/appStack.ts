import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AppStackParamList } from './types';

/** Shared stack so Screen/Group helpers use the same navigator instance. */
export const AppStack = createNativeStackNavigator<AppStackParamList>();

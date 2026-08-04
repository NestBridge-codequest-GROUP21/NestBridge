import React, { useCallback, useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import NearbyCommunityScreen from '../screens/student/NearbyCommunityScreen';
import {
  getApiErrorMessage,
  getNearbyCommunity,
  type CommunityHostApi,
  type CommunityMemberApi,
} from '../services/api';
import type { AppStackParamList } from './types';

type Props = NativeStackScreenProps<AppStackParamList, 'NearbyCommunity'> & {
  fallbackCityLabel?: string;
};

export default function NearbyCommunityRoute({
  navigation,
  fallbackCityLabel = '',
}: Props) {
  const [cityLabel, setCityLabel] = useState(fallbackCityLabel);
  const [students, setStudents] = useState<CommunityMemberApi[]>([]);
  const [hosts, setHosts] = useState<CommunityHostApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await getNearbyCommunity();
      setCityLabel(data.city || fallbackCityLabel || '');
      setStudents(data.students ?? []);
      setHosts(data.hosts ?? []);
    } catch (err) {
      setErrorMessage(getApiErrorMessage(err));
      setStudents([]);
      setHosts([]);
    } finally {
      setLoading(false);
    }
  }, [fallbackCityLabel]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <NearbyCommunityScreen
      cityLabel={cityLabel}
      students={students}
      hosts={hosts}
      loading={loading}
      errorMessage={errorMessage}
      onBack={() => navigation.goBack()}
      onRetry={() => {
        void load();
      }}
      onStudentPress={(userId) => {
        const member = students.find((s) => s.userId === userId);
        if (!member) return;
        navigation.navigate('StudentPublicProfile', { member });
      }}
      onHostPress={(hostId) => navigation.navigate('HostProfile', { hostId })}
    />
  );
}

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import SOSScreen from './SOSScreen';

export default function BrowseHomeScreen() {
  const [showSOS, setShowSOS] = useState(false);

  const emergencyContacts = [
    { label: 'Call local emergency services', number: '191' },
    { label: 'NestBridge 24/7 support (WhatsApp)', number: '+233000000000' },
    { label: 'Nearest embassy', number: '+233000000001' },
  ];

  if (showSOS) {
    return (
      <SOSScreen
        emergencyContacts={emergencyContacts}
        onBack={() => setShowSOS(false)}
        onCallEmergencyServices={() => console.log('Emergency services called')}
        onContactCallPress={(contact) => console.log('Contact pressed:', contact)}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good evening, Sirina</Text>
        <TextInput 
          style={styles.searchBar} 
          placeholder="Search city or university area" 
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Matches Alert Box */}
      <View style={styles.matchesBox}>
        <View>
          <Text style={styles.matchesTitle}>3 new matches</Text>
          <Text style={styles.matchesSub}>Halal-friendly • Halal meals offered • Quiet evenings</Text>
        </View>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions Row */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsRow}>
        <View style={styles.actionItem}><Text style={styles.actionIcon}>🏠</Text><Text style={styles.actionText}>Find hosts</Text></View>
        <View style={styles.actionItem}><Text style={styles.actionIcon}>🗺️</Text><Text style={styles.actionText}>Guides</Text></View>
        <View style={styles.actionItem}><Text style={styles.actionIcon}>📅</Text><Text style={styles.actionText}>Bookings</Text></View>
        <View style={styles.actionItem}><Text style={styles.actionIcon}>💬</Text><Text style={styles.actionText}>Messages</Text></View>
      </View>

      {/* 🚨 RED EMERGENCY SOS BUTTON 🚨 */}
      <TouchableOpacity style={styles.sosButton} onPress={() => setShowSOS(true)}>
        <Text style={styles.sosButtonText}>🚨 Open Emergency SOS Screen</Text>
      </TouchableOpacity>

      {/* Suggested Hosts Section */}
      <Text style={styles.sectionTitle}>Suggested hosts</Text>
      
      <View style={styles.hostCard}>
        <View style={styles.hostAvatar}><Text>AB</Text></View>
        <View style={styles.hostInfo}>
          <Text style={styles.hostName}>Abena Mensah</Text>
          <Text style={styles.hostDetails}>East Legon, Accra • GHS 180/night</Text>
        </View>
        <View style={styles.matchBadge}><Text style={styles.matchText}>98%</Text></View>
      </View>

      <View style={styles.hostCard}>
        <View style={styles.hostAvatar}><Text>KW</Text></View>
        <View style={styles.hostInfo}>
          <Text style={styles.hostName}>Kwame & Grace</Text>
          <Text style={styles.hostDetails}>Cantonments, Accra • GHS 220/night</Text>
        </View>
        <View style={styles.matchBadge}><Text style={styles.matchText}>91%</Text></View>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#0F2C2C', paddingHorizontal: 16, paddingTop: 40, paddingBottom: 20, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  greeting: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  searchBar: { backgroundColor: '#FFFFFF', borderRadius: 24, paddingHorizontal: 16, height: 44, fontSize: 14, color: '#000000' },
  matchesBox: { backgroundColor: '#E2F1F1', margin: 16, padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  matchesTitle: { fontWeight: 'bold', color: '#0F2C2C', fontSize: 15 },
  matchesSub: { color: '#64748B', fontSize: 12, marginTop: 2 },
  viewButton: { backgroundColor: '#0F2C2C', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16 },
  viewButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginLeft: 16, marginTop: 10, marginBottom: 12 },
  quickActionsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 12, marginBottom: 20 },
  actionItem: { alignItems: 'center', width: 80 },
  actionIcon: { fontSize: 24, backgroundColor: '#E2E8F0', padding: 12, borderRadius: 24, overflow: 'hidden', textAlign: 'center', marginBottom: 6 },
  actionText: { fontSize: 12, color: '#475569', fontWeight: '500' },
  sosButton: { backgroundColor: '#EF4444', marginHorizontal: 16, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  sosButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  hostCard: { backgroundColor: '#FFFFFF', marginHorizontal: 16, marginBottom: 12, padding: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  hostAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  hostInfo: { flex: 1 },
  hostName: { fontWeight: '600', color: '#1E293B', fontSize: 14 },
  hostDetails: { color: '#64748B', fontSize: 12, marginTop: 2 },
  matchBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  matchText: { color: '#15803D', fontSize: 12, fontWeight: 'bold' },
});
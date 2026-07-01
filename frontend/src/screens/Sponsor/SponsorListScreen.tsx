import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { colors } from '../../constants/theme';

interface Sponsor {
  id: string;
  name: string;
  category: string;
  description: string;
  amount: string;
  logo: string;
}

const SPONSORS: Sponsor[] = [
  { id: '1', name: 'Ghana Tourism Authority', category: 'Government', description: 'Supporting student travel across Ghana.', amount: '$5,000', logo: '🏛️' },
  { id: '2', name: 'Ashanti Royal Foundation', category: 'Foundation', description: 'Cultural heritage and student support.', amount: '$3,500', logo: '👑' },
  { id: '3', name: 'KNUST Alumni Network', category: 'Education', description: 'Empowering KNUST students abroad.', amount: '$2,000', logo: '🎓' },
  { id: '4', name: 'AfriTech Ventures', category: 'Technology', description: 'Tech-driven travel sponsorships.', amount: '$4,200', logo: '💻' },
  { id: '5', name: 'Accra Hospitality Group', category: 'Hospitality', description: 'Comfortable stays for international students.', amount: '$1,800', logo: '🏨' },
  { id: '6', name: 'West Africa Students Fund', category: 'NGO', description: 'Pan-African student travel support.', amount: '$6,000', logo: '🌍' },
];

interface Props {
  navigation?: any;
}

export default function SponsorListScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('All');

  const categories = ['All', 'Government', 'Foundation', 'Education', 'Technology', 'Hospitality', 'NGO'];

  const filtered = SPONSORS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selected === 'All' || s.category === selected;
    return matchSearch && matchCat;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sponsors</Text>
        <Text style={styles.headerSubtitle}>Find funding for your journey</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search sponsors..."
          placeholderTextColor={colors.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Category Filter */}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item}
        style={styles.categoryList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryChip, selected === item && styles.categoryChipActive]}
            onPress={() => setSelected(item)}
          >
            <Text style={[styles.categoryText, selected === item && styles.categoryTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Sponsor List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation?.navigate('SponsorDetail', { sponsor: item })}
          >
            <View style={styles.cardLeft}>
              <Text style={styles.logo}>{item.logo}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.sponsorName}>{item.name}</Text>
              <Text style={styles.sponsorCategory}>{item.category}</Text>
              <Text style={styles.sponsorDesc} numberOfLines={2}>{item.description}</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.amount}>{item.amount}</Text>
              <Text style={styles.applyText}>Apply →</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.navy, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: colors.white },
  headerSubtitle: { fontSize: 14, color: colors.tealBright, marginTop: 4 },
  searchContainer: { margin: 16 },
  searchInput: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryList: { paddingLeft: 16, marginBottom: 8, flexGrow: 0 },
  categoryChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border,
    marginRight: 8,
  },
  categoryChipActive: { backgroundColor: colors.teal, borderColor: colors.teal },
  categoryText: { fontSize: 13, color: colors.textSecondary },
  categoryTextActive: { color: colors.white, fontWeight: '600' },
  listContent: { padding: 16, gap: 12 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLeft: { marginRight: 14 },
  logo: { fontSize: 36 },
  cardBody: { flex: 1 },
  sponsorName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  sponsorCategory: { fontSize: 12, color: colors.teal, marginTop: 2, fontWeight: '600' },
  sponsorDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  cardRight: { alignItems: 'flex-end', marginLeft: 8 },
  amount: { fontSize: 14, fontWeight: '700', color: colors.gold },
  applyText: { fontSize: 12, color: colors.teal, marginTop: 6 },
});
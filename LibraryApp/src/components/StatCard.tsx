import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';

interface StatCardProps {
  totalBooks: number;
  totalBorrowed: number;
}

export const StatCard: React.FC<StatCardProps> = ({ totalBooks, totalBorrowed }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.label}>Tổng đầu sách</Text>
          <Ionicons name="library-outline" size={16} color={colors.primary} />
        </View>
        <Text style={styles.valuePrimary}>{totalBooks}</Text>
        <Text style={styles.subtext}>sách trong thư viện</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.label}>Đang cho mượn</Text>
          <Ionicons name="book-outline" size={16} color={colors.warning} />
        </View>
        <Text style={styles.valueWarning}>{totalBorrowed}</Text>
        <Text style={styles.subtext}>cuốn đang lưu hành</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 14,
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valuePrimary: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  valueWarning: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.warning,
    letterSpacing: -0.5,
  },
  subtext: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});

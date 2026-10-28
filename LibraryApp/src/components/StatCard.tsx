import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface StatCardProps {
  totalBooks: number;
  totalBorrowed: number;
}

export const StatCard: React.FC<StatCardProps> = ({ totalBooks, totalBorrowed }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Tổng đầu sách</Text>
        <Text style={styles.valuePrimary}>{totalBooks}</Text>
        <Text style={styles.subtext}>sách trong thư viện</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Đang cho mượn</Text>
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
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
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

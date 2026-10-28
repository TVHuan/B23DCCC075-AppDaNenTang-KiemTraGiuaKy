import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import type { Book } from '../types/book';

interface BookCardProps {
  book: Book;
  onPress: (book: Book) => void;
  onLongPress: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onPress, onLongPress }) => {
  const remaining = Number(book.quantity) - Number(book.borrowed);
  const isOutOfStock = remaining <= 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(book)}
      onLongPress={() => onLongPress(book)}
      delayLongPress={350}
      activeOpacity={0.7}
    >
      {/* Thể loại & Trạng thái còn sách */}
      <View style={styles.topRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{book.category}</Text>
        </View>

        {/* Nhãn Hết sách màu đỏ theo Câu 1 */}
        {isOutOfStock ? (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Hết sách</Text>
          </View>
        ) : (
          <View style={styles.inStockBadge}>
            <Text style={styles.inStockText}>Còn {remaining} cuốn</Text>
          </View>
        )}
      </View>

      {/* Tên sách */}
      <Text style={styles.title} numberOfLines={2}>
        {book.title}
      </Text>

      {/* Tác giả */}
      <Text style={styles.author} numberOfLines={1}>
        {book.author}
      </Text>

      {/* Hàng thông tin phụ */}
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Năm {book.year}</Text>
        <Text style={styles.metaDot}>•</Text>
        <Text style={styles.metaText}>Đang mượn: {book.borrowed}/{book.quantity}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  outOfStockBadge: {
    backgroundColor: colors.errorLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.errorBorder,
  },
  outOfStockText: {
    color: colors.error,
    fontSize: 11,
    fontWeight: '700',
  },
  inStockBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  inStockText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 22,
    marginBottom: 4,
  },
  author: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '400',
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  metaDot: {
    fontSize: 12,
    color: colors.textMuted,
    marginHorizontal: 6,
  },
});

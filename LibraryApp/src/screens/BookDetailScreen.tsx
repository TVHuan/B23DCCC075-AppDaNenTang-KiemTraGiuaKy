import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useBooks } from '../context/BookContext';
import { colors } from '../theme/colors';
import { CustomButton } from '../components/CustomButton';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'BookDetail'>;

export const BookDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { bookId } = route.params;
  const { getBookById, borrowBook, returnBook, deleteBook } = useBooks();

  const book = getBookById(bookId);

  if (!book) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Không tìm thấy cuốn sách này</Text>
          <CustomButton
            title="Quay lại danh sách"
            onPress={() => navigation.goBack()}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  const remaining = Number(book.quantity) - Number(book.borrowed);
  const isOutOfStock = remaining <= 0;
  const canBorrow = remaining > 0;
  const canReturn = Number(book.borrowed) > 0;

  // Xử lý Cho mượn (Câu 4)
  const handleBorrow = async () => {
    if (!canBorrow) {
      Alert.alert('Thông báo', 'Sách này đã hết, không thể cho mượn.');
      return;
    }
    const success = await borrowBook(book.id);
    if (success) {
      Alert.alert('Thành công', `Đã cho mượn 1 cuốn "${book.title}".`);
    }
  };

  // Xử lý Nhận trả (Câu 4)
  const handleReturn = async () => {
    if (!canReturn) {
      Alert.alert('Thông báo', 'Không có cuốn nào đang mượn để nhận trả.');
      return;
    }
    const success = await returnBook(book.id);
    if (success) {
      Alert.alert('Thành công', `Đã nhận trả 1 cuốn "${book.title}".`);
    }
  };

  // Xử lý Xoá sách (Câu 3)
  const handleDelete = () => {
    if (book.borrowed > 0) {
      Alert.alert(
        'Không thể xoá sách',
        `Cuốn sách hiện có ${book.borrowed} cuốn đang được mượn. Vui lòng nhận trả toàn bộ trước khi xoá.`
      );
      return;
    }

    Alert.alert(
      'Xác nhận xoá sách',
      `Bạn có chắc chắn muốn xoá cuốn "${book.title}" khỏi thư viện?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteBook(book.id);
            if (success) {
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Thể loại & Trạng thái tồn kho */}
        <View style={styles.topRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{book.category}</Text>
          </View>

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

        {/* Tiêu đề & Tác giả */}
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>

        {/* Bảng thông số kho sách */}
        <View style={styles.statsCard}>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Tổng số</Text>
              <Text style={styles.statNumber}>{book.quantity}</Text>
              <Text style={styles.statUnit}>cuốn</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Đang mượn</Text>
              <Text style={[styles.statNumber, { color: colors.warning }]}>
                {book.borrowed}
              </Text>
              <Text style={styles.statUnit}>cuốn</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Còn lại</Text>
              <Text
                style={[
                  styles.statNumber,
                  { color: isOutOfStock ? colors.error : colors.success },
                ]}
              >
                {remaining}
              </Text>
              <Text style={styles.statUnit}>cuốn</Text>
            </View>
          </View>
        </View>

        {/* Thông tin chi tiết */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Năm xuất bản</Text>
            <Text style={styles.infoValue}>{book.year}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mã định danh</Text>
            <Text style={styles.infoValue}>#{book.id}</Text>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Thể loại</Text>
            <Text style={styles.infoValue}>{book.category}</Text>
          </View>
        </View>

        {/* Nghiệp vụ Mượn / Trả sách (Câu 4) */}
        <View style={styles.actionsCard}>
          <Text style={styles.actionCardTitle}>Thao tác mượn và trả sách</Text>
          <View style={styles.actionButtonsRow}>
            <View style={styles.actionBtnWrapper}>
              <CustomButton
                title="Cho mượn"
                onPress={handleBorrow}
                disabled={!canBorrow}
                variant="primary"
                style={styles.actionBtn}
              />
              {!canBorrow && (
                <Text style={styles.disabledNote}>Đã hết sách</Text>
              )}
            </View>

            <View style={styles.actionBtnWrapper}>
              <CustomButton
                title="Nhận trả"
                onPress={handleReturn}
                disabled={!canReturn}
                variant="secondary"
                style={styles.actionBtn}
              />
              {!canReturn && (
                <Text style={styles.disabledNote}>Không có cuốn mượn</Text>
              )}
            </View>
          </View>
        </View>

        {/* Nút Sửa & Xoá */}
        <View style={styles.bottomButtons}>
          <CustomButton
            title="Chỉnh sửa thông tin"
            onPress={() => navigation.navigate('BookForm', { bookId: book.id })}
            variant="outline"
          />

          <CustomButton
            title="Xoá sách này"
            onPress={handleDelete}
            variant="danger"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
  },
  outOfStockBadge: {
    backgroundColor: colors.errorLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.errorBorder,
  },
  outOfStockText: {
    color: colors.error,
    fontWeight: '700',
    fontSize: 12,
  },
  inStockBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  inStockText: {
    color: colors.success,
    fontWeight: '600',
    fontSize: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 28,
    marginBottom: 4,
  },
  author: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 18,
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 10,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  statUnit: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  actionsCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtnWrapper: {
    flex: 1,
  },
  actionBtn: {
    paddingVertical: 12,
  },
  disabledNote: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 5,
  },
  bottomButtons: {
    gap: 10,
  },
});

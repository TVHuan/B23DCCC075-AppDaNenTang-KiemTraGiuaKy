import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useBooks } from '../context/BookContext';
import { colors } from '../theme/colors';
import { CustomButton } from '../components/CustomButton';
import type { RootStackParamList } from '../types/navigation';
import type { BorrowRecord } from '../types/book';

type Props = NativeStackScreenProps<RootStackParamList, 'BookDetail'>;

export const BookDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { bookId } = route.params;
  const { getBookById, borrowBook, returnBook, deleteBook } = useBooks();

  const book = getBookById(bookId);

  // State Modal nhập thông tin người mượn
  const [isBorrowModalVisible, setIsBorrowModalVisible] = useState(false);
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerPhone, setBorrowerPhone] = useState('');
  const [borrowerNameError, setBorrowerNameError] = useState('');

  // Nút Sửa & Xoá gọn gàng trên Header (Góc phải)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => navigation.navigate('BookForm', { bookId: book?.id })}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="create-outline" size={20} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerIconButton, { marginLeft: 12 }]}
            onPress={handleDelete}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, book]);

  if (!book) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
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

  // Mở modal nhập thông tin mượn
  const handleOpenBorrowModal = () => {
    if (!canBorrow) {
      Alert.alert('Thông báo', 'Sách này đã hết, không thể cho mượn.');
      return;
    }
    setBorrowerName('');
    setBorrowerPhone('');
    setBorrowerNameError('');
    setIsBorrowModalVisible(true);
  };

  // Xác nhận mượn sách kèm thông tin người mượn
  const handleConfirmBorrow = async () => {
    if (!borrowerName.trim()) {
      setBorrowerNameError('Vui lòng nhập họ tên người mượn');
      return;
    }

    const success = await borrowBook(book.id, {
      name: borrowerName.trim(),
      phone: borrowerPhone.trim(),
    });

    if (success) {
      setIsBorrowModalVisible(false);
      Alert.alert('Thành công', `Đã cho mượn 1 cuốn cho bạn đọc "${borrowerName.trim()}".`);
    } else {
      Alert.alert('Lỗi', 'Không thể thực hiện cho mượn sách.');
    }
  };

  // Xử lý Nhận trả
  const handleReturn = async (record?: BorrowRecord) => {
    if (!canReturn) {
      Alert.alert('Thông báo', 'Không có cuốn nào đang mượn để nhận trả.');
      return;
    }

    const targetName = record ? `của bạn đọc "${record.borrowerName}"` : '';
    Alert.alert(
      'Xác nhận nhận trả',
      `Bạn có chắc chắn nhận lại 1 cuốn sách ${targetName}?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xác nhận trả',
          onPress: async () => {
            const success = await returnBook(book.id, record?.id);
            if (success) {
              Alert.alert('Thành công', 'Đã cập nhật nhận trả sách vào kho.');
            }
          },
        },
      ]
    );
  };

  // Xử lý Xoá sách (Câu 3)
  function handleDelete() {
    if (!book) return;
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
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
                onPress={handleOpenBorrowModal}
                disabled={!canBorrow}
                variant="primary"
                icon={<Ionicons name="arrow-up-circle-outline" size={18} color="#FFFFFF" />}
                style={styles.actionBtn}
              />
              {!canBorrow && (
                <Text style={styles.disabledNote}>Đã hết sách</Text>
              )}
            </View>

            <View style={styles.actionBtnWrapper}>
              <CustomButton
                title="Nhận trả"
                onPress={() => handleReturn()}
                disabled={!canReturn}
                variant="secondary"
                icon={<Ionicons name="arrow-down-circle-outline" size={18} color="#FFFFFF" />}
                style={styles.actionBtn}
              />
              {!canReturn && (
                <Text style={styles.disabledNote}>Không có cuốn mượn</Text>
              )}
            </View>
          </View>
        </View>

        {/* Danh sách bạn đọc đang mượn sách này */}
        {book.borrowers && book.borrowers.length > 0 && (
          <View style={styles.borrowersCard}>
            <View style={styles.borrowersHeader}>
              <Text style={styles.borrowersTitle}>Bạn đọc đang mượn ({book.borrowers.length})</Text>
            </View>
            {book.borrowers.map((b, index) => (
              <View
                key={b.id || index}
                style={[
                  styles.borrowerItem,
                  index === (book.borrowers?.length ?? 1) - 1 ? { borderBottomWidth: 0 } : null,
                ]}
              >
                <View style={styles.borrowerInfo}>
                  <Text style={styles.borrowerName}>{b.borrowerName}</Text>
                  <View style={styles.borrowerMeta}>
                    {b.borrowerPhone ? (
                      <Text style={styles.borrowerPhone}>{b.borrowerPhone} • </Text>
                    ) : null}
                    <Text style={styles.borrowDate}>Ngày mượn: {b.borrowDate}</Text>
                  </View>
                </View>

                {/* Nút Nhận trả trực tiếp từng bạn đọc */}
                <TouchableOpacity
                  style={styles.inlineReturnBtn}
                  onPress={() => handleReturn(b)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.inlineReturnText}>Trả sách</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Nút Sửa & Xoá trên CÙNG MỘT DÒNG, GỌN NHỎ LẠI theo yêu cầu */}
        <View style={styles.compactActionsRow}>
          <TouchableOpacity
            style={styles.compactEditBtn}
            onPress={() => navigation.navigate('BookForm', { bookId: book.id })}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={16} color={colors.primary} style={styles.compactBtnIcon} />
            <Text style={styles.compactEditText}>Chỉnh sửa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.compactDeleteBtn}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={16} color={colors.error} style={styles.compactBtnIcon} />
            <Text style={styles.compactDeleteText}>Xoá sách</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal Nhập Thông Tin Người Mượn (Không bị bàn phím che) */}
      <Modal
        visible={isBorrowModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsBorrowModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.modalKeyboardAvoid}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Thông tin người mượn</Text>
                  <TouchableOpacity
                    onPress={() => setIsBorrowModalVisible(false)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="close" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalBookTitle} numberOfLines={1}>
                  📖 {book.title}
                </Text>

                {/* Ô nhập Họ và tên */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Họ và tên người mượn <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.modalInput, borrowerNameError ? styles.modalInputError : null]}
                    value={borrowerName}
                    onChangeText={(text) => {
                      setBorrowerName(text);
                      if (borrowerNameError) setBorrowerNameError('');
                    }}
                    placeholder="Ví dụ: Nguyễn Văn Minh"
                    placeholderTextColor={colors.textMuted}
                    autoFocus
                  />
                  {borrowerNameError ? (
                    <Text style={styles.modalErrorText}>{borrowerNameError}</Text>
                  ) : null}
                </View>

                {/* Ô nhập SĐT / Mã thẻ */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Số điện thoại / Mã sinh viên (tuỳ chọn)</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={borrowerPhone}
                    onChangeText={setBorrowerPhone}
                    placeholder="Ví dụ: 0912345678 hoặc B23DCCC..."
                    placeholderTextColor={colors.textMuted}
                    keyboardType="phone-pad"
                  />
                </View>

                {/* Nút hành động trong Modal */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalCancelBtn}
                    onPress={() => setIsBorrowModalVisible(false)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalCancelText}>Huỷ bỏ</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalConfirmBtn}
                    onPress={handleConfirmBorrow}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalConfirmText}>Xác nhận mượn</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 4,
  },
  headerIconButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: colors.surface,
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
    marginVertical: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
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
    marginBottom: 14,
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
  // Danh sách bạn đọc
  borrowersCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  borrowersHeader: {
    marginBottom: 12,
  },
  borrowersTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  borrowerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  borrowerInfo: {
    flex: 1,
    marginRight: 10,
  },
  borrowerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  borrowerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  borrowerPhone: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  borrowDate: {
    fontSize: 12,
    color: colors.textMuted,
  },
  inlineReturnBtn: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inlineReturnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  // Nút Sửa & Xoá trên cùng 1 dòng, gọn nhỏ
  compactActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
    marginBottom: 16,
  },
  compactEditBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  compactDeleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.errorLight,
    borderWidth: 1,
    borderColor: colors.errorBorder,
  },
  compactBtnIcon: {
    marginRight: 6,
  },
  compactEditText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  compactDeleteText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
  },
  // Modal mượn sách
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalKeyboardAvoid: {
    width: '100%',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  modalBookTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  requiredStar: {
    color: colors.error,
  },
  modalInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
  },
  modalInputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  modalErrorText: {
    fontSize: 11,
    color: colors.error,
    marginTop: 4,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

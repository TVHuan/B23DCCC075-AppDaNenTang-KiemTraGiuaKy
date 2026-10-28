import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useBooks, type ActiveBorrowItem } from '../context/BookContext';

interface BorrowedListModalProps {
  visible: boolean;
  onClose: () => void;
}

export const BorrowedListModal: React.FC<BorrowedListModalProps> = ({ visible, onClose }) => {
  const { activeBorrowList, returnBook } = useBooks();
  const [filterQuery, setFilterQuery] = useState('');

  // Lọc theo tên người mượn, mã sinh viên hoặc tên sách
  const filteredList = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return activeBorrowList;
    return activeBorrowList.filter((item) => {
      const matchName = item.record.borrowerName.toLowerCase().includes(q);
      const matchId = (item.record.studentId || '').toLowerCase().includes(q);
      const matchPhone = (item.record.borrowerPhone || '').includes(q);
      const matchBook = item.bookTitle.toLowerCase().includes(q);
      return matchName || matchId || matchPhone || matchBook;
    });
  }, [activeBorrowList, filterQuery]);

  // Xác nhận nhận trả sách
  const handleReturn = (item: ActiveBorrowItem) => {
    Alert.alert(
      'Xác nhận nhận trả',
      `Nhận lại sách "${item.bookTitle}" từ sinh viên ${item.record.borrowerName} (${item.record.studentId})?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Nhận trả',
          onPress: async () => {
            const success = await returnBook(item.bookId, item.record.id);
            if (success) {
              Alert.alert('Thành công', 'Đã cập nhật hoàn trả sách vào kho.');
            }
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
        {/* Header Modal */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Danh sách đang cho mượn</Text>
            <Text style={styles.subtitle}>
              Tổng cộng {activeBorrowList.length} lượt mượn trong thư viện
            </Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Ô tìm kiếm người mượn */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
          <TextInput
            style={styles.searchInput}
            value={filterQuery}
            onChangeText={setFilterQuery}
            placeholder="Tìm theo tên SV, mã SV, hoặc tên sách..."
            placeholderTextColor={colors.textMuted}
            autoCorrect={false}
          />
          {filterQuery ? (
            <TouchableOpacity onPress={() => setFilterQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Danh sách mượn */}
        <FlatList
          data={filteredList}
          keyExtractor={(item) => item.record.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="book-outline" size={40} color={colors.textMuted} style={{ marginBottom: 10 }} />
              <Text style={styles.emptyTitle}>
                {filterQuery ? 'Không tìm thấy kết quả phù hợp' : 'Hiện không có cuốn sách nào đang được mượn'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {filterQuery ? 'Vui lòng kiểm tra lại từ khoá tìm kiếm' : 'Toàn bộ sách đều đang có sẵn trong kho'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Tên sách & thể loại */}
              <View style={styles.bookHeaderRow}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{item.bookCategory}</Text>
                </View>
                <View style={styles.borrowCountBadge}>
                  <Text style={styles.borrowCountText}>Mượn: {item.record.borrowCount || 1} cuốn</Text>
                </View>
              </View>

              <Text style={styles.bookTitle} numberOfLines={2}>
                {item.bookTitle}
              </Text>

              {/* Thông tin sinh viên mượn */}
              <View style={styles.borrowerCard}>
                <View style={styles.infoLine}>
                  <Ionicons name="person-circle-outline" size={18} color={colors.primary} style={styles.iconMargin} />
                  <Text style={styles.borrowerName}>{item.record.borrowerName}</Text>
                </View>

                <View style={styles.metaGrid}>
                  <View style={styles.metaCell}>
                    <Text style={styles.metaLabel}>Mã sinh viên:</Text>
                    <Text style={styles.metaValueBold}>{item.record.studentId || 'Chưa cập nhật'}</Text>
                  </View>

                  <View style={styles.metaCell}>
                    <Text style={styles.metaLabel}>Số điện thoại:</Text>
                    <Text style={styles.metaValue}>{item.record.borrowerPhone || 'Chưa cập nhật'}</Text>
                  </View>
                </View>

                {/* Ngày mượn & Hạn trả */}
                <View style={styles.dateRow}>
                  <View style={styles.dateBlock}>
                    <Text style={styles.dateLabel}>Ngày mượn</Text>
                    <Text style={styles.dateValue}>{item.record.borrowDate}</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={14} color={colors.textMuted} style={{ marginHorizontal: 8 }} />
                  <View style={styles.dateBlock}>
                    <Text style={styles.dateLabel}>Hạn trả</Text>
                    <Text style={[styles.dateValue, { color: colors.warning }]}>
                      {item.record.dueDate || 'Chưa định'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Nút Nhận trả sách */}
              <TouchableOpacity
                style={styles.returnBtn}
                onPress={() => handleReturn(item)}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-down-circle-outline" size={16} color={colors.success} style={{ marginRight: 6 }} />
                <Text style={styles.returnBtnText}>Nhận trả sách này</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    paddingVertical: 0,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyBox: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  bookHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  borrowCountBadge: {
    backgroundColor: colors.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  borrowCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.warning,
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 20,
    marginBottom: 10,
  },
  borrowerCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  infoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconMargin: {
    marginRight: 6,
  },
  borrowerName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metaCell: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  metaValueBold: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  metaValue: {
    fontSize: 13,
    color: colors.text,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  dateBlock: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  returnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  returnBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.success,
  },
});

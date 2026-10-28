import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useBooks } from '../context/BookContext';
import { colors } from '../theme/colors';
import { StatCard } from '../components/StatCard';
import { SearchInput } from '../components/SearchInput';
import { CategoryFilter } from '../components/CategoryFilter';
import { BookCard } from '../components/BookCard';
import type { RootStackParamList } from '../types/navigation';
import type { FilterCategory } from '../constants/categories';
import type { Book } from '../types/book';

type Props = NativeStackScreenProps<RootStackParamList, 'BookList'>;

export const BookListScreen: React.FC<Props> = ({ navigation }) => {
  const { books, loading, deleteBook, totalBooks, totalBorrowed } = useBooks();

  // State Tìm kiếm và Lọc (Câu 5)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('Tất cả');

  // Lọc dữ liệu kết hợp đồng thời (Câu 5)
  const filteredBooks = useMemo(() => {
    return books.filter((item) => {
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        query === '' ||
        item.title.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query);

      const matchCategory =
        selectedCategory === 'Tất cả' || item.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [books, searchQuery, selectedCategory]);

  // Mở màn hình Chi tiết (Câu 4)
  const handlePressBook = (book: Book) => {
    navigation.navigate('BookDetail', { bookId: book.id });
  };

  // Nhấn giữ để xoá sách (Câu 3)
  const handleLongPressBook = (book: Book) => {
    if (book.borrowed > 0) {
      Alert.alert(
        'Không thể xoá sách',
        `Cuốn sách "${book.title}" hiện có ${book.borrowed} cuốn đang được mượn. Chỉ có thể xoá khi toàn bộ sách đã được hoàn trả.`,
        [{ text: 'Đã hiểu' }]
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
              Alert.alert('Thành công', 'Đã xoá cuốn sách khỏi hệ thống.');
            }
          },
        },
      ]
    );
  };

  // Trạng thái danh sách rỗng (Câu 7)
  const renderEmptyComponent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      );
    }

    const hasFilter = searchQuery.trim() !== '' || selectedCategory !== 'Tất cả';

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={36} color={colors.textMuted} style={styles.emptyIcon} />
        <Text style={styles.emptyTitle}>
          {hasFilter ? 'Không tìm thấy kết quả' : 'Chưa có sách nào trong thư viện'}
        </Text>
        <Text style={styles.emptySubtitle}>
          {hasFilter
            ? 'Thử thay đổi từ khoá tìm kiếm hoặc chọn danh mục khác'
            : 'Nhấn nút "+ Thêm sách" để tạo cuốn sách đầu tiên'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* Header thanh lịch */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thư Viện</Text>
      </View>

      {/* FlatList chính (Câu 1) */}
      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            onPress={handlePressBook}
            onLongPress={handleLongPressBook}
          />
        )}
        ListHeaderComponent={
          <>
            {/* Thống kê (Câu 1) */}
            <StatCard totalBooks={totalBooks} totalBorrowed={totalBorrowed} />

            {/* Ô tìm kiếm (Câu 5) */}
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              onClear={() => setSearchQuery('')}
            />

            {/* Bộ lọc thể loại (Câu 5) */}
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Tiêu đề & Đếm */}
            <View style={styles.listHeaderRow}>
              <Text style={styles.listHeading}>Danh mục sách</Text>
              <Text style={styles.listCountBadge}>{filteredBooks.length} cuốn</Text>
            </View>
          </>
        }
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Nút nổi "+ Thêm sách" mở Form (Câu 2) */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.navigate('BookForm')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={18} color="#FFFFFF" style={styles.fabIcon} />
        <Text style={styles.fabText}>Thêm sách</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  listContent: {
    paddingBottom: 90,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
  },
  listHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  listCountBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  centerContainer: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyContainer: {
    paddingVertical: 50,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  fabButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  fabIcon: {
    marginRight: 4,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

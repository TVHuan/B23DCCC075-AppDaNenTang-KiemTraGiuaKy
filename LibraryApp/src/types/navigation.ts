import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  BookList: undefined;
  BookDetail: { bookId: string };
  BookForm: { bookId?: string } | undefined;
};

export type BookListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookList'>;
export type BookDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookDetail'>;
export type BookFormNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookForm'>;

export type BookDetailRouteProp = RouteProp<RootStackParamList, 'BookDetail'>;
export type BookFormRouteProp = RouteProp<RootStackParamList, 'BookForm'>;

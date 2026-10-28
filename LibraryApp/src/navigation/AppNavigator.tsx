import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BookListScreen } from '../screens/BookListScreen';
import { BookDetailScreen } from '../screens/BookDetailScreen';
import { BookFormScreen } from '../screens/BookFormScreen';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="BookList"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 16,
          color: colors.text,
        },
        headerShadowVisible: false,
        headerBackTitle: 'Quay lại',
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="BookList"
        component={BookListScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BookDetail"
        component={BookDetailScreen}
        options={{
          title: 'Chi tiết sách',
        }}
      />
      <Stack.Screen
        name="BookForm"
        component={BookFormScreen}
        options={({ route }) => ({
          title: route.params?.bookId ? 'Chỉnh sửa sách' : 'Thêm sách mới',
        })}
      />
    </Stack.Navigator>
  );
};

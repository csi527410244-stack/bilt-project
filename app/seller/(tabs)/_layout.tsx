import { LayoutDashboard, MessageCircle, ClipboardList, Store, User } from 'lucide-react-native';
import { router, Tabs } from 'expo-router';

import { BRAND } from '@/lib/brand';

/**
 * 賣家分頁導覽。畫面留在記憶體裡，切分頁不重新掛載，
 * 底部導覽與頁首在載入資料時不會消失。
 */
export default function SellerTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: BRAND.white },
        headerTitleStyle: { color: BRAND.navy, fontWeight: '600' },
        headerTintColor: BRAND.navy,
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: BRAND.background },
        tabBarStyle: {
          backgroundColor: BRAND.white,
          borderTopColor: BRAND.border,
        },
        tabBarActiveTintColor: BRAND.navy,
        tabBarInactiveTintColor: BRAND.muted,
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="marketplace"
        options={{
          title: '市集',
          tabBarLabel: '市集',
          tabBarIcon: ({ color, size }) => <Store color={color} size={size ?? 24} />,
        }}
        listeners={{
          // 「市集」不是賣家畫面，而是切回買家端。
          tabPress: (event) => {
            event.preventDefault();
            router.replace('/');
          },
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: '賣家中心',
          tabBarLabel: '首頁',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size ?? 24} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: '賣家訂單',
          tabBarLabel: '訂單',
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size ?? 24} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: '買家訊息',
          tabBarLabel: '訊息',
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size ?? 24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '賣家帳號',
          tabBarLabel: '我的',
          tabBarIcon: ({ color, size }) => <User color={color} size={size ?? 24} />,
        }}
      />
    </Tabs>
  );
}

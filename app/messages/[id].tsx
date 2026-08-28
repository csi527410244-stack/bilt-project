import { useLocalSearchParams } from 'expo-router';

import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScreenScaffold
      title="聊天"
      subtitle={`對話編號：${id ?? '未指定'}`}
      sections={['訊息列表（倒序）', '輸入列與鍵盤避讓', '商品／訂單引用卡片', '圖片傳送']}
    />
  );
}

import { Button } from 'heroui-native';
import { ChevronLeft } from 'lucide-react-native';
import { usePathname, type Href } from 'expo-router';

import { BRAND } from '@/lib/brand';
import { useAppMode } from '@/lib/mode';
import { goBackOrReplace, parentRouteFor } from '@/lib/navigation';

/**
 * 推入畫面的頁首返回鍵。先退上一頁；沒有上一頁時（重新整理、通知點進來、分享連結）
 * 退到這個功能所屬的清單 —— 賣家功能回賣家「我的」、買家功能回買家「我的」、
 * 詳情頁回它的列表，不會一律跳回首頁。
 */
export function BackButton({ fallback }: { fallback?: Href }) {
  const pathname = usePathname();
  const mode = useAppMode();
  const target = fallback ?? parentRouteFor(pathname, mode);

  return (
    <Button
      variant="ghost"
      size="sm"
      isIconOnly
      className="ml-1"
      onPress={() => goBackOrReplace(target)}
      accessibilityLabel="返回"
    >
      <ChevronLeft size={24} color={BRAND.navy} />
    </Button>
  );
}

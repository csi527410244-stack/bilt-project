import { useRef, type ReactNode } from 'react';
import { Platform, Pressable } from 'react-native';
import { Typography } from 'heroui-native';
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { Trash2 } from 'lucide-react-native';

import { BRAND } from '@/lib/brand';

const ACTION_WIDTH = 88;

/**
 * 露出來的刪除區塊。translation 是卡片目前被拖走的距離，加回自己的寬度就會
 * 剛好貼在卡片右邊跟著手指走。
 */
function DeleteAction({
  translation,
  label,
  onPress,
}: {
  translation: SharedValue<number>;
  label: string;
  onPress: () => void;
}) {
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translation.value + ACTION_WIDTH }],
  }));

  return (
    <Reanimated.View style={[{ width: ACTION_WIDTH }, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        className="ml-2 flex-1 items-center justify-center gap-1 rounded-2xl"
        style={({ pressed }) => ({
          backgroundColor: BRAND.danger,
          opacity: pressed ? 0.85 : 1,
          ...(Platform.OS === 'web' ? { cursor: 'pointer' } : null),
        })}
      >
        <Trash2 size={18} color={BRAND.white} />
        <Typography type="body-xs" className="text-white" style={{ fontWeight: '700' }}>
          {label}
        </Typography>
      </Pressable>
    </Reanimated.View>
  );
}

type Props = {
  children: ReactNode;
  onDelete: () => void;
  /** 刪除鍵上的文字。 */
  label?: string;
};

/**
 * 往左滑動露出刪除鍵的列。滑到底不會直接刪掉 —— 要再點一下紅色的刪除，
 * 免得手指擦過清單就少一則通知。
 */
export function SwipeToDelete({ children, onDelete, label = '刪除' }: Props) {
  const swipeable = useRef<SwipeableMethods | null>(null);

  return (
    <ReanimatedSwipeable
      ref={swipeable}
      friction={2}
      rightThreshold={ACTION_WIDTH * 0.5}
      dragOffsetFromRightEdge={12}
      overshootRight={false}
      renderRightActions={(_progress, translation) => (
        <DeleteAction
          translation={translation}
          label={label}
          onPress={() => {
            swipeable.current?.close();
            onDelete();
          }}
        />
      )}
    >
      {children}
    </ReanimatedSwipeable>
  );
}

/**
 * ECPay 支付免責聲明模態
 * 
 * 在用戶點擊"⚡立即購買"並進入 ECPay 結帳前，必須顯示此模態以確認用戶理解：
 * 1. 平台不經手款項
 * 2. 款項直接進入賣家的 ECPay 帳戶
 * 3. 平台不負責物流和退款糾紛
 */

import { Modal, Pressable, ScrollView, View } from 'react-native';
import { Button, Typography } from 'heroui-native';
import { AlertCircle } from 'lucide-react-native';
import { BRAND } from '@/lib/brand';

type Props = {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * ECPay 支付免責聲明模態
 */
export function EcpayDisclaimerModal({ isVisible, onConfirm, onCancel }: Props) {
  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center bg-black/50">
        <View
          className="bg-surface mx-4 max-w-sm rounded-2xl p-6"
          style={{
            shadowColor: BRAND.navy,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          {/* 標題 */}
          <View className="mb-4 flex-row items-center gap-3">
            <View
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: BRAND.orangeSoft }}
            >
              <AlertCircle size={20} color={BRAND.orange} />
            </View>
            <Typography
              type="h6"
              className="text-navy flex-1"
              style={{ fontWeight: '700' }}
            >
              交易款項說明
            </Typography>
          </View>

          {/* 免責聲明內容 */}
          <ScrollView
            scrollEnabled
            className="mb-6"
            contentContainerClassName="gap-3"
          >
            <Typography type="body-sm" className="text-navy leading-6">
              <Typography type="body-sm" style={{ fontWeight: '600' }}>
                本平台為免費技術媒合平台
              </Typography>
              {'\n\n'}
              交易款項直連綠界 (ECPay) 並撥款至賣家專屬綠界帳戶。
              {'\n\n'}
              <Typography type="body-sm" style={{ fontWeight: '600' }}>
                平台責任說明
              </Typography>
              {'\n'}
              • 平台不經手、不代管任何款項{'\n'}
              • 物流退款糾紛請直洽賣家或綠界客服{'\n'}
              • 平台不負任何法律代償責任
            </Typography>

            <View
              className="rounded-lg px-3 py-2"
              style={{ backgroundColor: BRAND.orangeSoft }}
            >
              <Typography
                type="body-xs"
                className="text-orange-900"
                style={{ fontWeight: '500' }}
              >
                💡 若您對交易流程或資金安全有疑慮，請先聯絡賣家或平台客服確認。
              </Typography>
            </View>
          </ScrollView>

          {/* 按鈕 */}
          <View className="gap-2">
            <Button onPress={onConfirm}>
              <Button.Label>我已理解並同意</Button.Label>
            </Button>
            <Button variant="secondary" onPress={onCancel}>
              <Button.Label>返回</Button.Label>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function CheckoutScreen() {
  return (
    <ScreenScaffold
      title="結帳"
      subtitle="收件資訊、配送方式、付款方式與訂單確認。"
      sections={[
        '收件人與地址',
        '配送方式與運費',
        '優惠券與J幣折抵',
        '付款方式',
        '訂單金額明細與送出',
      ]}
    />
  );
}

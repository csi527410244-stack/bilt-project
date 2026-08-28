import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function ProfileEditScreen() {
  return (
    <ScreenScaffold
      title="編輯個人資料"
      subtitle="頭像、暱稱、聯絡方式與收件地址。"
      sections={['頭像上傳', '暱稱與聯絡資訊表單', '預設收件地址', '儲存與驗證錯誤']}
    />
  );
}

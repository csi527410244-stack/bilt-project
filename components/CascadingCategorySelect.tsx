/**
 * 級聯類別選擇器
 *
 * 實現兩層級聯：
 * 1. 選擇主類別（例如 "3C科技"）
 * 2. 自動加載並顯示子類別（例如 "手機"、"電腦"、"耳機"）
 */

import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Select, Typography } from 'heroui-native';
import { BRAND } from '@/lib/brand';

export type CascadingCategory = {
  primaryCategoryId: string;
  primaryCategoryName: string;
  subCategoryId?: string;
  subCategoryName?: string;
};

/**
 * 類別階層結構（模擬後端數據）
 */
const CATEGORY_HIERARCHY: Record<
  string,
  { name: string; subcategories: Array<{ id: string; name: string }> }
> = {
  '3c': {
    name: '3C科技',
    subcategories: [
      { id: '3c-phone', name: '手機' },
      { id: '3c-computer', name: '電腦' },
      { id: '3c-earbuds', name: '耳機' },
      { id: '3c-camera', name: '相機' },
      { id: '3c-gaming', name: '遊戲設備' },
    ],
  },
  fashion: {
    name: '服飾配飾',
    subcategories: [
      { id: 'fashion-mens', name: '男裝' },
      { id: 'fashion-womens', name: '女裝' },
      { id: 'fashion-shoes', name: '鞋類' },
      { id: 'fashion-bags', name: '包包' },
      { id: 'fashion-accessories', name: '配飾' },
    ],
  },
  home: {
    name: '居家生活',
    subcategories: [
      { id: 'home-furniture', name: '家具' },
      { id: 'home-decor', name: '裝飾品' },
      { id: 'home-kitchen', name: '廚房用品' },
      { id: 'home-bedding', name: '寢具' },
    ],
  },
};

type Props = {
  value?: CascadingCategory;
  onChange: (value: CascadingCategory) => void;
};

/**
 * 級聯類別選擇器組件
 */
export function CascadingCategorySelect({ value, onChange }: Props) {
  const [primaryId, setPrimaryId] = useState(value?.primaryCategoryId ?? '');
  const [subId, setSubId] = useState(value?.subCategoryId ?? '');

  // 獲取當前選中主類別的子類別
  const subcategories = useMemo(() => {
    if (!primaryId) return [];
    return CATEGORY_HIERARCHY[primaryId]?.subcategories ?? [];
  }, [primaryId]);

  const primaryName = primaryId ? (CATEGORY_HIERARCHY[primaryId]?.name ?? '') : '';
  const subName = subcategories.find((sub) => sub.id === subId)?.name ?? '';

  // 當主類別改變時，重置子類別並觸發回調
  useEffect(() => {
    setSubId('');
    if (primaryId) {
      const primary = CATEGORY_HIERARCHY[primaryId];
      if (primary) {
        onChange({
          primaryCategoryId: primaryId,
          primaryCategoryName: primary.name,
          subCategoryId: undefined,
          subCategoryName: undefined,
        });
      }
    }
  }, [primaryId, onChange]);

  // 當子類別改變時，觸發回調
  useEffect(() => {
    if (primaryId && subId) {
      const primary = CATEGORY_HIERARCHY[primaryId];
      const sub = subcategories.find((s) => s.id === subId);
      if (primary && sub) {
        onChange({
          primaryCategoryId: primaryId,
          primaryCategoryName: primary.name,
          subCategoryId: subId,
          subCategoryName: sub.name,
        });
      }
    }
  }, [subId, primaryId, subcategories, onChange]);

  return (
    <View className="gap-4">
      {/* 主類別選擇 */}
      <View>
        <Typography type="body-sm" className="text-navy mb-2" style={{ fontWeight: '600' }}>
          主類別
        </Typography>
        <Select
          value={primaryId ? { value: primaryId, label: primaryName } : undefined}
          onValueChange={(option) => {
            const selected = Array.isArray(option) ? option[0] : option;
            setPrimaryId(selected?.value ?? '');
          }}
        >
          <Select.Trigger className="w-full">
            <Select.Value placeholder="選擇主類別" />
            <Select.TriggerIndicator />
          </Select.Trigger>
          <Select.Portal>
            <Select.Overlay />
            <Select.Content presentation="popover">
              {Object.entries(CATEGORY_HIERARCHY).map(([key, entry]) => (
                <Select.Item key={key} value={key} label={entry.name} />
              ))}
            </Select.Content>
          </Select.Portal>
        </Select>
      </View>

      {/* 子類別選擇（僅在選中主類別時顯示） */}
      {primaryId && subcategories.length > 0 ? (
        <View>
          <Typography type="body-sm" className="text-navy mb-2" style={{ fontWeight: '600' }}>
            子類別
          </Typography>
          <Select
            value={subId ? { value: subId, label: subName } : undefined}
            onValueChange={(option) => {
              const selected = Array.isArray(option) ? option[0] : option;
              setSubId(selected?.value ?? '');
            }}
          >
            <Select.Trigger className="w-full">
              <Select.Value placeholder="選擇子類別" />
              <Select.TriggerIndicator />
            </Select.Trigger>
            <Select.Portal>
              <Select.Overlay />
              <Select.Content presentation="popover">
                {subcategories.map((sub) => (
                  <Select.Item key={sub.id} value={sub.id} label={sub.name} />
                ))}
              </Select.Content>
            </Select.Portal>
          </Select>
        </View>
      ) : null}

      {/* 選擇摘要 */}
      {primaryId ? (
        <View className="rounded-lg p-3" style={{ backgroundColor: BRAND.blueSoft }}>
          <Typography type="body-xs" className="text-brand-blue">
            已選擇:{' '}
            <Typography type="body-xs" className="text-brand-blue" style={{ fontWeight: '700' }}>
              {primaryName}
              {subName ? ` > ${subName}` : ''}
            </Typography>
          </Typography>
        </View>
      ) : null}
    </View>
  );
}

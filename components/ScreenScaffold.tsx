import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from 'heroui-native';

interface ScreenScaffoldProps {
  /** Screen heading. Keep it identical to the route title. */
  title: string;
  /** One line describing what this screen is for. */
  subtitle?: string;
  /** Planned blocks for this screen, shown as a checklist of pending work. */
  sections?: string[];
  children?: ReactNode;
}

/**
 * Shared frame for screens whose content has not been supplied yet. Keeps
 * routing, headers and safe areas verifiable before the real UI lands.
 */
export function ScreenScaffold({ title, subtitle, sections, children }: ScreenScaffoldProps) {
  return (
    <View className="bg-background flex-1">
      <ScrollView
        contentContainerClassName="gap-4 p-4 pb-safe-offset-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-1">
          <Text.Heading type="h3">{title}</Text.Heading>
          {subtitle ? <Text.Paragraph color="muted">{subtitle}</Text.Paragraph> : null}
        </View>

        {sections && sections.length > 0 ? (
          <View className="border-border bg-surface gap-3 rounded-2xl border p-4">
            <Text.Paragraph className="font-semibold">預計內容</Text.Paragraph>
            {sections.map((section) => (
              <View key={section} className="flex-row items-start gap-2">
                <View className="bg-brand-gold mt-2 size-1.5 rounded-full" />
                <Text.Paragraph className="flex-1">{section}</Text.Paragraph>
              </View>
            ))}
          </View>
        ) : null}

        {children}

        <View className="border-border bg-surface-secondary rounded-2xl border border-dashed p-4">
          <Text.Paragraph color="muted" className="text-sm">
            此畫面的路由與導覽已就緒，等待貼入實際內容。
          </Text.Paragraph>
        </View>
      </ScrollView>
    </View>
  );
}

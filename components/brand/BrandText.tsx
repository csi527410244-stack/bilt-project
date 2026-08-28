import { useEffect, useRef } from 'react';
import { Platform, Text, type TextProps } from 'react-native';

/**
 * Text that browsers (and Google Translate) must leave alone — brand names
 * such as 極貨網 and J幣. react-native-web does not forward `translate`, so the
 * attribute and the `notranslate` class are set on the DOM node after mount.
 */
export function BrandText({ children, ...rest }: TextProps) {
  const ref = useRef<Text | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const node = ref.current as unknown as HTMLElement | null;
    if (!node) return;
    node.setAttribute('translate', 'no');
    node.classList.add('notranslate');
  }, []);

  return (
    <Text ref={ref} {...rest}>
      {children}
    </Text>
  );
}

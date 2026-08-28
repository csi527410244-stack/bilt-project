/**
 * 極貨網 brand palette.
 *
 * These hex values mirror the semantic tokens declared in `global.css`
 * (see the `@variant light` block and the `--color-brand-*` utilities).
 * Use `className` tokens inside components; use `BRAND.*` only where a raw
 * color string is required (React Navigation header/tab tints, StatusBar,
 * SystemUI, lucide icon `color`, shadow colors).
 */
export const BRAND = {
  /** Product name. Never translate this string. */
  name: '極貨網',
  /** Primary brand color — deep navy used for headers, titles and CTAs. */
  navy: '#14274E',
  /** Lighter navy for secondary text and pressed states. */
  navySoft: '#3A4E75',
  /** Highlight color — used for coins (J幣), promotions and ratings. */
  gold: '#E8A33D',
  /** App canvas behind screens. */
  background: '#F4F6FA',
  /** Cards, sheets, headers. */
  white: '#FFFFFF',
  /** Hairlines and dividers. */
  border: '#E2E7F0',
  /** Secondary / placeholder text. */
  muted: '#7A879C',
  /** Positive states (paid, shipped, in stock). */
  success: '#2F9E6B',
  /** Destructive states (cancel, delete, out of stock). */
  danger: '#D64545',
} as const;

export type BrandColor = keyof typeof BRAND;

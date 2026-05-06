import { Fraunces, Manrope, JetBrains_Mono } from 'next/font/google';

/**
 * Fraunces — variable display/serif font (Latin only; no Cyrillic support).
 * Used for headings via --font-display CSS variable.
 * opsz axis: optical sizing (adjusts letterforms for different sizes).
 */
export const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-display',
  display: 'swap',
});

/**
 * Manrope — variable geometric sans-serif (supports Latin + Cyrillic).
 * Used for body text via --font-sans CSS variable.
 */
export const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
});

/**
 * JetBrains Mono — monospace font for code/numbers.
 * Used via --font-mono CSS variable.
 */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

/**
 * Combined className string with all 3 font CSS variable declarations.
 * Apply to <html> element in each app's root layout.
 *
 * @example
 * <html className={fontVariables}>
 */
export const fontVariables = `${fraunces.variable} ${manrope.variable} ${jetbrainsMono.variable}`;

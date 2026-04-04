import type { Config } from 'tailwindcss';
import { tailwindThemeExtension } from '../../packages/ui/tokens';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: tailwindThemeExtension,
  },
  plugins: [],
};

export default config;

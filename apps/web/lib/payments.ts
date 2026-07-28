// Single source of truth for the direct-payment handles (CashApp / Venmo /
// PayPal / Apple Cash).
//
// These render in three places: the donate page chip row
// (components/donate/index.tsx), the footer's text links
// (components/shared/Footer.tsx), and the rodeo event page's fuel-fund chips
// (app/events/bff-spring-fishing-rodeo-2026/page.tsx). Before this file existed
// the two PayPal renderings DISAGREED — paypal.me/bayoucharity on the donate
// page vs paypal.com/paypalme/bayoucharity in the footer. paypal.me is the
// canonical short link; if a handle or URL ever changes, change it here only.
export interface PaymentMethod {
  emoji: string;
  label: string;
  handle: string;
  href: string | null; // null = no link target (e.g. Apple Cash is send-by-email)
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { emoji: '💚', label: 'CashApp', handle: '$bayoucharity', href: 'https://cash.app/$bayoucharity' },
  { emoji: '💜', label: 'Venmo', handle: '@bayoucharity', href: 'https://venmo.com/bayoucharity' },
  { emoji: '🔵', label: 'PayPal', handle: '@bayoucharity', href: 'https://paypal.me/bayoucharity' },
  { emoji: '🍎', label: 'Apple Cash', handle: 'kyle.rockefeller@icloud.com', href: null },
];

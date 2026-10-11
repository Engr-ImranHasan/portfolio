/** Tailwind CSS build config — Imran Hasan Portfolio
 *  Run: npx tailwindcss -i ./src/input.css -o ./assets/css/styles.css --minify
 */
module.exports = {
  content: [
    './index.html',
    './assets/js/**/*.js'
  ],
  safelist: [
    // classes toggled dynamically by JS (carousel dots / thumbnails / nav states)
    'w-6', 'bg-blue-500', 'border-blue-500', 'ring-blue-500',
    'opacity-100', 'opacity-40', 'is-active', 'is-center', 'is-visible'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark:   '#020617',
          card:   '#0f172a',
          accent: '#2563eb',
          glow:   '#3b82f6',
          gold:   '#f59e0b',
          emerald:'#10b981'
        }
      },
      fontFamily: {
        sans:    ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['"Space Grotesk"', 'Outfit', 'ui-sans-serif', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      maxWidth: { '8xl': '88rem' },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
}
